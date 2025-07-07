import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

import { Contract } from 'ethers';

interface IERC20 extends Contract {
  balanceOf(address: string): Promise<ethers.BigNumber>;
  decimals(): Promise<number>;
}

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;

  constructor() {
  }

  async connectWallet() {
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      await this.provider.send('eth_requestAccounts', []);
      this.signer = this.provider.getSigner();
    } else {
      console.error('MetaMask no está instalado');
    }
  }

  async getAccountAddress(): Promise<string | null> {
    if (this.signer) {
      return await this.signer.getAddress();
    }
    return null;
  }

  async getBalance(): Promise<string | null> {
    if (this.signer) {
      const address = await this.signer.getAddress();
      const balance = await this.provider?.getBalance(address);
      return balance ? ethers.utils.formatEther(balance) : null;
    }
    return null;
  }

  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    if (!this.provider) throw new Error('Provider no disponible');

    const abi = [
      'function balanceOf(address) view returns (uint256)',
      'function decimals() view returns (uint8)',
    ];

    const tokenContract = new ethers.Contract(tokenAddress, abi, this.provider) as IERC20;
    const rawBalance = await tokenContract.balanceOf(userAddress);
    const decimals = await tokenContract.decimals();
    const balance = ethers.utils.formatUnits(rawBalance, decimals);
    return balance;
  }
}
