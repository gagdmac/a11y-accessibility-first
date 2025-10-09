import { Component, EventEmitter, Output, AfterViewInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  @Output() languageChange = new EventEmitter<string>();
  private dropdownListeners: Array<{ element: Element; listener: EventListener }> = [];

  constructor(
    public translate: TranslateService,
    private contentfulService: ContentfulService
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngAfterViewInit() {
    // Set up focus management for all dropdowns
    this.setupDropdownFocusManagement();
  }

  ngOnDestroy() {
    // Clean up event listeners
    this.dropdownListeners.forEach(({ element, listener }) => {
      element.removeEventListener('shown.bs.dropdown', listener as EventListener);
    });
  }

  /**
   * Set up focus management for Bootstrap dropdowns
   * When dropdown opens, focus moves to first item in the list
   * For language selectors, focus moves to the currently active language
   */
  private setupDropdownFocusManagement() {
    const dropdowns = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    
    dropdowns.forEach((dropdown) => {
      const listener = () => {
        // Find the dropdown menu associated with this toggle
        const dropdownMenu = dropdown.nextElementSibling;
        if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
          let itemToFocus: HTMLElement | null = null;
          
          // Check if this is a language selector
          const isLanguageSelector = dropdown.id.includes('languageSelector');
          
          if (isLanguageSelector) {
            // For language selector, focus the current language
            const currentLang = this.translate.currentLang;
            const langLinks = dropdownMenu.querySelectorAll('a.dropdown-item');
            
            langLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href && href.includes(`lang=${currentLang}`)) {
                itemToFocus = link as HTMLElement;
              }
            });
            
            // Fallback to first item if current language not found
            if (!itemToFocus) {
              itemToFocus = dropdownMenu.querySelector('a.dropdown-item:not(.disabled)') as HTMLElement;
            }
          } else {
            // For navigation dropdowns, focus first non-disabled item
            itemToFocus = dropdownMenu.querySelector('a.dropdown-item:not(.disabled), button.dropdown-item:not(:disabled)') as HTMLElement;
          }
          
          if (itemToFocus) {
            setTimeout(() => {
              itemToFocus!.focus();
            }, 100);
          }
        }
      };
      
      dropdown.addEventListener('shown.bs.dropdown', listener);
      this.dropdownListeners.push({ element: dropdown, listener });
    });
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
