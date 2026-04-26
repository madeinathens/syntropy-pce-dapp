import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { pceAbi } from '@/abi/pce'
import { toast } from './Toast'
import type { TokenEntry } from '@/config/tokens'
import type { CellData } from '@/hooks/usePceState'

interface Props {
  token: TokenEntry
  cell: CellData | undefined
}

export function HolderActions({ token, cell }: Props) {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending, reset } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const isHolder = address && cell && address.toLowerCase() === cell.holder.toLowerCase()

  const onAction = (fn: 'claimEntryBonus' | 'autonomousBuyback' | 'killDeadCell') => {
    if (!address) {
      toast('Connect a wallet first')
      return
    }
    if ((fn === 'claimEntryBonus' || fn === 'autonomousBuyback') && !isHolder) {
      toast('Only the NFT holder can call this')
      return
    }
    writeContract(
      {
        address: token.pceContract,
        abi: pceAbi,
        functionName: fn,
      },
      {
        onSuccess: () => toast('Transaction submitted — waiting for confirmation'),
        onError: (e) => {
          const msg = (e as Error & { shortMessage?: string }).shortMessage ?? e.message
          toast(msg.slice(0, 80))
          reset()
        },
      }
    )
  }

  const busy = isPending || isConfirming

  return (
    <section className="panel">
      <h2>
        Holder Rituals <span className="num">// requires NFT #{token.tokenId}</span>
      </h2>
      <div className="actions">
        <div className="action-card">
          <h3>claim entry bonus</h3>
          <p>One-time per epoch. Receive 1.10 USDC equivalent in ERC20_OWNER as your seed of entry.</p>
          <button
            className="btn"
            disabled={busy || !isHolder}
            onClick={() => onAction('claimEntryBonus')}
          >
            {busy ? 'Pending…' : 'Invoke claimEntryBonus()'}
          </button>
        </div>

        <div className="action-card">
          <h3>execute pce</h3>
          <p>Advance the Mitotic Ladder by one step. Requires an Oracle EIP-712 receipt — open the link your shopkeeper sent you.</p>
          <button
            className="btn outline"
            disabled
            title="Use the customer link issued by the Owner panel"
          >
            via signed receipt link
          </button>
        </div>

        <div className="action-card">
          <h3>autonomous buyback</h3>
          <p>If the cell is dead, surrender NFT and receive proportional USDC refund.</p>
          <button
            className="btn outline"
            disabled={busy || !isHolder || !cell?.isDead}
            onClick={() => onAction('autonomousBuyback')}
          >
            {busy ? 'Pending…' : 'Invoke autonomousBuyback()'}
          </button>
        </div>

        <div className="action-card">
          <h3>kill dead cell</h3>
          <p>Anyone may invoke this after the 48h eviction window has passed. Public garbage collection.</p>
          <button
            className="btn outline"
            disabled={busy || !cell?.isEvicted || cell?.isDead}
            onClick={() => onAction('killDeadCell')}
          >
            {busy ? 'Pending…' : 'Invoke killDeadCell()'}
          </button>
        </div>
      </div>

      {address && cell && !isHolder && (
        <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(10,10,10,0.6)', fontStyle: 'italic' }}>
          You are connected as {address.slice(0, 6)}…{address.slice(-4)}, but the holder of NFT #{token.tokenId} is {cell.holder.slice(0, 6)}…{cell.holder.slice(-4)}. Holder-only actions are disabled.
        </p>
      )}
    </section>
  )
}
