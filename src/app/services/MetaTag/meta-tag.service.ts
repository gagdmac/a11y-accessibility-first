import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MetaTagService {
  constructor(
    private metaService: Meta,
    private titleService: Title,
    private router: Router
  ) {
    this.initializeMetaTags();
  }

  private initializeMetaTags() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateMetaTags();
      });
  }

  private updateMetaTags() {
    // Default meta tags
    this.titleService.setTitle('Your Application Name');

    this.metaService.updateTag({
      name: 'description',
      content: 'Default site description',
    });

    // Open Graph tags
    this.metaService.updateTag({
      property: 'og:title',
      content: 'Your Application Name',
    });
    this.metaService.updateTag({
      property: 'og:description',
      content: 'Default site description',
    });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
  }

  // Method to set custom route-specific meta tags
  setCustomMetaTags(config: {
    title?: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
  }) {
    if (config.title) {
      this.titleService.setTitle(config.title);
    }

    if (config.description) {
      this.metaService.updateTag({
        name: 'description',
        content: config.description,
      });
    }

    if (config.ogTitle) {
      this.metaService.updateTag({
        property: 'og:title',
        content: config.ogTitle,
      });
    }

    if (config.ogDescription) {
      this.metaService.updateTag({
        property: 'og:description',
        content: config.ogDescription,
      });
    }
  }

  setTags(config: { title?: string; description?: string; keywords?: string }) {
    if (config.title) {
      this.titleService.setTitle(config.title);
    }

    if (config.description) {
      this.metaService.updateTag({
        name: 'description',
        content: config.description,
      });
    }

    if (config.keywords) {
      this.metaService.updateTag({
        name: 'keywords',
        content: config.keywords,
      });
    }
  }
}
