import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

interface MenuItem {
  route: string;
  label: string;
}

@Component({
  selector: 'app-menu-content',
  templateUrl: './menu-content.component.html',
  styleUrls: ['./menu-content.component.scss'],
})
export class MenuContentComponent {
  constructor(
    public router: Router,
    private translate: TranslateService
  ) {}

  menuItems: MenuItem[] = [
    { route: '/accessibility', label: 'app-content-links.accessibility' },
    { route: '/universal', label: 'app-content-links.universal' },
    { route: '/healthcare', label: 'app-content-links.healcare' },
    { route: '/rights', label: 'app-content-links.rights' },
    { route: '/inclusivity', label: 'app-content-links.inclusivity' },
    { route: '/phisical', label: 'app-content-links.phisical' },
  ];
}
