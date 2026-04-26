/**
 * The 4 Feeders sacred architecture.
 * Pure SVG, no dependencies.
 */
export function Loom() {
  return (
    <section className="panel dark" style={{ padding: 48, textAlign: 'center' }}>
      <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 680, height: 'auto', display: 'block', margin: '0 auto' }}>
        <defs>
          <marker id="arrow-loom" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#e6c66a" />
          </marker>
        </defs>

        <g fontFamily="JetBrains Mono, monospace" fill="#f4f1ea">
          <circle cx="120" cy="80" r="44" fill="none" stroke="#c9a227" strokeWidth="2" />
          <text x="120" y="76" textAnchor="middle" fontSize="20" fontWeight="700" fill="#c9a227">A</text>
          <text x="120" y="94" textAnchor="middle" fontSize="9" letterSpacing="2">SYNTROPY</text>

          <circle cx="480" cy="80" r="44" fill="none" stroke="#c9a227" strokeWidth="2" />
          <text x="480" y="76" textAnchor="middle" fontSize="20" fontWeight="700" fill="#c9a227">B</text>
          <text x="480" y="94" textAnchor="middle" fontSize="9" letterSpacing="2">MADEINATHENS</text>

          <circle cx="480" cy="280" r="44" fill="none" stroke="#c9a227" strokeWidth="2" />
          <text x="480" y="276" textAnchor="middle" fontSize="20" fontWeight="700" fill="#c9a227">C</text>
          <text x="480" y="294" textAnchor="middle" fontSize="9" letterSpacing="2">NFTABLE</text>

          <circle cx="120" cy="280" r="44" fill="none" stroke="#c9a227" strokeWidth="2" strokeDasharray="4 3" />
          <text x="120" y="276" textAnchor="middle" fontSize="20" fontWeight="700" fill="#c9a227">A′</text>
          <text x="120" y="294" textAnchor="middle" fontSize="9" letterSpacing="2">EFOOD · PCE</text>

          <circle cx="300" cy="180" r="56" fill="none" stroke="#c9a227" strokeWidth="1" />
          <circle cx="300" cy="180" r="40" fill="none" stroke="#c9a227" strokeWidth="1" />
          <text x="300" y="170" textAnchor="middle" fontSize="11" letterSpacing="3" fill="#c9a227">PCE LOOM</text>
          <text x="300" y="190" textAnchor="middle" fontSize="22" fontWeight="700">x⁰=1</text>
          <text x="300" y="208" textAnchor="middle" fontSize="9" letterSpacing="2" fill="#c9a227">3.30 USDC</text>
        </g>

        <g fill="none" stroke="#e6c66a" strokeWidth="1.4" markerEnd="url(#arrow-loom)" opacity="0.85">
          <path d="M 158 90 Q 300 40 442 90" />
          <path d="M 480 124 L 480 236" />
          <path d="M 442 290 Q 300 330 158 290" />
          <path d="M 120 236 L 120 124" />
        </g>

        <g fill="none" stroke="#c9a227" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5">
          <line x1="300" y1="180" x2="120" y2="80" />
          <line x1="300" y1="180" x2="480" y2="80" />
          <line x1="300" y1="180" x2="480" y2="280" />
          <line x1="300" y1="180" x2="120" y2="280" />
        </g>
      </svg>
      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#e6c66a', marginTop: 24 }}>
        Four Feeders · 1.10 USDC each · 1⁰ = 1 · Principle of Least Action
      </p>
    </section>
  )
}
