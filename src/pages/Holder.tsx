import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

import { Masthead } from '@/components/Masthead'
import { Nav } from '@/components/Nav'
import { Colophon } from '@/components/Colophon'
import { HolderActions } from '@/components/HolderActions'
import { CellReadout } from '@/components/Readouts'
import { toast } from '@/components/Toast'

import { getActiveToken, getTokenByContract } from '@/config/tokens'
import { usePceState } from '@/hooks/usePceState'
import { decodeReceiptFromUrl, type SignedReceipt } from '@/hooks/useEip712'
import { pceAbi } from '@/abi/pce'

export function HolderPage() {
  const [searchParams] = useSearchParams()
  const receiptParam = searchParams.get('r')

  const [receipt, setReceipt] = useState<SignedReceipt | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)

  const { address } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  // Decode receipt from URL if present
  useEffect(() => {
    if (!receiptParam) return
    try {
      const r = decodeReceiptFromUrl(receiptParam)
      setReceipt(r)
    } catch (e) {
      setParseError('Invalid receipt link — could not decode')
    }
  }, [receiptParam])

  // Pick token from receipt's contract address, fallback to active
  const token = receipt
    ? getTokenByContract(receipt.contract) ?? getActiveToken()
    : getActiveToken()

  const { cell } = usePceState(token)

  const isHolderForReceipt =
    receipt && address && address.toLowerCase() === receipt.message.owner.toLowerCase()

  const onSubmitReceipt = () => {
    if (!receipt || !token) return
    if (!address) {
      toast('Connect a wallet first')
      return
    }
    if (!isHolderForReceipt) {
      toast(`This receipt was issued for ${receipt.message.owner.slice(0, 6)}…${receipt.message.owner.slice(-4)}. Connect that wallet.`)
      return
    }
    writeContract(
      {
        address: token.pceContract,
        abi: pceAbi,
        functionName: 'executePCE',
        args: [receipt.message.receiptHash, receipt.signature],
      },
      {
        onSuccess: () => toast('Mitosis tx submitted — waiting for confirmation'),
        onError: (e) => {
          const msg = (e as Error & { shortMessage?: string }).shortMessage ?? e.message
          toast(msg.slice(0, 100))
        },
      }
    )
  }

  return (
    <div className="frame">
      <Masthead />
      <Nav />

      {parseError && (
        <section className="panel" style={{ borderColor: 'var(--blood)' }}>
          <h2 style={{ color: 'var(--blood)' }}>Receipt link error</h2>
          <p>{parseError}</p>
        </section>
      )}

      {receipt && token && (
        <section className="panel" style={{ borderWidth: 2 }}>
          <h2>
            Signed Receipt <span className="num">// awaiting submission</span>
          </h2>

          <div className="readout" style={{ marginBottom: 20 }}>
            <div className="cell">
              <div className="label">Token</div>
              <div className="value small">NFT #{token.tokenId} · {token.label}</div>
            </div>
            <div className="cell">
              <div className="label">Step</div>
              <div className="value">{receipt.message.step} → {Number(receipt.message.step) + 1}</div>
            </div>
            <div className="cell">
              <div className="label">Issued for</div>
              <div className="value small">{receipt.message.owner}</div>
            </div>
            <div className="cell">
              <div className="label">Receipt hash</div>
              <div className="value small">{receipt.message.receiptHash.slice(0, 18)}…</div>
            </div>
            {receipt.label && (
              <div className="cell full">
                <div className="label">Receipt label</div>
                <div className="value small">{receipt.label}</div>
              </div>
            )}
          </div>

          <button
            className="btn"
            disabled={!address || isPending || isConfirming || isSuccess}
            onClick={onSubmitReceipt}
            style={{ width: '100%', padding: 16 }}
          >
            {!address && 'Connect wallet to submit'}
            {address && isPending && 'Confirming in wallet…'}
            {address && isConfirming && 'Waiting for blockchain…'}
            {address && isSuccess && 'Mitosis complete ✓'}
            {address && !isPending && !isConfirming && !isSuccess && 'Submit Mitosis (executePCE)'}
          </button>

          {address && !isHolderForReceipt && (
            <p style={{ marginTop: 12, fontSize: 13, color: 'var(--blood)', fontStyle: 'italic' }}>
              Wallet mismatch. This receipt was issued for {receipt.message.owner.slice(0, 6)}…{receipt.message.owner.slice(-4)}.
            </p>
          )}
        </section>
      )}

      {!receipt && token && (
        <>
          <section className="panel">
            <h2>
              No receipt link <span className="num">// {token.label}</span>
            </h2>
            <p style={{ marginBottom: 16, fontStyle: 'italic' }}>
              You're viewing the holder page without a signed receipt. To execute a mitosis,
              the shopkeeper must issue you a signed receipt link from the Owner panel.
              Below you can still claim the entry bonus or invoke buyback if conditions are met.
            </p>
            <CellReadout cell={cell} />
          </section>

          <HolderActions token={token} cell={cell} />
        </>
      )}

      <Colophon />
    </div>
  )
}
