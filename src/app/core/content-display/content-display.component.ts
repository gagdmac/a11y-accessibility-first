import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-content-display',
  templateUrl: './content-display.component.html',
  styleUrls: ['./content-display.component.scss'],
})
export class ContentDisplayComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() ariaLabel?: string;
}
