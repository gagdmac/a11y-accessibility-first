// Angular imports
import { Component, OnInit } from '@angular/core';

// Application services
import { MetaTagService } from 'src/app/services/MetaTag/meta-tag.service';

@Component({
  selector: 'app-inclusivity',
  templateUrl: './inclusivity.component.html',
  styleUrls: ['./inclusivity.component.scss'],
})
export class InclusivityComponent implements OnInit {
  constructor(private metaTagService: MetaTagService) {}

  ngOnInit() {
    this.setMetaTags();
  }

  setMetaTags() {
    this.metaTagService.setTags({
      title: 'Inclusivity',
      description:
        'Learn about inclusive practices and creating environments that welcome everyone.',
      keywords:
        'inclusivity, diversity, inclusion, accessible environment, equal participation',
      ogTitle: 'Inclusivity - A11Y',
      ogDescription:
        'Learn about inclusive practices and creating environments that welcome everyone.',
      twitterCard: 'summary',
    });
  }
}
