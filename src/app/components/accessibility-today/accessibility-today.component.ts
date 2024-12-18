import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { LinkHighlightService } from 'src/app/services/links-hightligh/links-highlight.service';

@Component({
  selector: 'app-accessibility-today',
  templateUrl: './accessibility-today.component.html',
  styleUrls: ['./accessibility-today.component.scss'],
})
export class AccessibilityTodayComponent implements OnInit, AfterViewInit {
  constructor(
    private contentfulService: ContentfulService,
    private linkHighlightService: LinkHighlightService
  ) {}

  blogPosts$: Observable<any> | undefined;

  ngOnInit(): void {
    this.refreshContent();
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
}
