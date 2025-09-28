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

  cards = [
    {
      isDisabled: false,
      title: 'home.card1.title',
      text: 'home.card1.text',
      link: 'home.card1.link',
      iconClass: 'svg-a11y-today',
      routerLink: '/accessibility-today',
    },
    {
      isDisabled: true,
      title: 'home.card2.title',
      text: 'home.card2.text',
      link: 'home.card2.link',
      iconClass: 'svg-tutorials',
      routerLink: '/',
    },
    {
      isDisabled: true,
      title: 'home.card3.title',
      text: 'home.card3.text',
      link: 'home.card3.link',
      iconClass: 'svg-courses',
      routerLink: '/',
    },
  ];

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
