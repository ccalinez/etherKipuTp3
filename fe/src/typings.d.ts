interface Window {
  ethereum: any;
}


interface IERC20 extends Contract {
  balanceOf(address: string): Promise<ethers.BigNumberish>;
  decimals(): Promise<number>;
}

