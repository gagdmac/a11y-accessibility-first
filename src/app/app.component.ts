import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContentfulService } from './services/contentful/contentful.service';
import { LoadingService } from './services/loading/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'a11y';
  isLoading = false;
  languageChangeAnnouncement = '';

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private contentfulService: ContentfulService,
    private loadingService: LoadingService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.loadingService.loading$.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );

    // Listen to router events
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Add overflow hidden when navigation starts
        this.renderer.setStyle(document.body, 'overflow', 'hidden');
        this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
      }
      if (event instanceof NavigationEnd) {
        // Remove overflow hidden after a delay (match this with your animation duration)
        setTimeout(() => {
          this.renderer.removeStyle(document.body, 'overflow');
          this.renderer.removeStyle(document.documentElement, 'overflow');
        }, 800); // 800ms = animation duration
      }
    });
  }

  ngOnInit() {}

  /**
   * Handle skip to main content link
   * Focuses the first heading in main content instead of the container
   */
  skipToMain(event: Event) {
    event.preventDefault();
    const mainElement = this.document.getElementById('main');
    if (mainElement) {
      // Find the first heading (h1-h6) in the main content
      const firstHeading = mainElement.querySelector('h1, h2, h3, h4, h5, h6') as HTMLElement;
      if (firstHeading) {
        // Make heading focusable if it isn't already
        if (!firstHeading.hasAttribute('tabindex')) {
          firstHeading.setAttribute('tabindex', '-1');
        }
        firstHeading.focus();
        firstHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback to main element if no heading found
        mainElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  onLanguageChange(lang: string) {
    this.contentfulService.setLocale(lang);

    // Update the lang attribute on the HTML element for screen readers
    this.document.documentElement.lang = lang;

    // Switch to the new language first
    this.translate.use(lang).subscribe(() => {
      // Announce language change to screen readers in the new language
      const translationKey = lang === 'en' ? 'languages.changedToEnglish' : 'languages.changedToSpanish';
      const announcement = this.translate.instant(translationKey);
      this.announceToScreenReader(announcement);
    });

    const currentUrl = this.router.url;
    if (
      currentUrl.includes('accessibility-today') ||
      currentUrl.includes('blog')
    ) {
      // Force route refresh
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    }
  }

  /**
   * Announce a message to screen readers using ARIA live region
   * @param message The message to announce
   */
  private announceToScreenReader(message: string) {
    this.languageChangeAnnouncement = message;
    // Clear after screen reader has time to read it
    setTimeout(() => {
      this.languageChangeAnnouncement = '';
    }, 3000);
  }

  private broadcastLanguageChange(lang: string) {
    // Remove the page reload
    // window.location.reload();

    // The components will automatically update when their data refreshes
    console.log('Language changed to:', lang);
  }
}
