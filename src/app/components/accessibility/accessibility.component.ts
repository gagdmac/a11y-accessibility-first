// Angular imports
import { Component, OnInit } from '@angular/core';

// Application services
import { MetaTagService } from 'src/app/services/MetaTag/meta-tag.service';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss'],
})
export class AccessibilityComponent implements OnInit {
  constructor(private metaTagService: MetaTagService) {}

  ngOnInit() {
    this.setMetaTags();
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
