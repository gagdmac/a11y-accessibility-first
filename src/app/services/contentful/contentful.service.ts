import { Injectable } from '@angular/core';
import {
  createClient,
  Entry,
  EntryCollection,
  EntrySkeletonType,
} from 'contentful';
import { from, Observable, throwError } from 'rxjs';
import { tap, catchError, switchMap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Document } from '@contentful/rich-text-types'; // Add this import

export interface Breadcrumb {
  label: string;
  url: string;
  isActive: boolean;
}

// Update the BlogPost interface to reflect the correct content type
export interface BlogPost extends EntrySkeletonType {
  fields: {
    title: string;
    urlHandle: string;
    description: Document; // Change type to Document
    content: Document; // Change type to Document
    featuredImage?: {
      fields: {
        title: string;
        file: {
          url: string;
          contentType: string;
        };
      };
    };
  };
  sys: {
    id: string;
    createdAt: string;
  };
  contentTypeId: 'blogPost';
}

@Injectable({
  providedIn: 'root',
})
export class ContentfulService {
  private client = createClient({
    space: environment.contentful.spaceId,
    accessToken: environment.contentful.accessToken,
  });

  private currentLocale = 'en-US';

  // Add RSS cache
  private rssCache: {
    content: string;
    timestamp: number;
  } | null = null;

  private readonly CACHE_DURATION = 1800000; // 30 minutes

  constructor(
    private translate: TranslateService,
    private router: Router,
    private location: Location
  ) {}

