# ROADMAP · SYNTROPY PCE dApp

> Συγκεκριμένα βήματα μπροστά. Όχι φιλοσοφία — δες το `NOTES.md` για αυτό. Εδώ είναι τι θα φτιαχτεί, με ποια σειρά, και ποιο είναι το criterion ολοκλήρωσης.

---

## Phase 1 · Stabilize (current)

**Στόχος:** Το current scaffold να δουλεύει σταθερά για live demo στο `app.madeinathens.eth.limo`, βασισμένο στο SYNTROPY_PCE_15 contract.

### Done
- React + Vite + Wagmi + RainbowKit scaffold
- 4 routes: `/`, `/past-bank`, `/holder`, `/owner`
- Config-driven token registry (`src/config/tokens.ts`)
- EIP-712 receipt signing + URL encode/decode
- Customer link generator στο Owner panel
- Auto-refresh per block
- Mobile-friendly masthead, nav, connect bar
- HashRouter για IPFS-friendly deployment
- Standalone HTML version ως landing page alternative

### To do — Phase 1
- [ ] **Verify decimals fix path**: επιβεβαίωση ότι το decimal mismatch bug δεν προκαλεί silent failures στο current frontend (το frontend καλεί `claimEntryBonus` και αναμένει κάποιο amount — αν δεν έρχεται τίποτα, θα πρέπει να το επισημαίνει)
- [ ] **QR code στο Owner panel** για in-store flow (`pnpm add qrcode.react`)
- [ ] **Receipt scanner** στο Holder page (κινητό σκανάρει QR από owner → ανοίγει `/holder?r=...`)
- [ ] **"Today's kitchen" preview component** στο Active page — placeholder για όσα ο πελάτης θα δει "αύριο"
- [ ] **Etherscan / Basescan verified links** σε κάθε contract address στο UI
- [ ] **Loading skeletons** αντί για "—" placeholders κατά το αρχικό read

---

## Phase 2 · Polish & Distribution

**Στόχος:** Έτοιμο για Farcaster + Base App + X promotion.

### To do — Phase 2
- [ ] **Open Graph images** για κάθε route (η ίδια αισθητική masthead, διαφορετικό content per page)
- [ ] **Farcaster Frame integration** — ο πελάτης μπορεί να κάνει mitosis απευθείας μέσα στο Farcaster cast (ή τουλάχιστον claim entry bonus)
- [ ] **Base App manifest** — βεβαίωση ότι το `base:app_id` meta tag και τα supporting endpoints δουλεύουν στο Base App browser
- [ ] **i18n basics** — το dApp σε Ελληνικά + Αγγλικά (toggle στο header), αφού ο φυσικός πελάτης είναι Πειραιώτης αλλά οι web3 holders είναι παγκόσμιοι
- [ ] **Analytics-free metrics** — κάποιο ελαφρύ counter (π.χ. Plausible self-hosted) για visits, χωρίς cookies/tracking
- [ ] **Error boundaries** σε κάθε page (αν το contract καταρρεύσει ή το RPC χτυπήσει, να μη γίνεται blank screen)

---

## Phase 3 · NFT #16 Regeneration

**Στόχος:** Το νέο contract με τις διορθώσεις και το alumnus mechanism. Αυτό είναι **όχι frontend work** πρωτίστως — είναι contract engineering που χρειάζεται audit.

### Pre-requisites
- [ ] Decision review session (revisit Q1/Q2/Q3 με fresh eyes πριν deploy)
- [ ] Foundry test suite μηνύεται γραμμένη με coverage > 95%
- [ ] Base Sepolia testnet deployment + 2-4 εβδομάδες live testing
- [ ] Επαγγελματικό audit (recommend: Spearbit, OpenZeppelin, ή equivalent)

### Contract changes (specification, όχι κώδικας)
- [ ] Fix `FEEDER_SHARE_ERC20` decimal mismatch
- [ ] Add `pastHolders` registry mapping
- [ ] Add `alumnusMitosis(address activeContract)` external function
- [ ] Add cooldown enforcement (`lastAlumnusMitosis[wallet][contract]`)
- [ ] Update EIP-712 domain name to `"SYNTROPY_PCE_16"`
- [ ] Investigate force-revoke mechanism for hodl trap completion
- [ ] Optional: clear `consumedReceipts` on `resurrect`

### Frontend changes after contract is live
- [ ] Add NFT #16 entry στο `tokens.ts` ως `active`
- [ ] Mark NFT #15 ως `reservoir`
- [ ] New page: `/alumnus` — όπου past holders βλέπουν τα tokens που μπορούν να πατήσουν mitosis
- [ ] Update Past Bank για να δείχνει cumulative metrics (πόσοι alumni συνολικά, πόσα cumulative steps)

---

## Phase 4 · Long-tail features

**Στόχος:** Δευτερεύοντα features που δεν είναι κρίσιμα αλλά εμπλουτίζουν το project.

### Ιδέες
- [ ] **Event feed** — live stream από `MitosisExecuted`, `EntryBonusClaimed`, `CellRecycled`, `ApoptosisTriggered` events
- [ ] **Receipt photo upload** — ο πελάτης ανεβάζει φωτογραφία της φυσικής απόδειξης σε IPFS, και το CID γίνεται `receiptHash`
- [ ] **NFC tags** στο φυσικό κατάστημα — tap-to-pay flow με NFC αντί για QR scan
- [ ] **Multi-language receipts** — το receipt label μπορεί να είναι σε Ελληνικά για εμβληματικότητα
- [ ] **Past bank dashboard** — συνολικά metrics: πόσα NFTs frozen, πόσα ERC20 locked, πόσα cumulative mitoses, ποιοι είναι top alumni
- [ ] **Subgraph integration** — αντί για on-the-fly contract reads, χρήση The Graph για history queries

---

## Decision matrix για επόμενα βήματα

| Πιθανή ενέργεια | Effort | Risk | Impact | Προτεραιότητα |
|---|---|---|---|---|
| QR code στο Owner panel | Low | Low | High (UX) | **A** |
| Today's kitchen preview | Low | Low | High (καθημερινός λόγος επίσκεψης) | **A** |
| Greek/English toggle | Medium | Low | Medium | B |
| Farcaster Frame | Medium | Medium | High (distribution) | B |
| NFT #16 contract design | High | High | Critical | C (μετά από audit prep) |
| NFC integration | Medium | Low | Medium | C |
| Subgraph | High | Low | Medium | D |

---

## Όρια / boundaries

**Τι ΔΕΝ θα κάνει αυτό το project:**
- ❌ Πώληση δεδομένων χρηστών — κανένα tracking, κανένα cookie, κανένα analytics
- ❌ Self-custody για users (δεν παίρνουμε ποτέ private keys)
- ❌ Speculation/trading promotion — max.BUY/max.SELL σταθερό 3.30 USDC
- ❌ Token printing με βάση hype — κάθε token έχει συγκεκριμένο φυσικό αντίκρισμα
- ❌ AI-generated content που παρουσιάζεται ως human-authored (όλα τα texts περνούν από human review)

**Τι δεν θα κάνει το Claude (agent boundary):**
- ❌ Production-ready Solidity contracts χωρίς audit (μόνο specifications/drafts)
- ❌ Decisions για deployment timing
- ❌ Marketing copy που υπερβάλλει για το project
- ❌ Engagement στο social media εξ ονόματος του project

---

*Last updated: 2026-04-26*
