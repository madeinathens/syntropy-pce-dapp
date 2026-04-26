import { useState, useMemo } from 'react'
import { useAccount, useSignTypedData } from 'wagmi'
import { isAddress } from 'viem'

import { Masthead } from '@/components/Masthead'
import { Nav } from '@/components/Nav'
import { Colophon } from '@/components/Colophon'
import { toast } from '@/components/Toast'
import { CellReadout } from '@/components/Readouts'

import { getActiveToken } from '@/config/tokens'
import { usePceState } from '@/hooks/usePceState'
import {
  EXECUTE_PCE_DOMAIN,
  EXECUTE_PCE_TYPES,
  hashReceipt,
  encodeReceiptForUrl,
  type SignedReceipt,
} from '@/hooks/useEip712'

export function OwnerPage() {
  const active = getActiveToken()
  const { cell } = usePceState(active)
  const { address } = useAccount()
  const { signTypedDataAsync, isPending } = useSignTypedData()

  const [holderAddr, setHolderAddr] = useState('')
  const [receiptLabel, setReceiptLabel] = useState('')
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [signedReceipt, setSignedReceipt] = useState<SignedReceipt | null>(null)

  const isOwner = useMemo(() => {
    if (!address || !cell) return false
    return address.toLowerCase() === cell.ownerOnchain.toLowerCase()
  }, [address, cell])

  const canSign =
    isOwner && active && cell && isAddress(holderAddr) && receiptLabel.trim().length > 0

  const handleSign = async () => {
    if (!canSign || !active || !cell) return

    try {
      const receiptHash = hashReceipt(receiptLabel.trim())
      const message = {
        owner: holderAddr as `0x${string}`,
        tokenId: BigInt(active.tokenId),
        step: BigInt(cell.step),
        receiptHash,
      }

      const signature = await signTypedDataAsync({
        domain: EXECUTE_PCE_DOMAIN(8453, active.pceContract),
        types: EXECUTE_PCE_TYPES,
        primaryType: 'ExecuteMitosis',
        message,
      })

      const signed: SignedReceipt = {
        contract: active.pceContract,
        chainId: 8453,
        message: {
          owner: message.owner,
          tokenId: message.tokenId.toString(),
          step: message.step.toString(),
          receiptHash,
        },
        signature,
        label: receiptLabel.trim(),
        expiresAt: Math.floor(Date.now() / 1000) + 48 * 60 * 60,
      }

      const encoded = encodeReceiptForUrl(signed)
      const baseUrl = window.location.origin + window.location.pathname.replace(/\/owner.*$/, '')
      const url = `${baseUrl}/holder?r=${encoded}`

      setSignedReceipt(signed)
      setSignedUrl(url)
      toast('Receipt signed — share the link with the customer')
    } catch (e) {
      const msg = (e as Error).message
      toast(msg.slice(0, 100))
    }
  }

  const copyLink = async () => {
    if (!signedUrl) return
    try {
      await navigator.clipboard.writeText(signedUrl)
      toast('Link copied to clipboard')
    } catch {
      toast('Could not copy — select the text manually')
    }
  }

  const reset = () => {
    setHolderAddr('')
    setReceiptLabel('')
    setSignedUrl(null)
    setSignedReceipt(null)
  }

  return (
    <div className="frame">
      <Masthead />
      <Nav />

      <section className="panel" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
        <h2 style={{ color: 'var(--paper)' }}>
          Owner Panel <span className="num">// EIP-712 receipt issuance</span>
        </h2>
        <p style={{ fontStyle: 'italic', color: 'var(--gold-soft)', marginBottom: 0 }}>
          Sign mitosis receipts here. The customer opens the issued link, connects their wallet,
          and submits the signed receipt to executePCE() on chain.
        </p>
      </section>

      {!active && (
        <section className="panel">
          <h2>No active token</h2>
          <p>Configure an active token in <code>src/config/tokens.ts</code>.</p>
        </section>
      )}

      {active && (
        <>
          <section className="panel">
            <h2>
              Active context <span className="num">// {active.label}</span>
            </h2>
            <CellReadout cell={cell} />
            <div style={{ marginTop: 16, padding: 12, background: isOwner ? 'rgba(29,122,29,0.1)' : 'rgba(139,0,0,0.08)', border: `1px solid ${isOwner ? 'var(--green)' : 'var(--blood)'}` }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em' }}>
                {!address && 'Wallet disconnected — connect to sign'}
                {address && isOwner && '✓ You are the contract Oracle — signing enabled'}
                {address && !isOwner && cell && `✗ Connected wallet is not the Oracle. Oracle: ${cell.ownerOnchain.slice(0, 6)}…${cell.ownerOnchain.slice(-4)}`}
              </div>
            </div>
          </section>

          {!signedUrl && (
            <section className="panel">
              <h2>Issue new receipt</h2>

              <div className="form-row">
                <label>Customer wallet address (the holder of NFT)</label>
                <input
                  type="text"
                  value={holderAddr}
                  onChange={(e) => setHolderAddr(e.target.value.trim())}
                  placeholder="0x..."
                />
                {holderAddr && !isAddress(holderAddr) && (
                  <div style={{ color: 'var(--blood)', fontSize: 12, marginTop: 4 }}>Invalid address</div>
                )}
              </div>

              <div className="form-row">
                <label>Receipt label · physical store reference (will be hashed)</label>
                <input
                  type="text"
                  value={receiptLabel}
                  onChange={(e) => setReceiptLabel(e.target.value)}
                  placeholder="LIL-2026-04-25-00134"
                />
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(10,10,10,0.5)', marginTop: 4 }}>
                  Examples: receipt number, sale id, IPFS CID of receipt photo, etc. Hashed on-chain via keccak256.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button
                  className="btn"
                  disabled={!canSign || isPending}
                  onClick={handleSign}
                >
                  {isPending ? 'Signing in wallet…' : 'Sign EIP-712 receipt'}
                </button>
                <button className="btn outline" onClick={reset}>
                  Clear
                </button>
              </div>

              {!isOwner && address && (
                <p style={{ marginTop: 16, fontSize: 13, color: 'var(--blood)', fontStyle: 'italic' }}>
                  This wallet cannot sign receipts — only the contract owner can.
                </p>
              )}
            </section>
          )}

          {signedUrl && signedReceipt && (
            <section className="panel" style={{ borderWidth: 2, borderColor: 'var(--gold)' }}>
              <h2>
                Receipt signed <span className="num">// share with customer</span>
              </h2>

              <div className="readout" style={{ marginBottom: 16 }}>
                <div className="cell">
                  <div className="label">Customer</div>
                  <div className="value small">{signedReceipt.message.owner}</div>
                </div>
                <div className="cell">
                  <div className="label">Step</div>
                  <div className="value">{signedReceipt.message.step} → {Number(signedReceipt.message.step) + 1}</div>
                </div>
                <div className="cell full">
                  <div className="label">Receipt hash</div>
                  <div className="value small">{signedReceipt.message.receiptHash}</div>
                </div>
              </div>

              <div className="form-row">
                <label>Customer link · valid until receipt is consumed on-chain</label>
                <textarea readOnly value={signedUrl} onClick={(e) => e.currentTarget.select()} />
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn" onClick={copyLink}>Copy link</button>
                <button className="btn outline" onClick={reset}>Issue another</button>
                <a className="btn outline" href={signedUrl} target="_blank" rel="noopener" style={{ textDecoration: 'none', borderBottom: 'none' }}>
                  Preview as customer ↗
                </a>
              </div>

              <p style={{ marginTop: 20, fontSize: 13, fontStyle: 'italic', color: 'rgba(10,10,10,0.7)' }}>
                Share this link via SMS, email, QR code, or print. The customer opens it, connects their wallet,
                and submits the mitosis. The signature is bound to: this token, this step, this receipt hash, this customer wallet.
                No other wallet can use it.
              </p>
            </section>
          )}
        </>
      )}

      <Colophon />
    </div>
  )
}
