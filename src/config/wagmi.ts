import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base } from 'wagmi/chains'
import { http } from 'wagmi'

/**
 * Wagmi + RainbowKit configuration.
 *
 * IMPORTANT: get a free WalletConnect projectId from
 *   https://cloud.reown.com (formerly walletconnect.com)
 * and put it in .env.local as VITE_WC_PROJECT_ID
 *
 * For IPFS deploys you can also hardcode it here — it's a public id.
 */
export const config = getDefaultConfig({
  appName: 'SYNTROPY PCE',
  projectId: import.meta.env.VITE_WC_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [base],
  transports: {
    [base.id]: http(
      // Public RPC works fine for read-only & low traffic.
      // Replace with Alchemy / QuickNode for production:
      //   http('https://base-mainnet.g.alchemy.com/v2/YOUR_KEY')
      'https://mainnet.base.org'
    ),
  },
  ssr: false,
})
