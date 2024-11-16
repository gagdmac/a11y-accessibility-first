import { Component, Input, HostListener } from '@angular/core';
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
  @Input() links: Array<{ text: string; route: string }> = [];
  @Input() ariaLabel?: string;
  @Input() backgroundClass: string = '';

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
    return (
      this.router.url === route || (route === 'home' && this.router.url === '/')
    );
  }
}
