import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() languageChange = new EventEmitter<string>();

  constructor(
    public translate: TranslateService,
    private contentfulService: ContentfulService
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  changeLanguage(lang: string) {
    console.log('Language change requested:', lang);
    this.translate.use(lang);
    this.contentfulService.setLocale(lang);
    this.languageChange.emit(lang);
    // Get current path and update URL with language
    const currentPath = window.location.pathname;
    this.contentfulService.updateBrowserUrl(currentPath, { lang });
  }

  closeMenu(): void {
    const navbarCollapse = document.getElementById('navbarSupportedContent');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const bsCollapse = new (window as any).bootstrap.Collapse(navbarCollapse, {
        toggle: false,
      });
      bsCollapse.hide();
    }
  }
}
