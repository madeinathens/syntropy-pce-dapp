import { HashRouter, Routes, Route } from 'react-router-dom'
import { Toast } from '@/components/Toast'

import { ActivePage } from '@/pages/Active'
import { PastBankPage } from '@/pages/PastBank'
import { HolderPage } from '@/pages/Holder'
import { OwnerPage } from '@/pages/Owner'

/**
 * HashRouter is used because IPFS gateways and ENS .limo domains
 * don't support server-side routing. Hash routes (#/holder, #/owner)
 * work everywhere without configuration.
 */
export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ActivePage />} />
        <Route path="/past-bank" element={<PastBankPage />} />
        <Route path="/holder" element={<HolderPage />} />
        <Route path="/owner" element={<OwnerPage />} />
      </Routes>
      <Toast />
    </HashRouter>
  )
}
