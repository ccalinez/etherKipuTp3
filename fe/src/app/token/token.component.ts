import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-token',
  imports: [FormsModule, NgbTooltipModule, CommonModule],
  templateUrl: './token.component.html',
  styleUrl: './token.component.css'
})


export class TokenComponent {

  @Input()
  tipo!: string;

  @Input()
  balance!: number;

   @Input()
  direccion!: boolean;

  @Input() valor: number = 0;
  @Output() valorChange = new EventEmitter<number>();

  onValorChange() {
    this.valorChange.emit(this.valor);
  }

}
