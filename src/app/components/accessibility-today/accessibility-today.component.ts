import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  Breadcrumb,
  ContentfulService,
} from 'src/app/services/contentful/contentful.service';
import { LinkHighlightService } from 'src/app/services/links-hightligh/links-highlight.service';
import { TranslateService } from '@ngx-translate/core';
import { formatDate, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeFr from '@angular/common/locales/fr';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accessibility-today',
  templateUrl: './accessibility-today.component.html',
  styleUrls: ['./accessibility-today.component.scss'],
})
export class AccessibilityTodayComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  breadcrumbs: Breadcrumb[] = [];
  private langSubscription: Subscription;

  constructor(
    private router: Router,
    private contentfulService: ContentfulService,
    private linkHighlightService: LinkHighlightService,
    private translateService: TranslateService
  ) {
    // Register locales
    registerLocaleData(localeEs);
    registerLocaleData(localeFr);

    // Subscribe to language changes
    this.langSubscription = this.translateService.onLangChange.subscribe(() => {
      this.refreshContent();
    });
  }

  blogPosts$: Observable<any> | undefined;

  ngOnInit(): void {
    this.refreshContent();
    this.loadBreadcrumbs();
    // Subscribe to router events to update breadcrumbs when route changes
    this.router.events.subscribe(() => {
      this.loadBreadcrumbs();
    });
  }

  private async loadBreadcrumbs() {
    this.breadcrumbs = [
      {
        label: await this.translateService.get('menu.home').toPromise(),
        url: '/',
        isActive: false,
      },
      {
        label: await this.translateService
          .get('accessibility-today.title')
          .toPromise(),
        url: '/accessibility-today',
        isActive: true,
      },
    ];
  }

  ngAfterViewInit(): void {
    const observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => mutation.addedNodes.length > 0)) {
        this.linkHighlightService.refreshHighlights();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  getTranslationKey(index: number, field: string): string {
    const validIndex = Math.max(1, Math.min(index, 4));
    return `TRANSLATE.${field}${validIndex}`;
  }

  refreshContent() {
    this.blogPosts$ = this.contentfulService.getEntries().pipe(
      tap(() => {
        requestAnimationFrame(() => {
          this.linkHighlightService.refreshHighlights();
        });
      })
    );
  }

  onLanguageChange(lang: string) {
    this.refreshContent();
  }

  formatDate(date: string): string {
    try {
      const currentLang = this.translateService.currentLang || 'en';
      return formatDate(new Date(date), 'longDate', currentLang);
    } catch (error) {
      console.error('Error formatting date:', error);
      return date;
    }
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
