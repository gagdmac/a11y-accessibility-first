// routerConfig.ts

import { Routes } from '@angular/router';
import { A11yOptionsComponent } from '../components/a11y-options/a11y-options.component';
import { HomeComponent } from '../components/home/home.component';
import { DigitalAccessibilityComponent } from '../components/digital-accessibility/digital-accessibility.component';

// core components

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent, title: 'Home' },
  {
    path: 'digital',
    component: DigitalAccessibilityComponent,
    title: 'Digital accessibility',
  },
  { path: 'a11y', component: A11yOptionsComponent, title: 'A11Y' },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
export default appRoutes;
