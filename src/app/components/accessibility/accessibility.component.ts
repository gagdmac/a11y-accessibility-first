import { Component } from '@angular/core';
import { MetaTagService } from 'src/app/services/MetaTag/meta-tag.service';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss'],
})
export class AccessibilityComponent {
  constructor(private metaTagService: MetaTagService) {
    // Set custom meta tags for this route
    this.metaTagService.setCustomMetaTags({
      title: 'Accessibility first',
      description:
        'Accesibilityrefers to the design of products, devices, services, or environments to be usable by all people, to the greatest extent possible, without the need for adaptation or specialized design',
    });
  }
}
