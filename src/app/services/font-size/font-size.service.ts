import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FontSizeService {
  private baseFontSize = 100; // 100% of base font size
  private fontSize = this.baseFontSize;
  private minFontSize = 75; // 75% of base font size
  private maxFontSize = 200; // 150% of base font size
  private renderer: Renderer2;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  setFontSize(size: number) {
    // Ensure the font size is within the min/max range
    this.fontSize = Math.max(
      this.minFontSize,
      Math.min(this.maxFontSize, size)
    );
    this.applyFontSize();
  }

  resetFontSize() {
    this.fontSize = this.baseFontSize;
    this.applyFontSize();
  }

  getFontSize() {
    return this.fontSize;
  }

  getMinFontSize() {
    return this.minFontSize;
  }

  getMaxFontSize() {
    return this.maxFontSize;
  }

  private applyFontSize() {
    this.renderer.setStyle(
      document.documentElement,
      'font-size',
      `${this.fontSize}%`
    );
  }
}
