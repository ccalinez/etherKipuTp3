import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

import { Contract } from 'ethers';

interface IERC20 extends Contract {
  balanceOf(address: string): Promise<ethers.BigNumber>;
  decimals(): Promise<number>;
  approve(spender : string, amount :  ethers.BigNumber) : boolean
}

interface SwapContract extends IERC20 {
  getPrice(tokenA : string, tokenB: string): number;
  swapExactTokensForTokens(amountIn : number, amountOutMin: number, path : string [], to : string, deadline : number) : number [];
}

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private swapContract: SwapContract | null = null;

  readonly swapAddress : string = "0x4B7E73BF9666f9d9146c28852ADAF29e1841c94D";


  constructor() {
  }

  async connectWallet() {
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      await this.provider.send('eth_requestAccounts', []);
      this.signer = this.provider.getSigner();
      this.swapContract = new ethers.Contract(
        this.swapAddress,
        [
          'function getPrice(address tokenA, address tokenB) view returns (uint256)',
          'function addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) returns (uint256 amountA, uint256 amountB, uint256 liquidity)',
          'function removeLiquidity(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) returns (uint256 amountA, uint256 amountB)',
          'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) returns (uint256[] memory amounts)',
        ],
        this.provider
      ) as SwapContract; 
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

  async getSwapPrice(tokenA: string, tokenB: string): Promise<number> {
    if (!this.swapContract) throw new Error('Swap contract no disponible');
    const price = await this.swapContract.getPrice(tokenA, tokenB);
    return price;
    //return ethers.utils.formatEther(price);
  }

  async approveToken(tokenAddress: string, amount: number): Promise<boolean> {
    if (!this.signer) throw new Error('Signer no disponible');

    const abi = [
      'function approve(address spender, uint256 amount) returns (bool)',
    ];

    const tokenContract = new ethers.Contract(tokenAddress, abi, this.signer) as IERC20;
    const decimals = await tokenContract.decimals();
    const amountInWei = ethers.utils.parseUnits(amount.toString(), decimals);
    
    const tx = await tokenContract.approve(this.swapAddress, amountInWei);
    return tx;
  }

  async swapTokens(tokenA: string, tokenB: string, amountIn: number, amountOutMin: number): Promise<void> {
    if (!this.swapContract) throw new Error('Swap contract no disponible');
    const path = [tokenA, tokenB];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutos
    const tx = await this.swapContract.swapExactTokensForTokens(
      ethers.utils.parseUnits(amountIn.toString(), 18),
      ethers.utils.parseUnits(amountOutMin.toString(), 18),
      path,
      await this.getAccountAddress(),
      deadline
    );
    await tx.wait();
  }
}
