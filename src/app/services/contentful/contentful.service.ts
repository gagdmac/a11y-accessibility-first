import { Injectable } from '@angular/core';
import { createClient, Entry, EntryCollection } from 'contentful';
import { from, Observable, throwError } from 'rxjs';
import { tap, catchError, switchMap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

export interface Breadcrumb {
  label: string;
  url: string;
  isActive: boolean;
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

  async getBreadcrumbs(currentPath: string): Promise<Breadcrumb[]> {
    const paths = currentPath.split('/').filter((p) => p);
    const breadcrumbs: Breadcrumb[] = [];

    try {
      // Add home
      breadcrumbs.push({
        label: await this.translate.get('nav.home').toPromise(),
        url: '/',
        isActive: paths.length === 0,
      });

      // Build path progressively and add intermediate breadcrumbs
      let currentUrl = '';
      for (let i = 0; i < paths.length; i++) {
        currentUrl += `/${paths[i]}`;
        const isLast = i === paths.length - 1;

        // Try to get page from Contentful
        const entry = await this.client.getEntries({
          content_type: 'page',
          'fields.slug': paths[i],
          locale: this.currentLocale,
          include: 1,
        });

        let label = '';
        if (
          entry.items.length > 0 &&
          typeof entry.items[0].fields['title'] === 'string'
        ) {
          label = entry.items[0].fields['title'];
        } else {
          // Fallback to formatted path segment
          label = paths[i]
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }

        breadcrumbs.push({
          label,
          url: currentUrl,
          isActive: isLast,
        });
      }
    } catch (error) {
      console.error('Error generating breadcrumbs:', error);
      // Fallback breadcrumbs
      breadcrumbs.length = 0; // Clear array
      breadcrumbs.push(
        {
          label: 'Home',
          url: '/',
          isActive: false,
        },
        {
          label: 'Accessibility Today',
          url: currentPath,
          isActive: true,
        }
      );
    }

    return breadcrumbs;
  }

  constructor(private translate: TranslateService) {}

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

  getEntries(query?: object): Observable<EntryCollection<any>> {
    const queryWithLocale = {
      ...query,
      locale: this.currentLocale,
    };

    return from(this.client.getEntries(queryWithLocale)).pipe(
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
}
