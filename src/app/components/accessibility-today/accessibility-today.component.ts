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
    this.blogPosts$ = this.contentfulService.getEntries().pipe(
      tap(() => {
        requestAnimationFrame(() => {
          this.linkHighlightService.refreshHighlights();
        });
      })
    );
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

  getTranslationKey(index: number): string {
    // Ensure index is within valid range
    const validIndex = Math.max(1, Math.min(index, 4)); // Assuming you have 4 translations
    return `TRANSLATE.TITLE${validIndex}`;
  }
}
