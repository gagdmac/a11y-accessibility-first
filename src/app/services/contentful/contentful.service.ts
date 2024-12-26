import { Injectable } from '@angular/core';
import { createClient, Entry, EntryCollection } from 'contentful';
import { from, Observable, throwError } from 'rxjs';
import { tap, catchError, switchMap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ContentfulService {
  private client = createClient({
    space: environment.contentful.spaceId,
    accessToken: environment.contentful.accessToken,
  });

  private currentLocale = 'en-US';

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

  getBlogPostByUrlHandle(urlHandle: string): Observable<any> {
    return from(
      this.client.getEntries({
        content_type: 'blogPost',
        'fields.urlHandle': urlHandle,
        locale: this.currentLocale,
        limit: 1,
      })
    ).pipe(
      map((response) => {
        if (!response.items || response.items.length === 0) {
          throw new Error(`Blog post with urlHandle ${urlHandle} not found`);
        }
        return response.items[0];
      }),
      catchError((error) => {
        console.error('Error fetching blog post:', error);
        return throwError(() => error);
      })
    );
  }
}
