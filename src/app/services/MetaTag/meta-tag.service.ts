import { Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface MetaTagConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
}

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
        const defaultConfig: MetaTagConfig = {
          title: 'Your Application Name',
          description: 'Default site description',
          keywords: '',
          ogTitle: 'Your Application Name',
          ogDescription: 'Default site description',
          twitterCard: 'summary',
          robots: 'index, follow',
        };
        this.updateMetaTags(defaultConfig);
      });
  }

  setTags(config: Partial<MetaTagConfig>): void {
    this.updateMetaTags(config);
  }

  private updateMetaTags(config: Partial<MetaTagConfig>) {
    if (config.title) {
      this.titleService.setTitle(config.title);
    }

    const metaTags: Array<MetaDefinition> = [
      { name: 'description', content: config.description || '' },
      { name: 'keywords', content: config.keywords || '' },
      { name: 'robots', content: config.robots || '' },
      { property: 'og:title', content: config.ogTitle || config.title || '' },
      {
        property: 'og:description',
        content: config.ogDescription || config.description || '',
      },
      { property: 'og:image', content: config.ogImage || '' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: config.twitterCard || '' },
      {
        name: 'twitter:title',
        content: config.twitterTitle || config.title || '',
      },
      {
        name: 'twitter:description',
        content: config.twitterDescription || config.description || '',
      },
      { name: 'twitter:image', content: config.twitterImage || '' },
    ];

    metaTags.forEach((tag) => {
      if (tag.content) {
        this.metaService.updateTag(tag);
      }
    });

    if (config.canonicalUrl) {
      this.getLinkElement('canonical').setAttribute(
        'href',
        config.canonicalUrl
      );
    }
  }

  private getLinkElement(rel: string): HTMLLinkElement {
    let link = document.head.querySelector(`link[rel='${rel}']`);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      document.head.appendChild(link);
    }
    return link as HTMLLinkElement;
  }
}
