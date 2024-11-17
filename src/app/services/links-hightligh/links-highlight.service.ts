import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LinkHighlightService {
  private renderer: Renderer2;
  private highlightedLinks: HTMLAnchorElement[] = [];
  private highlightColor = 'yellow';

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  get highlightedLinksCount() {
    return this.highlightedLinks.length;
  }

  toggleLinkHighlight(): string {
    if (this.highlightedLinksCount === 0) {
      this.highlightLinks();
      return 'a11y.removeHighlights';
    } else {
      this.removeHighlights();
      return 'a11y.highlightLinks';
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
      this.highlightedLinks.push(linkElement);
    });
  }

  private removeHighlights() {
    this.highlightedLinks.forEach((link) => {
      this.renderer.setStyle(link, 'background-color', 'transparent');
    });
    this.highlightedLinks = [];
  }
}
