import { createWeb3Modal, defaultWagmiConfig } from './node_modules/@web3modal/wagmi'

import { mainnet, arbitrum } from './node_modules/@wagmi/core/chains'

// 1. Define constants
const projectId = '987a98f5b177b9da5611b4ba45b89dd7'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
const modal = createWeb3Modal({ wagmiConfig, projectId, chains })
