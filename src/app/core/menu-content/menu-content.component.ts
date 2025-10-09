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
  @ViewChildren('firstDesktopLink') firstDesktopLinks!: QueryList<ElementRef>;
  @ViewChildren('mobileLink') mobileLinks!: QueryList<ElementRef>;
  private touchStartX = 0;
  private scrollStartX = 0;
  private preventAutoCenter = false;
  private isScrolling = false;
  private scrollTimeout: any;

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
    // Subscribe to navigation events to update active item and refocus
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveItem();
        // Center carousel (will be skipped if user clicked a link directly)
        this.centerActiveItem();
        // Re-focus the active link after navigation
        this.setFocusToActiveLink();
      });
    
    this.linkHighlightService.refreshHighlights();
    
    // Initialize circular slider position for mobile
    if (this.screenWidth <= 1025) {
      setTimeout(() => {
        this.initializeCircularSlider();
      }, 0);
    }
    
    // Set focus to active link when menu renders (especially for mobile after navigation)
    this.setFocusToActiveLink();
  }

  /**
   * Initialize the circular slider
   * No initial offset needed - we'll handle looping dynamically
   */
  private initializeCircularSlider() {
    if (!this.slider?.nativeElement) return;
    
    const container = this.slider.nativeElement;
    
    // Start at position 0
    container.scrollLeft = 0;
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
   * Get aria-label for slider container with item count
   */
  getSliderLabel(): string {
    const navigation = this.translate.instant('app-content-links.navigation');
    const itemsLabel = this.translate.instant('app-content-links.items');
    return `${navigation}. ${this.menuItems.length} ${itemsLabel}`;
  }

  /**
   * Get accessible label for each link that announces:
   * "List X items, you are in item number Y, [Link Name]"
   */
  getLinkLabel(linkName: string, position: number, total: number): string {
    const listLabel = this.translate.instant('app-content-links.list');
    const itemsLabel = this.translate.instant('app-content-links.items');
    const youAreInLabel = this.translate.instant('app-content-links.youAreIn');
    const itemNumberLabel = this.translate.instant('app-content-links.itemNumber');
    
    return `${listLabel} ${total} ${itemsLabel}, ${youAreInLabel} ${itemNumberLabel} ${position}, ${linkName}`;
  }

  /**
   * Handle link click - center the clicked link in the slider
   */
  onLinkClick(event?: Event) {
    // Set flag immediately to prevent auto-centering when clicking a link
    this.preventAutoCenter = true;
    
    // Center the clicked link in the mobile slider
    if (event && this.screenWidth <= 1025) {
      const clickedElement = event.currentTarget as HTMLElement;
      this.centerElementInSlider(clickedElement);
    }
  }

  /**
   * Center a specific element in the slider viewport
   */
  private centerElementInSlider(element: HTMLElement) {
    if (!this.slider?.nativeElement) return;
    
    const container = this.slider.nativeElement;
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Calculate the scroll position to center the element
    const elementCenter = elementRect.left + elementRect.width / 2;
    const containerCenter = containerRect.left + containerRect.width / 2;
    const scrollOffset = elementCenter - containerCenter;
    
    // Scroll to center the element
    container.scrollTo({
      left: container.scrollLeft + scrollOffset,
      behavior: 'smooth',
    });
  }

  private updateActiveItem() {
    const currentRoute = this.router.url;
    this.menuItems.forEach((item) => {
      item.active = item.route === currentRoute;
    });
  }

  private centerActiveItem() {
    // Skip if user clicked a link directly
    if (this.preventAutoCenter) {
      this.preventAutoCenter = false; // Reset flag
      return;
    }
    
    if (!this.slider?.nativeElement) return;
    
    // Find the active link element
    const activeLink = this.slider.nativeElement.querySelector('a.text-bg-primary') || 
                      this.slider.nativeElement.querySelector('a[aria-current="page"]');
    
    if (activeLink) {
      this.centerElementInSlider(activeLink);
    }
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
    // Touch event ended - no additional action needed
  }

  /**
   * Handle scroll event to create infinite/circular scrolling effect
   */
  onSliderScroll() {
    if (!this.slider?.nativeElement || this.isScrolling) return;

    const container = this.slider.nativeElement;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    
    // Calculate the width of one set of items (half of total scroll width since we have duplicates)
    const oneSetWidth = scrollWidth / 2;
    
    this.isScrolling = true;

    // If we've scrolled to or past the duplicate set, jump back to the original set
    if (scrollLeft >= oneSetWidth) {
      // Use requestAnimationFrame for smooth transition
      requestAnimationFrame(() => {
        container.scrollLeft = scrollLeft - oneSetWidth;
        setTimeout(() => {
          this.isScrolling = false;
        }, 10);
      });
    }
    // If somehow scrolled before start (edge case), jump to equivalent position in duplicate set
    else if (scrollLeft < 1) {
      requestAnimationFrame(() => {
        container.scrollLeft = oneSetWidth - clientWidth;
        setTimeout(() => {
          this.isScrolling = false;
        }, 10);
      });
    } else {
      this.isScrolling = false;
    }
  }
}
