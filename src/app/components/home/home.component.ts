import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MetaTagService } from 'src/app/services/MetaTag/meta-tag.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private router: Router, private metaTagService: MetaTagService) {}

  isSmallScreen = false;

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

  setMetaTags() {
    this.metaTagService.setTags({
      title: 'Web Accessibility',
      description:
        'Learn about web accessibility standards and best practices for creating inclusive digital experiences.',
      keywords: 'web accessibility, WCAG, digital inclusion, accessible design',
      ogTitle: 'Web Accessibility - A11Y',
      ogDescription:
        'Learn about web accessibility standards and best practices for creating inclusive digital experiences.',
      twitterCard: 'summary',
    });
  }
}
