import {
  Component,
  Input,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-display',
  templateUrl: './content-display.component.html',
  styleUrls: ['./content-display.component.scss'],
})
export class ContentDisplayComponent {
  constructor(private router: Router) {}
  //template condition to show the content
  isSmallScreen = false;

  @Input() title: string = '';
  @Input() info: string = '';
  @Input() extra: string = '';
  @Input() more: string = '';
  @Input() staticLink: string = '';
  @Input() link: string = '';
  @Input() links: Array<{ text: string; route: string }> = [];
  @Input() ariaLabel?: string;
  @Input() backgroundClass: string = '';

  @ViewChild('sliderContent') sliderContent!: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 1025;
  }

  isActive(route: string): boolean {
    if (route === 'home') {
      return this.router.url === '/' || this.router.url === '/home';
    }
    return this.router.url.includes(route);
  }

  slideLeft() {
    const container = this.sliderContent.nativeElement;
    container.scrollLeft -= 200; // Adjust scroll amount as needed
  }

  slideRight() {
    const container = this.sliderContent.nativeElement;
    container.scrollLeft += 200; // Adjust scroll amount as needed
  }
}
