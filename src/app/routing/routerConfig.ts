// routerConfig.ts

import { Routes } from '@angular/router';
import { A11yOptionsComponent } from '../core/a11y-options/a11y-options.component';
import { HomeComponent } from '../components/home/home.component';
import { UniversalDesignComponent } from '../components/accessibility-Info/universal-design/universal-design.component';
import { AccessibleHealthcareComponent } from '../components/accessibility-Info/accessible-healthcare/accessible-healthcare.component';
import { DisabilityRightsComponent } from '../components/accessibility-Info/disability-rights/disability-rights.component';
import { InclusivityComponent } from '../components/accessibility-Info/inclusivity/inclusivity.component';
import { PhisicalAccessibilityComponent } from '../components/accessibility-Info/phisical-accessibility/phisical-accessibility.component';
import { AccessibilityComponent } from '../components/accessibility-Info/accessibility/accessibility.component';

import { Empty404Component } from '../core/empty-404/empty-404.component';
import { AccessibilityTodayComponent } from '../components/accessibility-today/accessibility-today.component';
import { BlogPostComponent } from '../components/accessibility-today/blog-post/blog-post.component';
import { RssFeedComponent } from '../core/rss-feed/rss-feed.component';

// core components

const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    title: 'Accessibility First',
  },
  {
    path: 'accessibility-today',
    component: AccessibilityTodayComponent,
    title: 'Accessibility today',
  },
  {
    path: 'blog/:urlHandle',
    component: BlogPostComponent,
    title: 'Accessibility Today: The BLOG',
  },
  {
    path: 'accessibility',
    component: AccessibilityComponent,
    title: 'Accessibility first',
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
  {
    path: '404',
    component: Empty404Component,
    title: 'No page found',
  },

  {
    path: 'feed.xml',
    component: RssFeedComponent,
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }, // Add wildcard route at the end
];
export default appRoutes;
