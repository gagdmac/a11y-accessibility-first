import {
  Component,
  Input,
  HostListener,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { LinkHighlightService } from 'src/app/services/links-hightligh/links-highlight.service';

@Component({
  selector: 'app-content-display',
  templateUrl: './content-display.component.html',
  styleUrls: ['./content-display.component.scss'],
})
export class ContentDisplayComponent implements OnInit, OnDestroy {
  Array: any;
  constructor(
    private router: Router,
    private linkHighlightService: LinkHighlightService
  ) {}
  //template condition to show the content
  isSmallScreen = false;
  isHighlightActive = false;
  private highlightSubscription: Subscription | undefined;

  @Input() title: string = '';
  @Input() info: string = '';
  @Input() extra: string = '';
  @Input() more: string = '';
  @Input() dataTitle: string = '';
  @Input() data: string | string[] = '';
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
    this.highlightSubscription =
      this.linkHighlightService.isHighlightActive$.subscribe(
        (isActive: boolean) => (this.isHighlightActive = isActive)
      );
  }

  ngOnDestroy() {
    if (this.highlightSubscription) {
      this.highlightSubscription.unsubscribe();
    }
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

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  get dataAsArray(): string[] {
    return Array.isArray(this.data) ? this.data : [];
  }
}
