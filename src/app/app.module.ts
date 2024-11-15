import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//routing
import appRoutes from './routing/routerConfig';

import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { ServicesModule } from './services/services.module';
import { A11yOptionsComponent } from './components/a11y-options/a11y-options.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HeaderComponent } from '././core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { DigitalAccessibilityComponent } from './components/digital-accessibility/digital-accessibility.component';

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    A11yOptionsComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    DigitalAccessibilityComponent,
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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
