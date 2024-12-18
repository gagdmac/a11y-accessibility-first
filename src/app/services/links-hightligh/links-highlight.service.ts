import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LinkHighlightService {
  private renderer: Renderer2;
  private highlightedLinks: HTMLAnchorElement[] = [];
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
    return this.highlightedLinks.length;
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
    const links = this.document.querySelectorAll('a');
    links.forEach((link) => {
      const linkElement = link as HTMLAnchorElement;
      this.renderer.setStyle(
        linkElement,
        'background-color',
        this.highlightColor
      );
      this.renderer.setStyle(linkElement, 'color', '#222222');
      this.highlightedLinks.push(linkElement);
    });
  }

  private removeHighlights() {
    this.highlightedLinks.forEach((link) => {
      this.renderer.setStyle(link, 'background-color', 'transparent');
      this.renderer.setStyle(link, 'color', '');
    });
    this.highlightedLinks = [];
  }
}
