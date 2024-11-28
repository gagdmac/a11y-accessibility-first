// routerConfig.ts

import { Routes } from '@angular/router';
import { A11yOptionsComponent } from '../components/a11y-options/a11y-options.component';
import { HomeComponent } from '../components/home/home.component';
import { DigitalAccessibilityComponent } from '../components/digital-accessibility/digital-accessibility.component';
import { UniversalDesignComponent } from '../components/universal-design/universal-design.component';
import { AccessibleHealthcareComponent } from '../components/accessible-healthcare/accessible-healthcare.component';
import { DisabilityRightsComponent } from '../components/disability-rights/disability-rights.component';
import { InclusivityComponent } from '../components/inclusivity/inclusivity.component';
import { PhisicalAccessibilityComponent } from '../components/phisical-accessibility/phisical-accessibility.component';
import { AccessibilityComponent } from '../components/accessibility/accessibility.component';

// core components

const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    title: 'home',
  },
  {
    path: 'accessibility',
    component: AccessibilityComponent,
    title: 'Accessibility fisrt',
  },
  {
    path: 'digital',
    component: DigitalAccessibilityComponent,
    title: 'Digital accessibility',
  },
  {
    path: 'universal',
    component: UniversalDesignComponent,
    title: 'Universal design',
  },
  { path: 'a11y', component: A11yOptionsComponent, title: 'A11Y' },
  {
    path: 'healthcare',
    component: AccessibleHealthcareComponent,
    title: 'Accessible Healthcare',
  },
  {
    path: 'rights',
    component: DisabilityRightsComponent,
    title: 'Disability Rights',
  },
  {
    path: 'inclusivity',
    component: InclusivityComponent,
    title: 'Inclusivity',
  },
  {
    path: 'phisical',
    component: PhisicalAccessibilityComponent,
    title: 'Phisical Accessibility',
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }, // Add wildcard route at the end
];
export default appRoutes;
