import { Component, OnInit } from '@angular/core';
import { MetaTagService } from 'src/app/services/MetaTag/meta-tag.service';

@Component({
  selector: 'app-accessible-healthcare',
  templateUrl: './accessible-healthcare.component.html',
  styleUrls: ['./accessible-healthcare.component.scss'],
})
export class AccessibleHealthcareComponent implements OnInit {
  constructor(private metaTagService: MetaTagService) {}

  ngOnInit() {
    this.setMetaTags();
  }

  setMetaTags() {
    this.metaTagService.setTags({
      title: 'Accessible Healthcare',
      description:
        'Information about accessible healthcare services and facilities for people with disabilities.',
      keywords:
        'accessible healthcare, medical accessibility, healthcare facilities, disability healthcare',
      ogTitle: 'Accessible Healthcare - A11Y',
      ogDescription:
        'Information about accessible healthcare services and facilities for people with disabilities.',
      twitterCard: 'summary',
    });
  }
}
