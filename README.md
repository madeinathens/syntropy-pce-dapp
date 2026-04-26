# SYNTROPY PCE · The Tangible Zero

> x⁰ = 1 · Programmable Consumed Matter · Personalized Past Bank
>
> A React + Wagmi + Vite dApp for the SYNTROPY PCE smart contracts on Base mainnet.

---

## What this is

A frontend for the SYNTROPY_PCE family of contracts that implements **inverse-hodl economics**: NFTs whose worth flows through mitosis when held by active customers, and freezes into reservoirs when hodled by speculators. Every hodled NFT becomes a transparent locked-value entry in the Past Bank.

The dApp has four routes:

- **`/`** — Active Loom. The current producing NFT with its mitotic ladder, cell state, pool balances, and the four feeders.
- **`/past-bank`** — All NFTs ever deployed: active in the present, frozen in the past.
- **`/holder`** — Where customers submit signed receipts to advance the mitosis. Reads `?r=<encoded receipt>` from the URL.
- **`/owner`** — Where the contract owner signs EIP-712 receipts and generates customer links.

---

## Quick start

```bash
# 1. Install dependencies (use pnpm — much faster, smaller node_modules)
pnpm install

# 2. (Optional) Set up WalletConnect — needed for non-injected wallets
cp .env.example .env.local
# edit .env.local and paste your projectId from https://cloud.reown.com

# 3. Run the dev server
pnpm dev
# → opens at http://localhost:5173
```

If you don't use pnpm:
```bash
npm install && npm run dev
```

---

## How the receipt flow works

This is the heart of the system. Pay attention.

### 1. Customer buys at your physical shop

Lil Orbits, Piraeus. The customer eats donuts. You hand them a paper receipt with a unique reference (e.g. `LIL-2026-04-25-00134`).

### 2. Customer connects their wallet to the dApp

They visit `https://app.madeinathens.eth.limo/` (your IPFS-pinned build). They go to `/holder`. They've already minted or bought NFT #15 separately.

### 3. You go to `/owner` on a separate device

Connect with the **Oracle wallet** (the contract owner — currently `madeinathens.eth`). The dApp checks on-chain that your connected address matches `owner()` of the active contract. If yes, signing is enabled.

### 4. You issue a signed receipt

Fill in:
- **Customer wallet address** — the wallet that holds NFT #15
- **Receipt label** — anything that uniquely identifies the sale (`LIL-2026-04-25-00134`, an IPFS CID of the receipt photo, etc.). This gets `keccak256`-hashed to produce the `receiptHash`.

Click **Sign EIP-712 receipt**. Your wallet (RainbowKit modal → MetaMask/Rabby/etc.) shows the typed data. You sign.

### 5. The dApp generates a customer link

`https://app.madeinathens.eth.limo/#/holder?r=<base64url-encoded-payload>`

The payload contains the contract address, the message, the signature, and the receipt label. **Nothing secret is in there** — the signature is already public proof.

### 6. You give the link to the customer

Copy button. Or QR code (you can add `qrcode.react` later). Or text it. Or print it on the receipt.

### 7. Customer opens the link, submits the tx

The `/holder` page parses the receipt from the URL, verifies the customer is connected with the right wallet, shows them the mitosis preview (step N → N+1), and on click calls `executePCE(receiptHash, signature)` on chain.

The contract recovers the signer from the signature, checks it matches `owner()`, marks the receipt as consumed (no replay), and distributes 90% of the ERC20 pool to the customer.

### 8. Done

The customer gets their reward. The receipt is consumed (one-time use). The cell advances. The 10% retained accumulates in the contract — your future autonomy reserve.

---

## Adding a new NFT — the hodl response workflow

This is the **only** code change you make when an NFT gets hodled and you migrate activities to the next one.

Edit `src/config/tokens.ts`. The current state:

```typescript
export const TOKENS: TokenEntry[] = [
  {
    tokenId: 15,
    pceContract: '0x328DAC053182da80188AC51a49EE534d856522BE',
    label: 'PCE #15 — The Tangible Zero',
    status: 'active',          // ← active loom
    deployedAt: '2026-04-08',
    note: 'First incarnation of the inverse-hodl loom.',
  },
]
```

When NFT #15 gets hodled and you've deployed PCE #16:

```typescript
export const TOKENS: TokenEntry[] = [
  {
    tokenId: 15,
    pceContract: '0x328DAC053182da80188AC51a49EE534d856522BE',
    label: 'PCE #15 — The Tangible Zero',
    status: 'reservoir',        // ← changed
    deployedAt: '2026-04-08',
    hodledAt: '2026-XX-XX',     // ← added
    note: 'First incarnation. Frozen with locked balances.',
  },
  {
    tokenId: 16,
    pceContract: '0x...',       // ← new deployed PCE_16 address
    label: 'PCE #16 — Continuum',
    status: 'active',
    deployedAt: '2026-XX-XX',
  },
]
```

That's it. Rebuild, pin to IPFS, update the ENS contenthash. The Past Bank now shows both — #15 frozen, #16 producing.

