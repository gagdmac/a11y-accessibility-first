import { Component, OnInit } from '@angular/core';
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
        'Learn about inclusivity practices and creating inclusive environments for all.',
      keywords:
        'inclusivity, inclusion, diversity, accessibility, inclusive practices',
    });
  }
}
