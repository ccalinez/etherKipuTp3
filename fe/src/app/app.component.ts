import { Component} from '@angular/core';
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

  address: string = "";
  private web3Srv: Web3Service;
  tokenAAddress : string = "0xe7161E317bC42d7AC58e6f5cc2774A9e7aBB8282";
  tokenBAddress : string = "0xA8f938dAAb4Acc224f35851FC8987C1b883FCE29";
  balanceA : number = 0;
  balanceB : number = 0;
  price : number = 0;
  directionAtoB : boolean = true;
  approved: boolean = false; 
  amountA : number = 0;
  amountB : number = 0;



  constructor(_web3Srv: Web3Service) {
    this.web3Srv = _web3Srv;
    this.connectWallet();

  }

  connectWallet(): void {
    this.web3Srv.connectWallet().then(() => {
      this.web3Srv.getAccountAddress().then((address) => {
        this.address = address? address : "";
        console.log('Dirección de la cuenta:', this.address);
          this.web3Srv.getTokenBalance(this.tokenAAddress, this.address).then(response => this.balanceA = Number(response));
          this.web3Srv.getTokenBalance(this.tokenBAddress, this.address).then(response => this.balanceB = Number(response));
      });
      this.web3Srv.getSwapPrice(this.tokenAAddress, this.tokenBAddress).then(price => {
        this.price = price;
      });
    }).catch((error) => {
      console.error('Error al conectar la billetera:', error);
    });
  }

  changeDirection(): void {
    this.directionAtoB = !this.directionAtoB;
  }

  approve() : void {
      this.web3Srv.approveToken(this.tokenAAddress, this.amountA).then((result) => {
        if(result) {
          this.web3Srv.approveToken(this.tokenBAddress, this.amountB).then((result) => {
            this.approved = result;
          });
        }
      });
  }

  swap() : void {

  }
}
