import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-token',
  imports: [FormsModule],
  templateUrl: './token.component.html',
  styleUrl: './token.component.css'
})


export class TokenComponent {

  @Input()
  tipo!: string;

  @Input()
  balance!: number;

  @Input() valor: number = 0;
  @Output() valorChange = new EventEmitter<number>();

  onValorChange() {
    this.valorChange.emit(this.valor);
  }

}
