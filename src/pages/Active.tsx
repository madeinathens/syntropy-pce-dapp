import { Masthead } from '@/components/Masthead'
import { Nav } from '@/components/Nav'
import { Loom } from '@/components/Loom'
import { Ladder } from '@/components/Ladder'
import { FullReadout } from '@/components/Readouts'
import { Colophon } from '@/components/Colophon'
import { FEEDERS, getActiveToken, getReservoirs } from '@/config/tokens'
import { usePceState } from '@/hooks/usePceState'

export function ActivePage() {
  const active = getActiveToken()
  const reservoirs = getReservoirs()
  const { cell, pool } = usePceState(active)

  if (!active) {
    return (
      <div className="frame">
        <Masthead />
        <Nav />
        <section className="panel">
          <h2>No active loom</h2>
          <p style={{ marginTop: 16 }}>
            Every NFT has migrated to the past bank. Edit <code>src/config/tokens.ts</code> to add a new active loom.
          </p>
        </section>
        <Colophon />
      </div>
    )
  }

  return (
    <div className="frame">
      <Masthead />
      <Nav />

      <Loom />

      <section className="panel" style={{ marginTop: 24 }}>
        <h2>
          Active Loom <span className="num">// NFT #{active.tokenId}</span>
        </h2>
        <p style={{ marginBottom: 12, fontStyle: 'italic' }}>{active.label}</p>
        <div className="ladder-meta" style={{ marginBottom: 8 }}>
          <span>The Mitotic Ladder · 33 steps · 90% per mitosis</span>
        </div>
        <Ladder
          step={cell?.step ?? 0}
          totalSteps={cell?.totalSteps ?? 33}
          isDead={cell?.isDead ?? false}
        />
      </section>

      <FullReadout cell={cell} pool={pool} />

      <section className="panel">
        <h2>The Four Feeders <span className="num">// trinity + 1</span></h2>
        {FEEDERS.map((f) => (
          <div
            key={f.address}
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr auto',
              gap: 14,
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px dashed var(--rule)',
            }}
          >
            <div style={{ fontFamily: 'Major Mono Display, monospace', fontSize: 22, color: 'var(--gold)', textAlign: 'center' }}>
              {f.glyph}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 500 }}>{f.name}</div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(10,10,10,0.55)', display: 'block', marginTop: 2 }}>
                {f.role}
              </span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(10,10,10,0.6)' }}>
              {f.address.slice(0, 6)}…{f.address.slice(-4)}
            </div>
          </div>
        ))}
      </section>

      {reservoirs.length > 0 && (
        <section className="panel">
          <h2>
            Past Bank Preview <span className="num">// {reservoirs.length} frozen reservoir{reservoirs.length > 1 ? 's' : ''}</span>
          </h2>
          <p style={{ marginBottom: 16, fontStyle: 'italic', color: 'rgba(10,10,10,0.7)' }}>
            Activities have migrated. The hodled NFTs remain frozen with their locked balances.
            Visit the Past Bank for the full ledger.
          </p>
        </section>
      )}

      <section className="manifesto">
        <p>«I AM &amp; I AM NOT = I AM YOU &amp; VICE VERSA<br />The Owner is the next SELLER<br />I AM THE LAST BUYER.»</p>
        <div className="tag">Value · non-transferable · Worth · rewritable</div>
      </section>

      <Colophon />
    </div>
  )
}
