# NOTES · SYNTROPY PCE Knowledge Capture

> Γνώση που γεννήθηκε από συζητήσεις. Δεν είναι roadmap, δεν είναι spec — είναι το **DNA του project σε prose**, για να μην χάνεται όταν αλλάζουν συνεργάτες (human ή agent).

---

## 1. Φιλοσοφικά θεμέλια

### Το αξίωμα: x⁰ = 1

Κάθε καταναλωμένο γεγονός (Programmable Consumed Event) δεν εξαφανίζεται. Παραμένει **1**, ακόμα και όταν εξυψώνεται στο μηδέν. Είναι η μαθηματική αποτύπωση του *"you cannot hold back the past, and you have only one past"*.

Genesis: 1 Ιανουαρίου 2012, Lil Orbits Mini Donuts, Πειραιάς (Ζωσιμάδων 31).

### Value vs Worth — η πιο κρίσιμη διάκριση

Δύο όροι που μοιάζουν συνώνυμοι αλλά **δεν είναι** στο PCE μοντέλο:

- **Value · non-transferable** — Το αναλλοίωτο παρελθόν. Η υπογραφή των δημιουργών. Η σχέση πελάτη-γεγονότος. Το hash της αρχικής συναλλαγής. **Δεν πουλιέται ποτέ.** Παραμένει στους Feeders και στον αρχικό αγοραστή ως μνημονικό.
- **Worth · rewritable** — Η οικονομική ροή. Το ERC20_OWNER ως pass. Τα USDC steps. Αυτό **κυκλοφορεί** μέσα στον Loom.

Το NFT ως αντικείμενο μεταφέρει **worth**, όχι value. Όποιος αγοράζει το NFT αποκτά το δικαίωμα συμμετοχής στη ροή — όχι το παρελθόν του πρώτου αγοραστή.

### Personalized Past Bank

Κάθε wallet που πέρασε από τον Loom κρατά **4 hashes** ως μόνιμο record:

1. **NFT mint hash** — η αρχική δημιουργία
2. **Buy hash** — η αγορά
3. **Sell hash** — η μεταβίβαση
4. **ERC20 received hash** — το pass εισόδου

Αυτά τα 4 hashes μαζί συνθέτουν την **personalized PCE entry** του ατόμου. Δεν μπορούν να αναπαραχθούν, δεν μπορούν να διαγραφούν. Είναι το tokenized past event του.

### Inverse-hodl economics

Στις παραδοσιακές αγορές, το hodl είναι κερδοσκοπία. Στο PCE, το hodl είναι **σιωπηρή συνεισφορά**:

