import { Component} from '@angular/core';
import { Web3Service } from './web3.service';
import { TokenComponent } from './token/token.component';


@Component({
  selector: 'app-root',
  imports: [TokenComponent],
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
    });
  }
}
