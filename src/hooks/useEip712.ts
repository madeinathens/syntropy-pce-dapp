import { keccak256, toBytes, type Hex } from 'viem'

/**
 * EIP-712 typed data for executePCE.
 *
 * Matches CLAIM_TYPEHASH in the contract:
 *   ExecuteMitosis(address owner,uint256 tokenId,uint256 step,bytes32 receiptHash)
 *
 * The Oracle (contract owner) signs this; the Holder submits it to executePCE().
 */
export const EXECUTE_PCE_DOMAIN = (chainId: number, verifyingContract: Hex) =>
  ({
    name: 'SYNTROPY_PCE_15',
    version: '1',
    chainId,
    verifyingContract,
  }) as const

export const EXECUTE_PCE_TYPES = {
  ExecuteMitosis: [
    { name: 'owner',       type: 'address' },
    { name: 'tokenId',     type: 'uint256' },
    { name: 'step',        type: 'uint256' },
    { name: 'receiptHash', type: 'bytes32' },
  ],
} as const

export interface ReceiptMessage {
  owner: Hex          // The HOLDER address that will submit the tx
  tokenId: bigint
  step: bigint        // CURRENT tokenStep (next mitosis = step + 1)
  receiptHash: Hex
}

/**
 * Hash a free-text receipt label into bytes32.
 * Use this for shop receipts: hashReceipt("LIL-2026-04-25-00134")
 */
export function hashReceipt(label: string): Hex {
  return keccak256(toBytes(label))
}

/**
 * Encode the full signing payload as a JSON string that can be embedded in a URL.
 * The customer opens this URL → dApp decodes → submits to executePCE.
 *
 * Format: base64-url of { contract, message, signature }
 */
export interface SignedReceipt {
  contract: Hex
  chainId: number
  message: {
    owner: Hex
    tokenId: string       // bigint serialized
    step: string
    receiptHash: Hex
  }
  signature: Hex
  label?: string          // optional human-readable receipt label
  expiresAt?: number      // unix ts; warning only, contract doesn't check
}

export function encodeReceiptForUrl(r: SignedReceipt): string {
  const json = JSON.stringify(r)
  // base64url, no padding
  return btoa(json)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function decodeReceiptFromUrl(s: string): SignedReceipt {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  return JSON.parse(atob(padded + pad)) as SignedReceipt
}
