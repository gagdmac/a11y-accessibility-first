import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LinkHighlightService {
  private renderer: Renderer2;
  private highlightedElements: Element[] = []; // Changed from HTMLAnchorElement[] to Element[]
  private highlightColor = 'yellow';
  private isHighlightActive = false;
  isHighlightActive$: any;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    // Check localStorage for saved state
    this.isHighlightActive = localStorage.getItem('highlightLinks') === 'true';
    if (this.isHighlightActive) {
      this.highlightLinks();
    }
  }

  get highlightedLinksCount() {
    return this.highlightedElements.length;
  }

  toggleLinkHighlight(): string {
    this.isHighlightActive = !this.isHighlightActive;
    localStorage.setItem('highlightLinks', this.isHighlightActive.toString());

    if (this.isHighlightActive) {
      this.highlightLinks();
      return 'a11y.removeHighlights';
    } else {
      this.removeHighlights();
      return 'a11y.highlightLinks';
    }
  }

  refreshHighlights() {
    if (this.isHighlightActive) {
      this.removeHighlights();
      this.highlightLinks();
    }
  }

  private highlightLinks() {
    const elements = this.document.querySelectorAll(
      'a:not(.no-highlight), [routerLink]:not(.no-highlight)'
    );
    elements.forEach((element) => {
      if (!element.classList.contains('highlight-active')) {
        this.renderer.setStyle(
          element,
          'background-color',
          this.highlightColor
        );
        this.renderer.setStyle(element, 'color', '#222222');
        this.renderer.addClass(element, 'highlight-active');
        this.highlightedElements.push(element);
      }
    });
  }

  private removeHighlights() {
    this.highlightedElements.forEach((element) => {
      this.renderer.removeStyle(element, 'background-color');
      this.renderer.removeStyle(element, 'color');
      this.renderer.removeClass(element, 'highlight-active');
    });
    this.highlightedElements = [];
  }
}
