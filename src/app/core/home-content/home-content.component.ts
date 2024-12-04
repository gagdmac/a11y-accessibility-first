import { Component, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.scss'],
})
export class HomeContentComponent {
  constructor(private router: Router) {}

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

  isActive(path: string): boolean {
    return this.router.url === '/' + path;
  }
}
