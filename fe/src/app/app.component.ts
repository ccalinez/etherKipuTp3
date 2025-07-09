import { Component } from '@angular/core';
import { Web3Service } from './web3.service';
import { TokenComponent } from './token/token.component';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-root',
  imports: [TokenComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  address: string = '';
  accountBalance: string | null = null;
  private web3Srv: Web3Service;
  tokenAAddress: string = "0xe7161E317bC42d7AC58e6f5cc2774A9e7aBB8282";
  tokenBAddress: string = "0xA8f938dAAb4Acc224f35851FC8987C1b883FCE29";
  balanceA: number = 0;
  balanceB: number = 0;
  price: number = 0;
  directionAtoB: boolean = true;
  approved: boolean = false;
  amountA: number = 0;
  amountB: number = 0;
  working : boolean = false;
  toastMsg : string = "";



  constructor(_web3Srv: Web3Service) {
    this.web3Srv = _web3Srv;
    this.connectWallet();

  }

  connectWallet(): void {
    this.web3Srv.connectWallet().then(() => {
      this.web3Srv.getAccountAddress().then((address) => {
        this.address = address ? address : "";
        console.log('Dirección de la cuenta:', this.address);
        this.web3Srv.getTokenBalance(this.tokenAAddress, this.address).then(response => this.balanceA = Number(response));
        this.web3Srv.getTokenBalance(this.tokenBAddress, this.address).then(response => this.balanceB = Number(response));
      });
      this.web3Srv.getSwapPrice(this.tokenAAddress, this.tokenBAddress).then(price => {
        this.price = +price.toFixed(3);
      });
      this.web3Srv.getBalance().then((balance) => {
        let _balance = Number(balance);
        this.accountBalance = (Math.floor(_balance * Math.pow(10, 3)) / Math.pow(10, 3)).toString();
      });
    }).catch((error) => {
      console.error('Error al conectar la billetera:', error);
    });
  }

  changeDirection(): void {
    this.directionAtoB = !this.directionAtoB;
  }

  approve(): void {
    let token = this.directionAtoB ? this.tokenAAddress : this.tokenBAddress;
    let amount = this.directionAtoB ? this.amountA : this.amountB;
    this.working = true;
    this.web3Srv.approveToken(token, amount).then((result) => {
      this.approved = true;
      this.working = false;
    });
  }

  swap(): void {
    if (!this.approved) {
      return;
    }
    let tokenIn = this.directionAtoB ? this.tokenAAddress : this.tokenBAddress;
    let tokenOut = this.directionAtoB ? this.tokenBAddress : this.tokenAAddress;
    let amoutIn = this.directionAtoB ? this.amountA : this.amountB;
    let amoutOut = this.directionAtoB ? this.amountB : this.amountA;
    if(amoutIn <= 0 || amoutOut <= 0){
      return;
    }
    this.working = true;
    let result = this.web3Srv.swapTokens(tokenIn, tokenOut, amoutIn, amoutOut).then((result) => {
      this.working = false;
      this.resetForm();
    });
  }

  resetForm() {
    this.approved = false;
    this.amountA = 0;
    this.amountB = 0;
    this.directionAtoB = true;
    this.web3Srv.getTokenBalance(this.tokenAAddress, this.address).then(response => this.balanceA = Number(response));
    this.web3Srv.getTokenBalance(this.tokenBAddress, this.address).then(response => this.balanceB = Number(response));
    this.web3Srv.getSwapPrice(this.tokenAAddress, this.tokenBAddress).then(price => {
      this.price = +price.toFixed(3);
    });
    this.web3Srv.getBalance().then((balance) => {
      let _balance = Number(balance);
      this.accountBalance = (Math.floor(_balance * Math.pow(10, 3)) / Math.pow(10, 3)).toString();
    });

  }
}
