// routerConfig.ts

import { Routes } from '@angular/router';
import { A11yOptionsComponent } from '../components/a11y-options/a11y-options.component';
import { HomeComponent } from '../components/home/home.component';

// core components

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent, title: 'home' },
  { path: 'a11y', component: A11yOptionsComponent, title: 'a11y' },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
export default appRoutes;