- Όταν κάποιος hodlάρει, το 10% retained του pool παγώνει στο contract
- Οι δραστηριότητες μεταναστεύουν στο επόμενο NFT (#16, #17...)
- Το hodled NFT γίνεται **frozen reservoir** στο past bank
- Ο hodler κάθεται πάνω σε αξία που **δεν μπορεί να εξάγει** λόγω max.SELL = 3.30 USDC
- Η μόνη του διέξοδος: `autonomousBuyback` — που επιστρέφει αξία στο σύστημα

**Το hodl δεν είναι bug. Είναι feature που δουλεύει για το project.**

### Η εξίσωση που "κλείνει"

```
Feeders × Human × Agent × PCE = PCE LOOM × x⁰=1 + 1.10 ERC20_OWNER
```

Όχι ως αριθμητικός τύπος — ως **οικονομικός κύκλος**:

- **Feeders** δημιουργούν το αρχικό φυσικό έργο (2012 → present)
- **Human** πληρώνει 3.30 USDC, παίρνει NFT + 1.10 ERC20_OWNER ως pass
- **Agent** (contract + frontend) εκτελεί τη μηχανική
- **PCE** είναι το όχημα (NFT ως consumed matter token)
- Το αποτέλεσμα είναι ο **Loom** που δεν αδειάζει ποτέ (το +1 παραμένει)
- Το **+1.10** είναι η σταθερή σπορά εισόδου που κρατά ο participant

---

## 2. Η αρχιτεκτονική των 4 Feeders

| Glyph | ENS | Address | Ρόλος |
|-------|-----|---------|-------|
| A | `syntropy.eth` | `0x5e92...3C7B` | The Origin · source of syntropy |
| B | `madeinathens.eth` | `0xe696...ca8a` | The Creator · main feeder & minter |
| C | `nftable.eth` | `0xb9f9...8117` | The Market · distribution |
| A′ | `efood.eth` | `0xAA18...7d9d` | PCE · consumed matter · meta layer |

Κάθε Feeder συνεισφέρει **1.10 USDC** στο USDC pool. Σύνολο: **4.40 USDC**.

**Σταθερές που τρέφουν τη μηχανική:**

- `BASE_ENTRY_VALUE = 3.30 USDC` — το max refund στο `autonomousBuyback`
- `REFUND_STEP_UNIT = 0.10 USDC` — η μείωση refund ανά mitosis step
- `TOTAL_STEPS = 33` — το μήκος της Mitotic Ladder
- `EVICTION_TIME = 48 hours` — το παράθυρο πριν το cell γίνει dead
- `OWNER_DISTRIBUTION_PCT = 90%` — δίνεται στον holder σε κάθε mitosis
- `SC_AUTONOMY_PCT = 10%` — μένει στο contract (το reservoir)

**Πλεόνασμα ανά cycle (αν ολοκληρωθεί buyback χωρίς mitosis):**
4.40 USDC pool − 3.30 USDC refund = **1.10 USDC** σε contract autonomy.

---

## 3. Decisions για το επόμενο contract (regeneration)

### Q1: Είναι το ERC20_OWNER pass fungible ή registry-bound;

**Απόφαση: Registry-bound** (διορθώθηκε από αρχική σκέψη fungible μετά από συζήτηση Sybil attack vectors).

Το contract κρατάει `mapping(address => uint256) pastHolders` που σημειώνει το block.timestamp εγγραφής. Η εγγραφή γίνεται μόνο όταν ένα wallet καλέσει `claimEntryBonus` ως πραγματικός holder του NFT (δηλαδή έχει αγοράσει NFT για 3.30 USDC).

Το ERC20_OWNER στο wallet παραμένει **σύμβολο** της εγγραφής, αλλά η μηχανική αναγνώριση γίνεται μέσω registry — όχι μέσω balance check.

**Γιατί:** Αν ήταν fungible balance check, οποιοσδήποτε θα μπορούσε να αγοράσει 1.10 ERC20_OWNER από DEX για κλάσμα δολαρίου, να φτιάξει 1000 wallets, και να αδειάσει το pool σε ένα block. Αυτό είναι documented attack pattern στη DeFi.

### Q2: Σε ποιο NFT συμμετέχει ένας alumnus;

**Απόφαση: Σε όλα τα current και future active tokens.**

Αν ο Α αγόρασε στο #15, πούλησε, και τώρα το active είναι το #17, ο Α μπορεί να καλέσει `alumnusMitosis` στο #17 (όχι στο hodled #15 ή #16).

### Q3: Sybil protection;

**Απόφαση: Cooldown + κόστος εισόδου.**

- Είσοδος γίνεται μόνο μέσω αρχικής αγοράς NFT (3.30 USDC κατώφλι)
- Cooldown 24h ανά active token, ανά wallet
- Δεν μπορεί ο ίδιος alumnus να καλέσει `alumnusMitosis` πάνω από μία φορά την ημέρα ανά active loom

---

## 4. Γνωστά bugs / weaknesses στο τρέχον SYNTROPY_PCE_15

### #1 Decimal mismatch στο `claimEntryBonus` — **CONFIRMED BUG**

```solidity
FEEDER_SHARE = 1_100_000;  // hardcoded for 6 decimals
ERC20_OWNER.safeTransfer(msg.sender, FEEDER_SHARE);  // sent to 18-decimal token
```

Επιβεβαιωμένο: ERC20_OWNER στο `0xa331F6e88c9B0Aa77e01bc3738b5ad31E1a930Dc` έχει **18 decimals**.

Πραγματικό αποτέλεσμα: ο πελάτης παίρνει `1,100,000 / 10^18 = 0.0000000000011` tokens αντί για `1.10`.

**Impact**: Το entry bonus πρακτικά δεν δουλεύει. Δεν είναι επικίνδυνο (δεν χάνει χρήματα κάποιος, απλά δεν παίρνει tokens), αλλά σπάει την οικονομική φιλοσοφία του project.

**Fix στο επόμενο contract**: `FEEDER_SHARE_ERC20 = 1_100_000_000_000_000_000` (1.10 με 18 decimals).

### #2 Hodl trap παραμένει ανοιχτό

Όταν ένας holder αδιαφορεί:
1. 48h → `deadCell = true`
2. NFT παραμένει στο wallet του hodler
3. Μόνο εκείνος μπορεί να καλέσει `autonomousBuyback`
4. Αν αδιαφορεί για το refund → NFT + 3.30 USDC κλειδώνονται

**Σπάει** το comment του contract: *"The asset doesn't decay. Sellers rotate."*

Στην πραγματικότητα δεν rotate-άρει — μένει frozen.

**Δυνατές λύσεις για επόμενο contract:**
- Force-revoke μηχανισμός μετά από εκτεταμένη eviction (π.χ. 30 ημέρες)
- Approval scheme όπου ο NFT contract επιτρέπει στο PCE contract να κάνει transfer
- Soulbound-until-consumed pattern (αλλά αυτό σπάει tradability)

### #3 EIP-712 domain name θα χρειαστεί unique value ανά contract

Το current contract έχει `EIP712("SYNTROPY_PCE_15", "1")`. Όταν deployάρεις #16, **πρέπει** να χρησιμοποιήσεις `EIP712("SYNTROPY_PCE_16", "1")` ώστε signed receipts του #15 να μην μπορούν να γίνουν replay στο #16.

### #4 `consumedReceipts` mapping δεν καθαρίζεται σε resurrect

Τα παλιά receipt hashes παραμένουν consumed σε νέα epochs. Πιθανώς δεν είναι πρόβλημα στην πράξη (αν τα receipts περιέχουν timestamp ή unique receipt number), αλλά αξίζει να σημειωθεί.

---

## 5. Αρχιτεκτονικές αποφάσεις του dApp

### Token registry config-driven (`src/config/tokens.ts`)

Η μόνη αλλαγή που χρειάζεται όταν γίνεται hodl ένα NFT και deployάρεται το επόμενο: επεξεργασία αυτού του ενός αρχείου.

```typescript
// Πριν
{ tokenId: 15, status: 'active', ... }

// Μετά
{ tokenId: 15, status: 'reservoir', hodledAt: '...' },
{ tokenId: 16, status: 'active', ... }
```

**Σταθερός νόμος: ποτέ δεν διαγράφεται entry από το registry.** Το past bank μόνο μεγαλώνει.

### HashRouter αντί για BrowserRouter

IPFS gateways και ENS .limo δεν υποστηρίζουν server-side routing. Hash routes (`#/holder?r=...`) δουλεύουν παντού χωρίς config.

### Owner panel signs locally, never sends keys

Η EIP-712 υπογραφή γίνεται **στο browser** του owner μέσω wallet (MetaMask/Rabby/etc.). Το private key δεν φεύγει ποτέ. Ο customer link περιέχει τη signature σε base64url.

### Customer link bound to wallet

Η υπογραφή περιλαμβάνει `owner` field (το wallet του customer). Αν κάποιος άλλος ανοίξει το link, το contract θα απορρίψει το tx γιατί το recovered signer δεν θα ταιριάζει στο `msg.sender`.

---

## 6. SEO / Meta layer

### Schema.org structured data

Το project διαθέτει πλούσιο JSON-LD με:
- `Product` + `Service` + `CreativeWork` types
- `Offer` με τιμή 3.30 USDC και `PayAction` recipient
- `SoftwareApplication` agents (OAS-0 σε Base + Ethereum)
- `additionalProperty` array με όλα τα μηχανικά μεγέθη

### Base App integration

```html
<meta name="base:app_id" content="..." />
<meta name="base:chain_id" content="8453" />
<meta name="base:contract" content="..." />
<meta name="base:contract_name" content="HumanAgenticTrinity" />
<meta name="base:token_symbol" content="AAE" />
```

### Επαληθεύσεις

- Google site verification: configured
- Bing (msvalidate.01): configured
- Canonical URL: `https://aed.madeinathens.eth.limo`

---

## 7. Open questions για audit όταν έρθει η ώρα

1. **Reentrancy paths** — έχει `ReentrancyGuard` αλλά δεν έχει γίνει formal CEI verification σε κάθε external call
2. **Sybil resistance του registry approach** — αρκεί το cost-of-entry για production scale;
3. **Front-running στο `executePCE`** — φαίνεται OK γιατί το signature περιέχει specific holder address, αλλά αξίζει formal review
4. **Force-revoke mechanism** — αν προστεθεί στο contract για το hodl trap completion, χρειάζεται προσοχή σε reentrancy και approval semantics
5. **Cooldown enforcement** — το νέο `alumnusMitosis` πρέπει να αντιστέκεται σε MEV attempts

---

## 8. Φιλοσοφία της συνεργασίας

> *"εσύ έβαλες την αρχιτεκτονική, την οικονομία, και το νόημα. Εγώ έβαλα μηχανική εκτέλεση και νοητική καθρεπτική."*

Αυτό το project είναι **Human × Agent** στην πράξη: ο human (madeinathens.eth) ορίζει τη φιλοσοφία και τη δομή, ο agent (Claude και άλλα LLM tools) καθρεπτίζει, εντοπίζει κενά, υλοποιεί και προστατεύει από bugs.

Καμία πλευρά δεν παράγει την άλλη. Δουλεύουν συμπληρωματικά.

---

*Last updated: 2026-04-26*
*Maintainer: madeinathens.eth*
