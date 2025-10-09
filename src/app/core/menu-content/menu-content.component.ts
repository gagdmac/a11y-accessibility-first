import {
  Component,
  HostListener,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LinkHighlightService } from 'src/app/services/links-hightligh/links-highlight.service';
import { filter } from 'rxjs/operators';

interface MenuItem {
  route: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'app-menu-content',
  templateUrl: './menu-content.component.html',
  styleUrls: ['./menu-content.component.scss'],
})
export class MenuContentComponent implements AfterViewInit {
  screenWidth: number = window.innerWidth;
  @ViewChild('slider') slider!: ElementRef;
  @ViewChild('leftButton') leftButton!: ElementRef;
  @ViewChild('rightButton') rightButton!: ElementRef;
  @ViewChildren('firstDesktopLink') firstDesktopLinks!: QueryList<ElementRef>;
  @ViewChildren('mobileLink') mobileLinks!: QueryList<ElementRef>;
  canScrollLeft = false;
  canScrollRight = false;
  private touchStartX = 0;
  private scrollStartX = 0;
  private shouldFocusAfterScroll = false;

  constructor(
    public router: Router,
    private translate: TranslateService,
    private linkHighlightService: LinkHighlightService
  ) {
    // Subscribe to router events for navigation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.linkHighlightService.refreshHighlights();
        }, 100);
      });
  }

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
    
    // Subscribe to navigation events to update active item and refocus
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveItem();
        this.centerActiveItem();
        // Re-focus the active link after navigation
        this.setFocusToActiveLink();
      });
    
    this.linkHighlightService.refreshHighlights();
    
    // Set focus to active link when menu renders (especially for mobile after navigation)
    this.setFocusToActiveLink();
  }

  /**
   * Set focus to the active/current link in the menu
   * This ensures keyboard and screen reader users land on the current page link after navigation
   */
  private setFocusToActiveLink() {
    setTimeout(() => {
      if (this.screenWidth > 1024) {
        // Desktop menu - find and focus the active link
        const activeLink = this.firstDesktopLinks?.find((link: ElementRef) => {
          return this.router.isActive(link.nativeElement.getAttribute('href') || '', true);
        });
        if (activeLink) {
          activeLink.nativeElement.focus();
        } else {
          // Fallback to first link if no active link found
          this.firstDesktopLinks?.first?.nativeElement.focus();
        }
      } else {
        // Mobile menu - find and focus the active link
        const activeLink = this.mobileLinks?.find((link: ElementRef) => {
          return this.router.isActive(link.nativeElement.getAttribute('href') || '', true);
        });
        if (activeLink) {
          activeLink.nativeElement.focus();
        } else {
          // Fallback to first link if no active link found
          this.mobileLinks?.first?.nativeElement.focus();
        }
      }
    }, 300);
  }

  /**
   * Get aria-label for chevron buttons including disabled state
   */
  getChevronLabel(direction: 'left' | 'right'): string {
    const translationKey = direction === 'left' ? 'app-content-links.left' : 'app-content-links.right';
    const baseLabel = this.translate.instant(translationKey);
    const canScroll = direction === 'left' ? this.canScrollLeft : this.canScrollRight;
    
    if (!canScroll) {
      const disabledLabel = this.translate.instant('app-content-links.disabled');
      return `${baseLabel}. ${disabledLabel}`;
    }
    return baseLabel;
  }

  /**
   * Get aria-label for slider container with item count
   */
  getSliderLabel(): string {
    const navigation = this.translate.instant('app-content-links.navigation');
    const itemsLabel = this.translate.instant('app-content-links.items');
    return `${navigation}. ${this.menuItems.length} ${itemsLabel}`;
  }

  /**
   * Handle link click - don't navigate, let Angular Router handle it
   */
  onLinkClick() {
    // Reset flag - navigation will be handled by router
    this.shouldFocusAfterScroll = false;
  }

  /**
   * Scroll the carousel and focus the next appropriate element
   */
  scrollAndFocusNext(direction: 'left' | 'right') {
    this.shouldFocusAfterScroll = true;
    this.scroll(direction);
    
    // After scrolling, focus the next visible item
    setTimeout(() => {
      if (this.shouldFocusAfterScroll) {
        this.focusNextVisibleItem(direction);
        this.shouldFocusAfterScroll = false;
      }
    }, 400);
  }

  /**
   * Focus the next visible item after scrolling
   */
  private focusNextVisibleItem(direction: 'left' | 'right') {
    const container = this.slider.nativeElement;
    const links = this.mobileLinks.toArray();
    
    // Find the first fully visible link after scroll
    for (const link of links) {
      const element = link.nativeElement;
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // Check if element is visible in the container
      if (rect.left >= containerRect.left && rect.right <= containerRect.right) {
        element.focus();
        return;
      }
    }
  }

  private checkScrollButtons() {
    const el = this.slider.nativeElement;
    this.canScrollLeft = el.scrollLeft > 0;
    this.canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth;
  }

  private updateActiveItem() {
    const currentRoute = this.router.url;
    this.menuItems.forEach((item) => {
      item.active = item.route === currentRoute;
    });
  }

  private centerActiveItem() {
    const activeItem = this.slider.nativeElement.querySelector('.active');
    if (activeItem) {
      const container = this.slider.nativeElement;
      const scrollLeft =
        activeItem.offsetLeft -
        container.clientWidth / 2 +
        activeItem.offsetWidth / 2;
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
      setTimeout(() => this.checkScrollButtons(), 100);
    }
  }

  scroll(direction: 'left' | 'right') {
    const el = this.slider.nativeElement;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
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
