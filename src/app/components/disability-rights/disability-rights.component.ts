import { Component, OnInit } from '@angular/core';
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
        'Information about disability rights, laws, and advocacy resources.',
      keywords:
        'disability rights, disability law, advocacy, accessibility rights',
    });
  }
}
