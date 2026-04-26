import { useReadContracts, useBlockNumber } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { formatUnits } from "viem";

import { pceAbi, erc721Abi } from "@/abi/pce";
import { ANCHORS, type TokenEntry } from "@/config/tokens";

export interface CellData {
  step: number;
  totalSteps: number;
  lastAction: number;
  isDead: boolean;
  epoch: number;
  holder: `0x${string}`;
  isEvicted: boolean;
  ownerOnchain: `0x${string}`; // Oracle / contract owner
}

export interface PoolData {
  erc20Owner: number; // human-readable, 18 decimals
  usdc: number; // human-readable, 6 decimals
  eth: number;
  erc20OwnerRaw: bigint;
  usdcRaw: bigint;
  ethRaw: bigint;
}

export interface PceState {
  cell: CellData | undefined;
  pool: PoolData | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

/**
 * Read everything we need from a PCE contract in a single multicall.
 * Auto-refreshes on every new block (Base ~2s).
 */
export function usePceState(token: TokenEntry | undefined): PceState {
  const queryClient = useQueryClient();

  const enabled = Boolean(token);

  const result = useReadContracts({
    allowFailure: true,
    query: { enabled },
    contracts: token
      ? [
          {
            address: token.pceContract,
            abi: pceAbi,
            functionName: "getCellState",
          },
          {
            address: token.pceContract,
            abi: pceAbi,
            functionName: "getPoolBalances",
          },
          {
            address: token.pceContract,
            abi: pceAbi,
            functionName: "isEvicted",
          },
          {
            address: token.pceContract,
            abi: pceAbi,
            functionName: "TOTAL_STEPS",
          },
          {
            address: token.pceContract,
            abi: pceAbi,
            functionName: "owner",
          },
          {
            address: ANCHORS.rwaNft,
            abi: erc721Abi,
            functionName: "ownerOf",
            args: [BigInt(token.tokenId)],
          },
        ]
      : [],
  });

  // Auto-invalidate every block so the UI feels live.
  const { data: blockNumber } = useBlockNumber({ watch: true, chainId: 8453 });
  useEffect(() => {
    if (!enabled) return;
    queryClient.invalidateQueries({ queryKey: result.queryKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  if (!result.data || result.isLoading) {
    return {
      cell: undefined,
      pool: undefined,
      isLoading: result.isLoading,
      isError: result.isError,
      refetch: result.refetch,
    };
  }

  // Pull each result by index. allowFailure: true means each can be undefined
  // or have status: 'failure'. We must guard every access.
  const cellRes = result.data[0];
  const poolRes = result.data[1];
  const evictedRes = result.data[2];
  const totalStepsRes = result.data[3];
  const ownerRes = result.data[4];
  const holderRes = result.data[5];

  let cell: CellData | undefined = undefined;
  if (
    cellRes &&
    cellRes.status === "success" &&
    holderRes &&
    holderRes.status === "success"
  ) {
    const c = cellRes.result; // [step, lastAction, isDead, epoch, holder]
    cell = {
      step: Number(c[0]),
      lastAction: Number(c[1]),
      isDead: c[2],
      epoch: Number(c[3]),
      holder: holderRes.result, // canonical from RWA NFT
      isEvicted:
        evictedRes && evictedRes.status === "success"
          ? evictedRes.result
          : false,
      totalSteps:
        totalStepsRes && totalStepsRes.status === "success"
          ? Number(totalStepsRes.result)
          : 33,
      ownerOnchain:
        ownerRes && ownerRes.status === "success"
          ? ownerRes.result
          : ZERO_ADDRESS,
    };
  }

  let pool: PoolData | undefined = undefined;
  if (poolRes && poolRes.status === "success") {
    const p = poolRes.result; // [erc20Owner, usdc, eth]
    pool = {
      erc20OwnerRaw: p[0],
      usdcRaw: p[1],
      ethRaw: p[2],
      erc20Owner: Number(formatUnits(p[0], 18)),
      usdc: Number(formatUnits(p[1], 6)),
      eth: Number(formatUnits(p[2], 18)),
    };
  }

  return {
    cell,
    pool,
    isLoading: result.isLoading,
    isError: result.isError,
    refetch: result.refetch,
  };
}
