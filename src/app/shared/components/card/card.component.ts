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
  @Input() iconClass!: string;
  @Input() routerLinkValue!: string; // Changed from routerLink to routerLinkValue
  @Input() isDisabled: boolean = false;
}