  // Update the sanitizeXmlContent method to handle non-string inputs
  private sanitizeXmlContent(content: any): string {
    if (!content) return '';
    // Convert to string if it's not already
    const stringContent = String(content);
    return stringContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private createXmlFeed(posts: any[]): string {
    const items = posts
      .map(
        (post) => `
      <item>
        <title>${this.sanitizeXmlContent(post.fields.title)}</title>
        <link>${environment.siteUrl}/accessibility-today/blog/${
          post.fields.urlHandle
        }</link>
        <guid>${post.sys.id}</guid>
        <pubDate>${new Date(post.sys.createdAt).toUTCString()}</pubDate>
        <description>${this.sanitizeXmlContent(
          documentToHtmlString(post.fields.description)
        )}</description>
        <content:encoded><![CDATA[${documentToHtmlString(
          post.fields.content
        )}]]></content:encoded>
        <author>${environment.siteAuthor?.email} (${
          environment.siteAuthor?.name
        })</author>
      </item>
    `
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${environment.siteName}</title>
    <link>${environment.siteUrl}/accessibility-today</link>
    <description>${environment.siteDescription}</description>
    <language>${this.currentLocale.split('-')[0]}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Custom RSS Generator</generator>
    ${items}
  </channel>
</rss>`;
  }

  async generateRssFeed(): Promise<string> {
    try {
      console.log('Fetching entries from Contentful...');
      const response = await this.client.getEntries<BlogPost>({
        content_type: 'blogPost',
        order: ['-sys.createdAt'],
        limit: 10,
        include: 2,
      });

      if (!response.items?.length) {
        console.log('No blog posts found');
        return this.createXmlFeed([]);
      }

      return this.createXmlFeed(response.items);
    } catch (error) {
      console.error('Error generating RSS feed:', error);
      throw error;
    }
  }

  // Add cached RSS feed getter
  async getRssFeed(): Promise<string> {
    if (
      this.rssCache &&
      Date.now() - this.rssCache.timestamp < this.CACHE_DURATION
    ) {
      return this.rssCache.content;
    }

    const feed = await this.generateRssFeed();
    this.rssCache = {
      content: feed,
      timestamp: Date.now(),
    };
    return feed;
  }

  async getBreadcrumbs(currentPath: string): Promise<Breadcrumb[]> {
    const paths = currentPath.split('/').filter((p) => p);
    const breadcrumbs: Breadcrumb[] = [];

    try {
      // Add home
      breadcrumbs.push({
        label: 'menu.home',
        url: '/',
        isActive: paths.length === 0,
      });

      // Add route-based breadcrumbs
      if (paths.length > 0) {
        const route = paths[0];
        switch (route) {
          case 'accessibility-today':
            breadcrumbs.push({
              label: 'accessibility-today.title',
              url: '/accessibility-today',
              isActive: paths.length === 1,
            });
            break;
          // Add more cases as needed
          default:
            breadcrumbs.push({
              label: route
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
              url: `/${route}`,
              isActive: paths.length === 1,
            });
        }
      }
    } catch (error) {
      console.error('Error generating breadcrumbs:', error);
      breadcrumbs.length = 0;
      breadcrumbs.push({
        label: 'menu.home',
        url: '/',
        isActive: false,
      });
    }
    return breadcrumbs;
  }

  getBlogPostByHandle(urlHandle: string) {
    return this.client.getEntries({
      content_type: 'blogPost',
      'fields.urlHandle': urlHandle,
      locale: this.currentLocale,
      limit: 1,
    });
  }

  setLocale(lang: string) {
    this.currentLocale = lang === 'es' ? 'es-ES' : 'en-US'; // Changed 'es' to 'es-ES'
  }

  private translateField(field: any): Observable<any> {
    if (typeof field === 'string' && field.startsWith('TRANSLATE.')) {
      return this.translate
        .get(field)
        .pipe(tap((result) => console.log('Translation result:', result)));
    }
    return from(Promise.resolve(field));
  }

  private translateContent(content: any): Observable<any> {
    if (!content) return from(Promise.resolve(content));

    // Handle Contentful Entry structure
    if (content.sys && content.fields) {
      return from(
        Promise.all(
          Object.entries(content.fields).map(async ([key, value]) => ({
            key,
            value: await this.translateField(value).toPromise(),
          }))
        )
      ).pipe(
        map((entries) => ({
          ...content,
          fields: entries.reduce(
            (obj, { key, value }) => ({
              ...obj,
              [key]: value,
            }),
            {}
          ),
        })),
        tap((result) => console.log('Translated entry:', result))
      );
    }

    if (Array.isArray(content)) {
      return from(
        Promise.all(
          content.map((item) => this.translateContent(item).toPromise())
        )
      );
    }

    if (typeof content === 'object') {
      return from(
        Promise.all(
          Object.entries(content).map(async ([key, value]) => ({
            key,
            value: await this.translateContent(value).toPromise(),
          }))
        )
      ).pipe(
        map((entries) =>
          entries.reduce(
            (obj, { key, value }) => ({
              ...obj,
              [key]: value,
            }),
            {}
          )
        )
      );
    }

    return this.translateField(content);
  }

  // Update the getEntries method to be generic
  getEntries<T extends EntrySkeletonType>(
    query?: object
  ): Observable<EntryCollection<T>> {
    const queryWithLocale = {
      ...query,
      locale: this.currentLocale,
    };

    return from(this.client.getEntries<T>(queryWithLocale)).pipe(
      catchError((error) => {
        console.error('Contentful error:', error);
        return throwError(() => error);
      })
    );
  }

  getEntry<T>(
    entryId: string,
    locale: string = this.translate.currentLang
  ): Observable<T> {
    const contentfulLocale = locale === 'en' ? 'en-US' : 'es-ES';

    return from(
      this.client.getEntry(entryId, {
        locale: contentfulLocale,
        include: 10,
      })
    ).pipe(
      map((entry: any) => {
        if (!entry || !entry.fields) {
          throw new Error('Invalid entry structure received from Contentful');
        }
        return entry;
      }),
      catchError((error) => {
        return throwError(
          () => new Error(`Failed to fetch entry ${entryId}: ${error.message}`)
        );
      })
    );
  }

  updateBrowserUrl(newUrl: string, queryParams?: Record<string, string>) {
    let url = newUrl;
    if (queryParams) {
      const params = new URLSearchParams(queryParams).toString();
      url = `${newUrl}?${params}`;
    }
    window.history.pushState({}, '', url);
    // Optional: notify Angular about the URL change
    this.location.go(url);
  }
}
