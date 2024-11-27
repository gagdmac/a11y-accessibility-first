import { Component, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

interface MenuItem {
  route: string;
  label: string;
}

@Component({
  selector: 'app-menu-content',
  templateUrl: './menu-content.component.html',
  styleUrls: ['./menu-content.component.scss'],
})
export class MenuContentComponent implements AfterViewInit {
  screenWidth: number = window.innerWidth;
  @ViewChild('slider') slider!: ElementRef;
  canScrollLeft = false;
  canScrollRight = false;
  private touchStartX = 0;
  private scrollStartX = 0;

  constructor(
    public router: Router,
    private translate: TranslateService
  ) {}

  menuItems: MenuItem[] = [
    { route: '/accessibility', label: 'app-content-links.accessibility' },
    { route: '/universal', label: 'app-content-links.universal' },
    { route: '/healthcare', label: 'app-content-links.healcare' },
    { route: '/rights', label: 'app-content-links.rights' },
    { route: '/inclusivity', label: 'app-content-links.inclusivity' },
    { route: '/phisical', label: 'app-content-links.phisical' },
  ];

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  ngAfterViewInit() {
    this.checkScrollButtons();
  }

  private checkScrollButtons() {
    const el = this.slider.nativeElement;
    this.canScrollLeft = el.scrollLeft > 0;
    this.canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth;
  }

  scroll(direction: 'left' | 'right') {
    const el = this.slider.nativeElement;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(() => this.checkScrollButtons(), 100);
  }

  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.touches[0].pageX;
    this.scrollStartX = this.slider.nativeElement.scrollLeft;
  }

  onTouchMove(e: TouchEvent) {
    const touchDiff = this.touchStartX - e.touches[0].pageX;
    this.slider.nativeElement.scrollLeft = this.scrollStartX + touchDiff;
  }

  onTouchEnd() {
    this.checkScrollButtons();
  }
}
