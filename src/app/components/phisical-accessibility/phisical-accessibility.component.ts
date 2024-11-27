import { Component, OnInit } from '@angular/core';
import { MetaTagService } from 'src/app/services/MetaTag/meta-tag.service';

@Component({
  selector: 'app-phisical-accessibility',
  templateUrl: './phisical-accessibility.component.html',
  styleUrls: ['./phisical-accessibility.component.scss'],
})
export class PhisicalAccessibilityComponent implements OnInit {
  constructor(private metaTagService: MetaTagService) {}

  ngOnInit() {
    this.setMetaTags();
  }

  setMetaTags() {
    this.metaTagService.setTags({
      title: 'Physical Accessibility',
      description:
        'Information about physical accessibility standards and implementations.',
      keywords:
        'physical accessibility, architectural accessibility, accessible design, building access',
    });
  }
}
