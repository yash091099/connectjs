
import { Injectable } from '@angular/core';

declare let window: any;

@Injectable({
  providedIn: 'root',
})
export class MetamaskService {
  constructor() {}

  async connect() {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else {
      console.error('MetaMask not found');
    }
  }

  async getAccount() {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts[0];
    } else {
      console.error('MetaMask not found');
      return null;
    }
  }

  async getChainId() {
    if (typeof window.ethereum !== 'undefined') {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return chainId;
    } else {
      console.error('MetaMask not found');
      return null;
    }
  }

  async getChainName(chainId: string) {
    switch (chainId) {
      case '0x1':
        return 'Ethereum Mainnet';
      case '0x3':
        return 'Ropsten Testnet';
      case '0x4':
        return 'Rinkeby Testnet';
      case '0x5':
        return 'Goerli Testnet';
      default:
        return 'Unknown Network';
    }
  }
}
