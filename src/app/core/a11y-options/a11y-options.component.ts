// Angular imports
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

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
  @ViewChild('increaseFontSizeBtn') increaseFontSizeBtn?: ElementRef<HTMLButtonElement>;
  @ViewChild('decreaseFontSizeBtn') decreaseFontSizeBtn?: ElementRef<HTMLButtonElement>;
  
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

  get isMaxFontSize() {
    return this.fontSize >= this.fontSizeService.getMaxFontSize();
  }

  get isMinFontSize() {
    return this.fontSize <= this.fontSizeService.getMinFontSize();
  }

  increaseFontSize() {
    if (this.isMaxFontSize) {
      // Announce max size reached and focus the decrease button
      this.fontSizeAnnouncement = this.translate.instant('a11y.fontSizeMaximum');
      console.log('Max font size reached, focusing decrease button');
      if (this.decreaseFontSizeBtn?.nativeElement) {
        console.log('Decrease button found, focusing...');
        this.decreaseFontSizeBtn.nativeElement.focus();
      } else {
        console.log('Decrease button not found');
      }
      setTimeout(() => {
        this.fontSizeAnnouncement = '';
      }, 1000);
      return;
    }

    this.fontSizeService.setFontSize(this.fontSize + 25);
    this.fontSizeAnnouncement = this.translate.instant('a11y.fontSizeIncreased', { size: this.fontSize });

    setTimeout(() => {
      this.fontSizeAnnouncement = '';
    }, 1000);
  }

  decreaseFontSize() {
    if (this.isMinFontSize) {
      // Announce min size reached and focus the increase button
      this.fontSizeAnnouncement = this.translate.instant('a11y.fontSizeMinimum');
      console.log('Min font size reached, focusing increase button');
      if (this.increaseFontSizeBtn?.nativeElement) {
        console.log('Increase button found, focusing...');
        this.increaseFontSizeBtn.nativeElement.focus();
      } else {
        console.log('Increase button not found');
      }
      setTimeout(() => {
        this.fontSizeAnnouncement = '';
      }, 1000);
      return;
    }

    this.fontSizeService.setFontSize(this.fontSize - 25);
    this.fontSizeAnnouncement = this.translate.instant('a11y.fontSizeDecreased', { size: this.fontSize });

    setTimeout(() => {
      this.fontSizeAnnouncement = '';
    }, 1000);
  }

  resetFontSize() {
    this.fontSizeService.resetFontSize();
    this.fontSizeAnnouncement = this.translate.instant('a11y.fontSizeReset', { size: this.fontSize });

    setTimeout(() => {
      this.fontSizeAnnouncement = '';
    }, 1000);
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

  get linkHighlightAnnouncement(): string {
    return this.linkHighlightService.announcement;
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
