import { Component, TemplateRef } from '@angular/core';
import { Web3Service } from './web3.service';
import { TokenComponent } from './token/token.component';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

interface Alert {
	type: string;
	message: string;
  header : string;
}

@Component({
  selector: 'app-root',
  imports: [TokenComponent, CommonModule, NgbToastModule, NgbModalModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  address: string = '';
  accountBalance: string | null = null;
  private web3Srv: Web3Service;
  tokenAAddress: string = "0x5fD06Fe62edDB7f5Ee9F1611517859B65047bc57";
  tokenBAddress: string = "0x62e67d6cE1B6aCB31023497d0ee05d41A5Dc547a";
  balanceA: number = 0;
  balanceB: number = 0;
  price: number = 0;
  directionAtoB: boolean = true;
  approved: boolean = false;
  amountA: number = 0;
  amountB: number = 0;
  working : boolean = false;
  workingFauset : boolean = false;
  toastMsg : string = "";
  alert: Alert;
  showAlertFlag : boolean = false;
  fausetTokenType : number = 1; 
  fausetTokenAmount : number = 0;
  openModal : NgbModalRef | null = null;



  constructor(_web3Srv: Web3Service, private modal : NgbModal) {
    this.web3Srv = _web3Srv;
    this.connectWallet();
    this.alert =  {
                    type: 'warning',
                    message: 'This is a warning alert',
                    header : 'Warning'
                  };
  }

  connectWallet(): void {
    this.web3Srv.connectWallet().then(() => {
      this.web3Srv.getAccountAddress().then((address) => {
        this.address = address ? address : "";
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
    let balance = this.directionAtoB ? this.balanceA : this.balanceB;
    if(amount > balance){
      this.showAlert("bg-warning", "You cannot trade more tokens than you own.");
      return;
    }

    if(amount <= 0){
      this.showAlert("bg-warning", "You must specify a value greater than 0.");
      return;
    }

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
    let balanceIn = this.directionAtoB ? this.balanceA : this.balanceB;
    let amoutIn = this.directionAtoB ? this.amountA : this.amountB;
    let amoutOut = this.directionAtoB ? this.amountB : this.amountA;
    if(amoutIn <= 0 || amoutOut <= 0){
      this.showAlert("bg-warning", "You must specify a value for either token.");
      return;
    }

    if(amoutIn > balanceIn){
      this.showAlert("bg-warning", "You cannot trade more tokens than you own.");
      return;
    }

    this.working = true;
    this.web3Srv.swapTokens(tokenIn, tokenOut, amoutIn, amoutOut).then((result) => {
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

  showAlert(type : string = 'warning', message : string, header: string = 'Warning'){
    this.alert.type = type + " text-light position-absolute top-50 start-50 translate-middle";
    this.alert.message = message;
    this.alert.header = header;
    this.showAlertFlag = true;
  }

  closeAlert(){
    this.showAlertFlag = false;
  }

  openFaucet(content: TemplateRef<any>){
    this.openModal =  this.modal.open(content, { centered: true, size: 'md' });
  }

  askToken(){
    if(this.fausetTokenType == 0 || this.fausetTokenAmount <= 0){
      return;
    }
    this.workingFauset = true;
    if(this.fausetTokenType == 1){
      this.web3Srv.getFausetToken(this.tokenAAddress, this.fausetTokenAmount).then(() => {
        
        this.web3Srv.getTokenBalance(this.tokenAAddress, this.address).then((response) => {
          this.balanceA = Number(response);
          this.fausetTokenType = 1; 
          this.fausetTokenAmount = 0;
          this.workingFauset = false;
          this.openModal?.close();
        });
        
      });
    }else if(this.fausetTokenType == 2){
      this.web3Srv.getFausetToken(this.tokenBAddress, this.fausetTokenAmount).then(() => {
        this.web3Srv.getTokenBalance(this.tokenBAddress, this.address).then((response) => {
          this.balanceB = Number(response);
          this.fausetTokenType = 1; 
          this.fausetTokenAmount = 0;
          this.workingFauset = false;
          this.openModal?.close();
        });
      });
    }else {
      this.web3Srv.getFausetToken(this.tokenAAddress, this.fausetTokenAmount).then(() => {
        this.web3Srv.getTokenBalance(this.tokenAAddress, this.address).then(response => this.balanceA = Number(response));
        this.web3Srv.getFausetToken(this.tokenBAddress, this.fausetTokenAmount).then(() => {
          this.web3Srv.getTokenBalance(this.tokenBAddress, this.address).then((response) => {
            this.balanceB = Number(response);
            this.fausetTokenType = 1; 
            this.fausetTokenAmount = 0;
            this.workingFauset = false;
            this.openModal?.close();
          });
        });   
      });
    }
  }
}
