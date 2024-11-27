import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
  constructor(public router: Router) {}

  menuItems: MenuItem[] = [
    { route: '/accessibility', label: 'Accessibility' },
    { route: '/universal', label: 'Universal design' },
    { route: '/healthcare', label: 'Accessible Healthcare' },
    { route: '/rights', label: 'Disability Rights' },
    { route: '/inclusivity', label: 'Inclusivity' },
    { route: '/phisical', label: 'Physical Accessibility' },
  ];
}
