// Angular imports
import { Component, OnInit } from '@angular/core';

// Application services
import { MetaTagService } from 'src/app/services/MetaTag/meta-tag.service';

@Component({
  selector: 'app-disability-rights',
  templateUrl: './disability-rights.component.html',
  styleUrls: ['./disability-rights.component.scss'],
})
export class DisabilityRightsComponent implements OnInit {
  constructor(private metaTagService: MetaTagService) {}

  ngOnInit() {
    this.setMetaTags();
  }

  setMetaTags() {
    this.metaTagService.setTags({
      title: 'Disability Rights',
      description:
        'Information about disability rights, laws, and advocacy for equal access and opportunities.',
      keywords:
        'disability rights, ADA, equality, accessibility laws, disability advocacy',
      ogTitle: 'Disability Rights - A11Y',
      ogDescription:
        'Information about disability rights, laws, and advocacy for equal access and opportunities.',
      twitterCard: 'summary',
    });
  }
}
