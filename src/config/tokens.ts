/**
 * ═══════════════════════════════════════════════════════════════════
 *   TOKEN REGISTRY · THE PAST BANK CONFIG
 * ═══════════════════════════════════════════════════════════════════
 *
 *   This is the only file you edit when:
 *   • A new NFT contract is deployed → add a new entry, status: 'active'
 *   • An NFT gets hodled and activities migrate → flip the previous one
 *     to status: 'reservoir' and add the new active one
 *
 *   The dApp reads this list and:
 *   • Renders the active NFT with full Holder Rituals UI
 *   • Renders all reservoirs as read-only frozen cards (the past bank)
 *   • Routes the Owner panel to the active token only
 *
 *   Sacred Law: never delete a reservoir entry. The past bank only grows.
 *
 * ═══════════════════════════════════════════════════════════════════
 */

export type TokenStatus = 'active' | 'reservoir' | 'completed'

export interface TokenEntry {
  /** The token id inside the RWA NFT collection (e.g. 15, 16, 17...) */
  tokenId: number

  /** The deployed PCE contract address for this specific token */
  pceContract: `0x${string}`

  /** Optional friendly name */
  label: string

  /** Status drives UI behavior */
  status: TokenStatus

  /** When the contract went live (for the timeline) */
  deployedAt: string

  /** When it was hodled / migrated, if applicable */
  hodledAt?: string

  /** Optional note shown on the reservoir card */
  note?: string
}

/**
 * The shared anchors — same across all PCE contracts.
 */
export const ANCHORS = {
  /** RWA NFT collection (same address, different tokenIds) */
  rwaNft: '0x318c81010D5fC11363f3A3C79Ee26B6EFe8D145B' as const,
  /** USDC on Base mainnet */
  usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const,
  /** ERC20 Owner — your reward token (18 decimals) */
  erc20Owner: '0xa331F6e88c9B0Aa77e01bc3738b5ad31E1a930Dc' as const,
} as const

/**
 * The 4 Feeders — Trinity + 1.
 * Immutable across all PCE contracts.
 */
export const FEEDERS = [
  { glyph: 'A',  name: 'syntropy.eth',     role: 'The Origin · source of syntropy',     address: '0x5e92bF78078B0a492Bb35318198345C364d03C7B' },
  { glyph: 'B',  name: 'madeinathens.eth', role: 'The Creator · main feeder & minter',  address: '0xe6967ba1973bdeAAAF2601F67E0929deB9Edca8a' },
  { glyph: 'C',  name: 'nftable.eth',      role: 'The Market · distribution',           address: '0xb9f96ED0Ed33C7e773332e8B854b3f7bA4f58117' },
  { glyph: 'A′', name: 'efood.eth',        role: 'PCE · consumed matter · meta layer',  address: '0xAA18002019F68826147Fd1Cb83A48e8162a17d9d' },
] as const

/**
 * THE PAST BANK — every PCE token ever deployed.
 *
 * To add a new active token (e.g. when #16 is deployed):
 *   1. Mark the previous active as 'reservoir' with hodledAt date
 *   2. Add the new entry as 'active'
 *   3. Commit, build, pin to IPFS, update ENS contenthash. Done.
 */
export const TOKENS: TokenEntry[] = [
  {
    tokenId: 15,
    pceContract: '0x328DAC053182da80188AC51a49EE534d856522BE',
    label: 'PCE #15 — The Tangible Zero',
    status: 'active',
    deployedAt: '2026-04-08',
    note: 'First incarnation of the inverse-hodl loom.',
  },

  // Example for the future (commented out — uncomment & edit when needed):
  // {
  //   tokenId: 16,
  //   pceContract: '0x...',
  //   label: 'PCE #16 — Continuum',
  //   status: 'active',
  //   deployedAt: '2026-XX-XX',
  // },
]

/**
 * Helpers — used throughout the app.
 */
export const getActiveToken = (): TokenEntry | undefined =>
  TOKENS.find((t) => t.status === 'active')

export const getReservoirs = (): TokenEntry[] =>
  TOKENS.filter((t) => t.status === 'reservoir' || t.status === 'completed')

export const getAllTokens = (): TokenEntry[] => TOKENS

export const getTokenByContract = (
  address: string
): TokenEntry | undefined =>
  TOKENS.find((t) => t.pceContract.toLowerCase() === address.toLowerCase())
