import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeFr from '@angular/common/locales/fr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

//routing
import appRoutes from './routing/routerConfig';

import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { ServicesModule } from './services/services.module';
import { A11yOptionsComponent } from './core/a11y-options/a11y-options.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

// import ngx-translate and the http loader
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HeaderComponent } from '././core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { UniversalDesignComponent } from './components/accessibility-Info/universal-design/universal-design.component';
import { AccessibleHealthcareComponent } from './components/accessibility-Info/accessible-healthcare/accessible-healthcare.component';
import { DisabilityRightsComponent } from './components/accessibility-Info/disability-rights/disability-rights.component';
import { InclusivityComponent } from './components/accessibility-Info/inclusivity/inclusivity.component';
import { PhisicalAccessibilityComponent } from './components/accessibility-Info/phisical-accessibility/phisical-accessibility.component';
import { ContentDisplayComponent } from './core/content-display/content-display.component';

import { MenuContentComponent } from './core/menu-content/menu-content.component';
import { AccessibilityTodayComponent } from './components/accessibility-today/accessibility-today.component';
import { HomeContentComponent } from './core/home-content/home-content.component';
import { CardComponent } from './shared/components/card/card.component';
import { Empty404Component } from './core/empty-404/empty-404.component';
import { AccessibilityComponent } from './components/accessibility-Info/accessibility/accessibility.component';
import { BlogPostComponent } from './components/accessibility-today/blog-post/blog-post.component';
import { AboutMeComponent } from './core/about-me/about-me.component';
import { RssFeedComponent } from './core/rss-feed/rss-feed.component';
import { LoadingComponent } from './components/loading/loading.component';

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    CardComponent,
    AppComponent,
    A11yOptionsComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    UniversalDesignComponent,
    AccessibleHealthcareComponent,
    DisabilityRightsComponent,
    InclusivityComponent,
    PhisicalAccessibilityComponent,
    ContentDisplayComponent,
    AccessibilityComponent,
    MenuContentComponent,
    AccessibilityTodayComponent,
    HomeContentComponent,
    Empty404Component,
    BlogPostComponent,
    AboutMeComponent,
    RssFeedComponent,
    LoadingComponent,
  ],
  imports: [
    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ServicesModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    {
      provide: LOCALE_ID,
      deps: [TranslateService],
      useFactory: (translateService: TranslateService) =>
        translateService.currentLang || 'en',
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