**Sacred Law: never delete a reservoir entry.** The past bank only grows.

---

## Building for IPFS deployment

```bash
pnpm build
# Output: ./dist/
```

The `vite.config.ts` uses `base: './'` so all asset paths are relative — works at any IPFS gateway, ENS .limo, or root path.

Pin to IPFS (any of these):
```bash
# Using w3.storage CLI
w3 up dist

# Using ipfs CLI
ipfs add -r dist

# Using Pinata, Filebase, NFT.Storage, etc — drag the dist folder
```

Take the CID. Update your ENS contenthash:

1. Go to `app.ens.domains` → search your name (e.g. `madeinathens.eth`)
2. Records → Content → paste `ipfs://<your-cid>`
3. Save

After ~2 minutes, `https://app.madeinathens.eth.limo/` (or any ENS gateway) serves the new build.

---

## Architecture

```
src/
├── abi/
│   └── pce.ts                    # PCE contract + ERC721 ABIs (typed const)
├── components/
│   ├── Colophon.tsx              # Footer
│   ├── HolderActions.tsx         # Claim bonus, buyback, kill cell buttons
│   ├── Ladder.tsx                # 33-rung mitotic ladder visualization
│   ├── Loom.tsx                  # SVG sacred architecture (4 feeders)
│   ├── Masthead.tsx              # Editorial header
│   ├── Nav.tsx                   # Tab navigation + connect button
│   ├── Readouts.tsx              # Cell + pool state grids
│   ├── Reservoir.tsx             # Frozen NFT card (past bank)
│   └── Toast.tsx                 # Notification system
├── config/
│   ├── tokens.ts                 # ★ THE PAST BANK CONFIG ★ — edit this
│   └── wagmi.ts                  # Wagmi + RainbowKit setup, Base chain
├── hooks/
│   ├── useEip712.ts              # Receipt typed data + URL encode/decode
│   └── usePceState.ts            # Read cell + pool, auto-refresh per block
├── pages/
│   ├── Active.tsx                # Home — current loom
│   ├── Holder.tsx                # Customer mitosis submission
│   ├── Owner.tsx                 # Oracle signing panel
│   └── PastBank.tsx              # All NFTs grid (active + reservoirs)
├── styles/
│   └── global.css                # Paper / ink / gold aesthetic
├── App.tsx                       # HashRouter + route definitions
└── main.tsx                      # Providers (Wagmi, Query, RainbowKit)
```

### Why HashRouter

IPFS gateways and ENS .limo domains don't support server-side path routing. Hash routes (`#/holder?r=...`) work everywhere with no server config. The trade-off is uglier URLs, but for a dApp on a decentralized host that's the right call.

### Why Wagmi v2 + RainbowKit v2 (not v3)

Wagmi v3 is brand new and connector ecosystem support is still catching up. v2 is battle-tested, RainbowKit's v2 release is mature, and the API surface we use is identical. When v3 stabilizes, migration is a few imports.

### Auto-refresh

`usePceState` watches `blockNumber` and invalidates its query cache on every new block (~2s on Base). The UI updates live without polling.

---

## Customizing for production

### RPC endpoint

Public Base RPC (`https://mainnet.base.org`) works fine for low traffic. For production traffic, get a key from Alchemy or QuickNode and update `src/config/wagmi.ts`:

```typescript
transports: {
  [base.id]: http('https://base-mainnet.g.alchemy.com/v2/YOUR_KEY')
}
```

### WalletConnect projectId

The default `'YOUR_PROJECT_ID'` won't work for users connecting via WalletConnect mobile. Get one (free) at [cloud.reown.com](https://cloud.reown.com) and put it in `.env.local`.

### Theme tweaks

All design tokens are CSS variables at the top of `src/styles/global.css`. Change `--gold`, `--ink`, `--paper` to re-skin everything.

### Adding a QR code generator

```bash
pnpm add qrcode.react
```

Then in `src/pages/Owner.tsx` import and render `<QRCodeSVG value={signedUrl} size={256} />` next to the copy button.

---

## Open questions / future work

1. **The hodl trap completion** — currently the contract still allows a hodler to sit indefinitely on a dead cell. The `forceTransfer` mechanism we discussed needs a contract-level addition.

2. **Receipt expiry on-chain** — receipts have an `expiresAt` field but the contract doesn't enforce it. Either add a deadline to the typed data + verification, or rely on ladder progression (a stale receipt for step 5 becomes invalid after step 5 completes).

3. **Past bank events feed** — the Past Bank page currently shows cell state. A future addition could fetch `MitosisExecuted` and `CellRecycled` event history per token to show the full life of each frozen NFT.

4. **Mobile QR scan flow** — combine `react-zxing` and a deep link so the customer scans a QR at the till and lands directly on the holder page with the receipt pre-filled.

---

## License

Same as the smart contract — MIT.

---

## Credits

Smart contracts, philosophy, and Lil Orbits Mini Donuts: **madeinathens.eth © 2012**.

Frontend scaffold: built with Claude as a thinking partner, in editorial brutalist style.
