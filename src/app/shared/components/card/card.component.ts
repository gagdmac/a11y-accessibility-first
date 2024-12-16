import { Component, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @ViewChild('cardElement') card!: ElementRef;

  @Input() title!: string;
  @Input() text!: string;
  @Input() link!: string;
  @Input() iconClass!: string;
  @Input() routerLink!: string;
  @Input() isDisabled: boolean = false;
}
