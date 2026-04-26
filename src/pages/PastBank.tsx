import { Masthead } from '@/components/Masthead'
import { Nav } from '@/components/Nav'
import { Reservoir } from '@/components/Reservoir'
import { Colophon } from '@/components/Colophon'
import { getAllTokens, getActiveToken, getReservoirs } from '@/config/tokens'
import { usePceState } from '@/hooks/usePceState'

function ActiveCard() {
  const active = getActiveToken()
  const { cell, pool } = usePceState(active)
  if (!active) return null

  return (
    <div className="reservoir" style={{ borderStyle: 'solid', borderColor: 'var(--ink)', background: 'var(--paper)' }}>
      <div className="badge" style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
        Active Loom · NFT #{active.tokenId}
      </div>
      <h3>{active.label}</h3>
      <div className="meta">
        Deployed {active.deployedAt} · Currently producing
      </div>
      <div className="stats">
        <div>
          <div className="label">Current step</div>
          <div className="v">{cell ? `${cell.step}/${cell.totalSteps}` : '—'}</div>
        </div>
        <div>
          <div className="label">Live ERC20</div>
          <div className="v">{pool ? pool.erc20Owner.toFixed(2) : '—'}</div>
        </div>
        <div>
          <div className="label">Live USDC</div>
          <div className="v">{pool ? pool.usdc.toFixed(2) : '—'}</div>
        </div>
      </div>
    </div>
  )
}

export function PastBankPage() {
  const all = getAllTokens()
  const reservoirs = getReservoirs()

  return (
    <div className="frame">
      <Masthead />
      <Nav />

      <section className="panel">
        <h2>
          The Past Bank <span className="num">// {all.length} token{all.length !== 1 ? 's' : ''} · personalized PCE</span>
        </h2>
        <p style={{ fontStyle: 'italic', color: 'rgba(10,10,10,0.75)', lineHeight: 1.6 }}>
          You can't hold back the past, and you have only one past. Every NFT here is a monetized past event,
          bound to its origin by the receipt hash. The active loom produces in the present.
          The reservoirs hold the asset frozen at the moment of hodling — value sealed, worth suspended.
        </p>
      </section>

      <section className="panel">
        <h2>The active present <span className="num">// {getActiveToken() ? 1 : 0}</span></h2>
        <ActiveCard />
      </section>

      {reservoirs.length > 0 && (
        <section className="panel">
          <h2>Frozen reservoirs <span className="num">// {reservoirs.length}</span></h2>
          {reservoirs.map((t) => (
            <Reservoir key={t.pceContract} token={t} />
          ))}
        </section>
      )}

      {reservoirs.length === 0 && (
        <section className="panel">
          <h2>No reservoirs yet</h2>
          <p style={{ marginTop: 12, fontStyle: 'italic' }}>
            The past bank starts here. As NFTs get hodled and activities migrate, this list will grow.
            Each frozen reservoir is a transparent ledger of locked value — visible to all, accessible only by buyback.
          </p>
        </section>
      )}

      <Colophon />
    </div>
  )
}
