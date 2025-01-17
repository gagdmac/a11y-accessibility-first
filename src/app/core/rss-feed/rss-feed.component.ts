import { Component, OnInit } from '@angular/core';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-rss-feed',
  template: '<div [innerHTML]="feedContent"></div>',
})
export class RssFeedComponent implements OnInit {
  feedContent: SafeHtml = '';

  constructor(
    private contentfulService: ContentfulService,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    try {
      console.log('Fetching RSS feed...');
      const feed = await this.contentfulService.getRssFeed();
      console.log('Feed received, length:', feed?.length || 0);

      if (!feed) {
        throw new Error('Empty feed received');
      }

      // Set proper XML headers
      const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
      const fullFeed = xmlHeader + feed;

      // Create the response with proper content type
      document
        .getElementsByTagName('html')[0]
        .setAttribute('content-type', 'application/xml');
      document.getElementsByTagName('html')[0].setAttribute('charset', 'UTF-8');

      // Set the content
      this.feedContent = this.sanitizer.bypassSecurityTrustHtml(
        `<pre style="word-wrap: break-word; white-space: pre-wrap;">${fullFeed}</pre>`
      );
      console.log('Feed displayed successfully');
    } catch (error) {
      console.error('Detailed error in RSS component:', error);
      this.feedContent = this.sanitizer.bypassSecurityTrustHtml(
        `<pre>Error generating RSS feed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }</pre>`
      );
    }
  }
}
