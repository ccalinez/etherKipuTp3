import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-token',
  imports: [],
  templateUrl: './token.component.html',
  styleUrl: './token.component.css'
})


export class TokenComponent {

  @Input()
  tipo!: string;

  @Input()
  balance!: number;

}
