import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

type Theme = 'light' | 'dark' | 'creamy' | 'blind-color';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme: Theme = 'light'; // Default theme
  private themes = {
    light: 'light-theme',
    dark: 'dark-theme',
    creamy: 'creamy-theme',
    'blind-color': 'blind-color-theme',
  };

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.setTheme(this.currentTheme); // Apply default theme
  }

  setTheme(theme: Theme): void {
    // Remove the current theme class
    this.renderer.removeClass(document.body, this.themes[this.currentTheme]);

    // Apply the new theme
    this.currentTheme = theme;
    this.renderer.addClass(document.body, this.themes[theme]);
  }

  toggleTheme(): void {
    const themeOrder: Theme[] = ['light', 'dark', 'creamy', 'blind-color'];
    const nextThemeIndex =
      (themeOrder.indexOf(this.currentTheme) + 1) % themeOrder.length;
    this.setTheme(themeOrder[nextThemeIndex]);
  }

  getCurrentTheme(): Theme {
    return this.currentTheme;
  }
}
