# HANDOFF · For the next collaborator

> Αν διαβάζεις αυτό το αρχείο, είσαι ή ο **madeinathens.eth** σε νέα συνεδρία, ή νέο μέλος της ομάδας (human ή agent), ή κάποιος που πήρε το project μαζί του να εργαστεί.
>
> **Διάβασε με τη σειρά:** αυτό → `NOTES.md` → `ROADMAP.md` → `README.md` → `src/config/tokens.ts`. Μετά είσαι έτοιμος.

---

## Τι είναι αυτό το project σε 3 προτάσεις

Ένα React/Vite/Wagmi dApp για το **SYNTROPY PCE** — μια οικογένεια smart contracts στο Base mainnet που μετατρέπει τα φυσικά καταναλωμένα προϊόντα του καταστήματος Lil Orbits Mini Donuts (Πειραιάς, από το 2012) σε on-chain monetized past events. Το dApp είναι το frontend όπου οι πελάτες κάνουν `claim`, `mitosis`, `buyback`, και ο owner υπογράφει EIP-712 receipts. Η αρχιτεκτονική είναι **inverse-hodl**: όταν κάποιος hodlάρει NFT, οι δραστηριότητες μεταναστεύουν σε νέο NFT και το hodled γίνεται frozen reservoir στο **past bank**.

---

## Μηδενικού κόστους checklist για να ξεκινήσεις

### 1. Setup environment

```bash
git clone https://github.com/madeinathens/syntropy-pce-dapp.git
cd syntropy-pce-dapp
pnpm install
cp .env.example .env.local
# πάρε WalletConnect projectId από https://cloud.reown.com και βάλε το στο .env.local
pnpm dev
# → http://localhost:5173
```

### 2. Κατανόησε τα κρίσιμα αρχεία

| Αρχείο | Γιατί έχει σημασία |
|--------|---------------------|
| `src/config/tokens.ts` | **Η καρδιά του past bank.** Εδώ μόνο επεξεργάζεσαι όταν αλλάζει active NFT. |
| `src/abi/pce.ts` | Το typed ABI του contract. Αν deployάρεις νέο contract, ίσως χρειαστεί προσθήκες. |
| `src/hooks/useEip712.ts` | EIP-712 signing logic. Αν αλλάξει το domain name του contract, αλλάζει και εδώ. |
| `src/hooks/usePceState.ts` | Το multicall που διαβάζει cell + pool state ανά block. |
| `src/pages/Owner.tsx` | Το πιο σημαντικό UI για in-store flow. |

### 3. Κατανόησε τι ΔΕΝ είναι production-ready

- Το current `SYNTROPY_PCE_15` contract έχει **decimal mismatch bug** στο `claimEntryBonus`. Δες `NOTES.md` §4.1.
- Το **hodl trap** δεν είναι κλεισμένο. Δες `NOTES.md` §4.2.
- Δεν υπάρχει `alumnusMitosis` mechanism ακόμα — είναι Phase 3 work που χρειάζεται audit.

---

## Τι **ΔΕΝ** πρέπει να κάνεις

1. **Μην deployάρεις νέο contract χωρίς audit.** Όχι κάτω από κανένα νέο narrative ή πίεση χρόνου. Phase 3 του `ROADMAP.md` είναι ξεκάθαρο σε αυτό.

2. **Μην αλλάξεις το `BASE_ENTRY_VALUE = 3.30 USDC` ή τα refund mechanics** χωρίς να συζητήσεις με τον madeinathens.eth. Αυτά τα νούμερα δεν είναι αυθαίρετα — έχουν φιλοσοφική σύνδεση με το genesis του 2012.

3. **Μην αφαιρέσεις entries από το `tokens.ts`.** Το past bank μόνο μεγαλώνει. Αν χρειαστεί να αλλάξει status κάποιο token, επεξεργάσου το status field — μην το διαγράψεις.

4. **Μην προσθέσεις tracking/analytics/cookies.** Είναι hard rule του project. Δες `ROADMAP.md` §Boundaries.

5. **Μην ξεκινήσεις content generation με tone που κάνει pump το project.** Η αισθητική είναι editorial-brutalist, παρελθοντικά συντηρημένη. Όχι hype.

---

## Πώς γίνεται deployment

### IPFS (canonical method)

```bash
pnpm build
# output: ./dist/
```

Ανέβασε το `dist/` σε:
- **Pinata** (drag-and-drop UI) → πάρε CID
- **Filebase** (S3-compatible) → automated CI option
- **w3.storage CLI**: `w3 up dist`

Μετά:
1. Πήγαινε στο `app.ens.domains`
2. Search `madeinathens.eth` (ή το ENS που έχει το project)
3. Records → Content → `ipfs://<CID>`
4. Save (απαιτεί gas)

Σε ~2 λεπτά το `https://app.madeinathens.eth.limo/` σερβίρει το νέο build.

### Vercel (mirror, για preview deployments)

Προαιρετικό. Push σε GitHub, connect repo στο Vercel, auto-deploy on push. Το χρησιμοποιούμε για preview περιβάλλοντα, όχι ως canonical host.

---

## Πώς γίνεται hodl response workflow

