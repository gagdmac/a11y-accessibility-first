import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
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

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private contentfulService: ContentfulService,
    private loadingService: LoadingService
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

  onLanguageChange(lang: string) {
    this.contentfulService.setLocale(lang);

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

  private broadcastLanguageChange(lang: string) {
    // Remove the page reload
    // window.location.reload();

    // The components will automatically update when their data refreshes
    console.log('Language changed to:', lang);
  }
}
