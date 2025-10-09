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
  private offcanvasListeners: Array<{ element: Element; listener: EventListener }> = [];
  private collapseListeners: Array<{ element: Element; listener: EventListener }> = [];

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
    // Set up mutual exclusivity between language dropdown, offcanvas, and navbar collapse
    this.setupMutualExclusivity();
  }

  ngOnDestroy() {
    // Clean up event listeners
    this.dropdownListeners.forEach(({ element, listener }) => {
      element.removeEventListener('shown.bs.dropdown', listener as EventListener);
    });
    
    this.offcanvasListeners.forEach(({ element, listener }) => {
      element.removeEventListener('shown.bs.offcanvas', listener as EventListener);
    });
    
    this.collapseListeners.forEach(({ element, listener }) => {
      element.removeEventListener('shown.bs.collapse', listener as EventListener);
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

  closeMenu() {
    const navbarCollapse = document.getElementById('navbarSupportedContent');
    if (navbarCollapse) {
      const bsCollapse = new (window as any).bootstrap.Collapse(navbarCollapse, { toggle: false });
      bsCollapse.hide();
    }
  }

  /**
   * Set up mutual exclusivity between mobile language dropdown, offcanvas menu, and navbar collapse
   * When language dropdown opens, close offcanvas menu and navbar collapse
   * When offcanvas opens, close language dropdown and navbar collapse
   * When navbar collapse opens, close language dropdown
   */
  private setupMutualExclusivity() {
    const languageDropdown = document.getElementById('languageSelectorMobile');
    const offcanvasElement = document.getElementById('offcanvasWithBothOptions');
    const navbarCollapse = document.getElementById('navbarSupportedContent');

    // Handle language dropdown opening -> close offcanvas and navbar collapse
    if (languageDropdown) {
      const dropdownHandler = () => {
        // Close offcanvas if open
        if (offcanvasElement) {
          const bsOffcanvas = (window as any).bootstrap.Offcanvas.getInstance(offcanvasElement);
          if (bsOffcanvas) {
            bsOffcanvas.hide();
          }
        }
        
        // Close navbar collapse if open
        if (navbarCollapse) {
          const bsCollapse = (window as any).bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) {
            bsCollapse.hide();
          }
        }
      };
      
      languageDropdown.addEventListener('shown.bs.dropdown', dropdownHandler);
      this.dropdownListeners.push({ element: languageDropdown, listener: dropdownHandler });
    }

    // Handle offcanvas opening -> close language dropdown and navbar collapse
    if (offcanvasElement) {
      const offcanvasHandler = () => {
        // Close language dropdown if open
        if (languageDropdown) {
          const bsDropdown = (window as any).bootstrap.Dropdown.getInstance(languageDropdown);
          if (bsDropdown) {
            bsDropdown.hide();
          }
        }
        
        // Close navbar collapse if open
        if (navbarCollapse) {
          const bsCollapse = (window as any).bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) {
            bsCollapse.hide();
          }
        }
      };
      
      offcanvasElement.addEventListener('shown.bs.offcanvas', offcanvasHandler);
      this.offcanvasListeners.push({ element: offcanvasElement, listener: offcanvasHandler });
    }

    // Handle navbar collapse opening -> close language dropdown
    if (navbarCollapse) {
      const collapseHandler = () => {
        // Close language dropdown if open
        if (languageDropdown) {
          const bsDropdown = (window as any).bootstrap.Dropdown.getInstance(languageDropdown);
          if (bsDropdown) {
            bsDropdown.hide();
          }
        }
      };
      
      navbarCollapse.addEventListener('shown.bs.collapse', collapseHandler);
      this.collapseListeners.push({ element: navbarCollapse, listener: collapseHandler });
    }
  }
}
