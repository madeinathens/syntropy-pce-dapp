import { usePceState } from '@/hooks/usePceState'
import type { TokenEntry } from '@/config/tokens'

interface Props {
  token: TokenEntry
}

/**
 * A frozen reservoir — the past bank visualization.
 * Read-only card showing locked balances of a hodled NFT.
 */
export function Reservoir({ token }: Props) {
  const { cell, pool } = usePceState(token)

  const status = token.status === 'completed' ? 'Completed' : 'Frozen reservoir'
  const badgeColor = token.status === 'completed' ? 'var(--gold)' : 'var(--ink)'

  return (
    <div className="reservoir">
      <div className="badge" style={{ background: badgeColor }}>
        {status} · NFT #{token.tokenId}
      </div>
      <h3>{token.label}</h3>
      <div className="meta">
        Deployed {token.deployedAt}
        {token.hodledAt && ` · Hodled ${token.hodledAt}`}
      </div>
      {token.note && (
        <p style={{ fontStyle: 'italic', fontSize: 14, color: 'rgba(10,10,10,0.7)', marginBottom: 12 }}>
          {token.note}
        </p>
      )}
      <div className="stats">
        <div>
          <div className="label">Frozen at step</div>
          <div className="v">{cell ? `${cell.step}/${cell.totalSteps}` : '—'}</div>
        </div>
        <div>
          <div className="label">Locked ERC20</div>
          <div className="v">{pool ? pool.erc20Owner.toFixed(2) : '—'}</div>
        </div>
        <div>
          <div className="label">Locked USDC</div>
          <div className="v">{pool ? pool.usdc.toFixed(2) : '—'}</div>
        </div>
      </div>
      <div style={{ marginTop: 12, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(10,10,10,0.5)', wordBreak: 'break-all' }}>
        {token.pceContract}
      </div>
    </div>
  )
}
