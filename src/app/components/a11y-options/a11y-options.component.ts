import { Component, OnInit } from '@angular/core';
import { FontSizeService } from 'src/app/services/font-size/font-size.service';
import { LinkHighlightService } from 'src/app/services/links-hightligh/links-highlight.service';
import { ThemeService } from 'src/app/services/themes-color/theme.service';

@Component({
  selector: 'app-a11y-options',
  templateUrl: './a11y-options.component.html',
  styleUrls: ['./a11y-options.component.scss'],
})
export class A11yOptionsComponent {
  //Default and reset font size
  // font_size = 16;

  ////////////////////////////
  //Font Size Increade Decrease
  ////////////////////////////

  constructor(
    private themeService: ThemeService,
    public fontSizeService: FontSizeService,
    public linkHighlightService: LinkHighlightService
  ) {}

  ngOnInit(): void {}

  get fontSize() {
    return this.fontSizeService.getFontSize();
  }

  increaseFontSize() {
    this.fontSizeService.setFontSize(this.fontSize + 5);
  }

  decreaseFontSize() {
    this.fontSizeService.setFontSize(this.fontSize - 5);
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
      ? 'Remove Highlights'
      : 'Highlight Links';
  }

  toggleLinkHighlight() {
    this.linkHighlightService.toggleLinkHighlight();
  }
}