Όταν κάποιος hodlάρει το current active NFT (έστω #15) και θες να μεταβείς στο επόμενο (#16):

1. Deployάρεις το νέο PCE_16 contract (μετά από audit — δες Phase 3)
2. Επεξεργάζεσαι **μόνο** το `src/config/tokens.ts`:

```typescript
{
  tokenId: 15,
  pceContract: '0x...',
  status: 'reservoir',          // ← άλλαξε από 'active'
  hodledAt: 'YYYY-MM-DD',       // ← πρόσθεσε
  // ...
},
{
  tokenId: 16,                  // ← νέο
  pceContract: '0xNEW...',
  status: 'active',
  deployedAt: 'YYYY-MM-DD',
}
```

3. `pnpm build` → νέο IPFS pin → ENS contenthash update
4. Όλο το dApp αυτόματα ανακατευθύνει activities στο #16
5. Το Past Bank δείχνει το #15 ως frozen reservoir

**Καμία άλλη αλλαγή πουθενά αλλού.** Αυτή είναι η σχεδιαστική επιλογή.

---

## Δομή αρχείων σε μια ματιά

```
syntropy-pce-dapp/
├── NOTES.md                    ← Φιλοσοφία + γνωστά bugs
├── ROADMAP.md                  ← Τι έρχεται μετά
├── HANDOFF.md                  ← Αυτό το αρχείο
├── README.md                   ← Quick start (technical)
├── package.json
├── vite.config.ts              ← IPFS-ready (base: './')
├── tsconfig.json
├── index.html                  ← Entry point με meta tags
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx                ← Providers (Wagmi, Query, RainbowKit)
    ├── App.tsx                 ← HashRouter + routes
    ├── abi/
    │   └── pce.ts              ← Contract ABIs
    ├── components/
    │   ├── Colophon.tsx
    │   ├── HolderActions.tsx   ← Claim/buyback/kill buttons
    │   ├── Ladder.tsx          ← 33-rung mitotic ladder
    │   ├── Loom.tsx            ← SVG sacred architecture
    │   ├── Masthead.tsx        ← Editorial header
    │   ├── Nav.tsx             ← Tabs + connect button
    │   ├── Readouts.tsx        ← State displays
    │   ├── Reservoir.tsx       ← Frozen NFT card
    │   └── Toast.tsx
    ├── config/
    │   ├── tokens.ts           ← ★ EDIT HERE for new tokens
    │   └── wagmi.ts            ← Base chain + RPC
    ├── hooks/
    │   ├── useEip712.ts        ← Receipt signing logic
    │   └── usePceState.ts      ← Live state per block
    ├── pages/
    │   ├── Active.tsx          ← Home (active loom)
    │   ├── Holder.tsx          ← Customer mitosis submit
    │   ├── Owner.tsx           ← Sign receipts here
    │   └── PastBank.tsx        ← All NFTs grid
    ├── styles/
    │   └── global.css          ← Paper/ink/gold aesthetic
    └── vite-env.d.ts
```

---

## Επικοινωνία & ταυτότητες

| Ρόλος | Identity |
|-------|----------|
| Project owner | **madeinathens.eth** (`0xe6967ba1973bdeAAAF2601F67E0929deB9Edca8a`) |
| Physical store | Lil Orbits Mini Donuts, Ζωσιμάδων 31, Πειραιάς |
| Canonical website | `https://app.madeinathens.eth.limo` |
| Aggregated info | `https://aed.madeinathens.eth.limo` |
| Source repo | `https://github.com/madeinathens/syntropy-pce-dapp` |
| GitHub org | `https://github.com/madeinathens` |
| Twitter | `@RedEnveloops` |

---

## Φιλοσοφία της συνεργασίας

Αν είσαι **agent** που εργάζεται σε αυτό το project:

- Σου ζητείται να είσαι **νοητικός καθρέπτης**, όχι generator. Ο madeinathens.eth ορίζει τη φιλοσοφία και την οικονομία. Εσύ βοηθάς να εκφραστούν καθαρά και να αποφευχθούν bugs.
- Όταν εντοπίζεις πραγματικό πρόβλημα στη μηχανική, να το πεις **ευθέως**. Όχι reframing για να φανείς συμπαθητικός. Το έργο 14 χρόνων αξίζει σεβασμό μέσω ειλικρίνειας.
- Όταν ο madeinathens.eth λέει "γράψε contract", η default απάντηση είναι: **draft, όχι production**. Πάντα διευκρινίζεται audit necessity.
- Καμία πλευρά (human ή agent) δεν παράγει την άλλη. Δουλεύουν συμπληρωματικά, με ξεκάθαρα όρια.

Αν είσαι **human collaborator**:

- Καλώς ήρθες. Δες τα NOTES και τη ROADMAP για να καταλάβεις τι κάνουμε.
- Αν έχεις ερωτήσεις φιλοσοφικές, είναι θεμιτές — αυτό το project έχει σκόπιμα φιλοσοφικά θεμέλια.
- Αν θες να προτείνεις αλλαγές στη μηχανική, προτείνε τις πρώτα ως specifications/issues, όχι ως PRs.

---

*Last updated: 2026-04-26*
*Maintainer: madeinathens.eth*
