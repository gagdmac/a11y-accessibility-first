// Angular imports
import { Component, OnInit } from '@angular/core';

// NgX imports
import { TranslateService } from '@ngx-translate/core';

// Application services
import { FontSizeService } from 'src/app/services/font-size/font-size.service';
import { LinkHighlightService } from 'src/app/services/links-hightligh/links-highlight.service';
import { MetaTagService } from 'src/app/services/MetaTag/meta-tag.service';
import { ThemeService } from 'src/app/services/themes-color/theme.service';

@Component({
  selector: 'app-a11y-options',
  templateUrl: './a11y-options.component.html',
  styleUrls: ['./a11y-options.component.scss'],
})
export class A11yOptionsComponent implements OnInit {
  currentFontSize = 100;
  fontSizeAnnouncement = '';

  constructor(
    private themeService: ThemeService,
    public fontSizeService: FontSizeService,
    public linkHighlightService: LinkHighlightService,
    private translate: TranslateService,
    private metaTagService: MetaTagService
  ) {}

  ngOnInit(): void {
    this.setMetaTags();
  }

  setMetaTags() {
    this.metaTagService.setTags({
      title: 'Accessibility Options',
      description:
        'Explore various accessibility options and features to enhance your browsing experience.',
      keywords:
        'accessibility options, accessibility features, assistive technology, user preferences',
      ogTitle: 'Accessibility Options - A11Y',
      ogDescription:
        'Explore various accessibility options and features to enhance your browsing experience.',
      twitterCard: 'summary',
    });
  }

  get fontSize() {
    return this.fontSizeService.getFontSize();
  }

  increaseFontSize() {
    this.fontSizeService.setFontSize(this.fontSize + 5);
    this.fontSizeAnnouncement = `Font size increased to ${this.fontSize} percent`;

    setTimeout(() => {
      this.fontSizeAnnouncement = '';
    }, 1000);
  }

  decreaseFontSize() {
    this.fontSizeService.setFontSize(this.fontSize - 5);
    this.fontSizeAnnouncement = `Font size decreased to ${this.fontSize} percent`;

    setTimeout(() => {
      this.fontSizeAnnouncement = '';
    }, 1000);
  }

  resetFontSize() {
    this.fontSizeService.resetFontSize();
  }

  //////////////
  //Toogle theme
  //////////////

  //Toogle theme button
  switchTheme(theme: string): void {
    this.themeService.setTheme(
      theme as 'light' | 'dark' | 'creamy' | 'blind-color'
    );
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  //////////////
  //linkHighlightService
  //////////////

  get buttonText() {
    return this.linkHighlightService.highlightedLinksCount > 0
      ? this.translate.instant('a11y.removeHighlights')
      : this.translate.instant('a11y.highlightLinks');
  }

  toggleLinkHighlight() {
    this.linkHighlightService.toggleLinkHighlight();
  }

  onOffcanvasShown(): void {
    // Focus the title when offcanvas opens for TalkBack accessibility
    setTimeout(() => {
      const titleElement = document.getElementById('offcanvasTitle');
      if (titleElement) {
        titleElement.focus();
      }
    }, 100);
  }
}
