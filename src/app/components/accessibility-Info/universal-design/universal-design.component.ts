// Angular imports
import { Component, OnInit } from '@angular/core';

// Application services
import { MetaTagService } from 'src/app/services/MetaTag/meta-tag.service';

@Component({
  selector: 'app-universal-design',
  templateUrl: './universal-design.component.html',
  styleUrls: ['./universal-design.component.scss'],
})
export class UniversalDesignComponent implements OnInit {
  constructor(private metaTagService: MetaTagService) {}

  ngOnInit() {
    this.setMetaTags();
  }

  setMetaTags() {
    this.metaTagService.setTags({
      title: 'Universal Design',
      description:
        'Learn about universal design principles and their application in creating inclusive environments.',
      keywords:
        'universal design, inclusive design, accessibility, design for all',
      ogTitle: 'Universal Design - A11Y',
      ogDescription:
        'Learn about universal design principles and their application in creating inclusive environments.',
      twitterCard: 'summary',
    });
  }
}
