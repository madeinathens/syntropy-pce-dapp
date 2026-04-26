import type { CellData, PoolData } from '@/hooks/usePceState'

interface Props {
  cell: CellData | undefined
  pool: PoolData | undefined
}

function formatTs(ts: number): string {
  if (ts === 0) return '— pristine —'
  return new Date(ts * 1000).toISOString().replace('T', ' ').slice(0, 16) + ' UTC'
}

export function CellReadout({ cell }: { cell: CellData | undefined }) {
  return (
    <div className="readout">
      <div className="cell">
        <div className="label">Step</div>
        <div className="value">
          {cell ? `${cell.step.toString().padStart(2, '0')} / ${cell.totalSteps}` : '—'}
        </div>
      </div>
      <div className="cell">
        <div className="label">Epoch</div>
        <div className="value">{cell ? cell.epoch : '—'}</div>
      </div>
      <div className="cell">
        <div className="label">Cell</div>
        <div
          className="value"
          style={{ color: cell?.isDead ? 'var(--blood)' : cell ? 'var(--green)' : undefined }}
        >
          {cell ? (cell.isDead ? 'DEAD ✗' : 'ALIVE ●') : '—'}
        </div>
      </div>
      <div className="cell">
        <div className="label">Last Mitosis</div>
        <div className="value small">{cell ? formatTs(cell.lastAction) : '—'}</div>
      </div>
      <div className="cell full">
        <div className="label">Holder of NFT</div>
        <div className="value small">{cell?.holder ?? '—'}</div>
      </div>
    </div>
  )
}

export function PoolReadout({ pool }: { pool: PoolData | undefined }) {
  return (
    <div className="readout">
      <div className="cell">
        <div className="label">ERC20 Owner Pool</div>
        <div className="value">{pool ? pool.erc20Owner.toFixed(2) : '—'}</div>
      </div>
      <div className="cell">
        <div className="label">USDC Escrow</div>
        <div className="value">{pool ? `${pool.usdc.toFixed(2)} USDC` : '—'}</div>
      </div>
      <div className="cell full">
        <div className="label">ETH (gas reserve)</div>
        <div className="value">{pool ? `${pool.eth.toFixed(6)} ETH` : '—'}</div>
      </div>
    </div>
  )
}

export function FullReadout({ cell, pool }: Props) {
  return (
    <div className="grid-2">
      <section className="panel">
        <h2>
          Cell State <span className="num">// live readout</span>
        </h2>
        <CellReadout cell={cell} />
      </section>
      <section className="panel">
        <h2>
          Pool Balances <span className="num">// the loom's bloodstream</span>
        </h2>
        <PoolReadout pool={pool} />
      </section>
    </div>
  )
}
