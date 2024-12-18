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

  constructor(private translate: TranslateService) {
    // Verify connection on service initialization
    console.log('Contentful client initialized with:', {
      space: environment.contentful.spaceId,
      accessToken: environment.contentful.accessToken.substring(0, 5) + '...',
    });
  }

  setLocale(lang: string) {
    this.currentLocale = lang === 'es' ? 'es-ES' : 'en-US'; // Changed 'es' to 'es-ES'
    console.log('Contentful locale set to:', this.currentLocale);
  }

  private translateField(field: any): Observable<any> {
    console.log('translateField received:', field);
    if (typeof field === 'string' && field.startsWith('TRANSLATE.')) {
      console.log('Attempting to translate:', field);
      return this.translate
        .get(field)
        .pipe(tap((result) => console.log('Translation result:', result)));
    }
    return from(Promise.resolve(field));
  }

  private translateContent(content: any): Observable<any> {
    console.log('translateContent received:', content);

    if (!content) return from(Promise.resolve(content));

    // Handle Contentful Entry structure
    if (content.sys && content.fields) {
      console.log('Processing Contentful entry:', content.fields);
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
    console.log('Getting entries with locale:', this.currentLocale);
    const queryWithLocale = {
      ...query,
      locale: this.currentLocale,
    };

    return from(this.client.getEntries(queryWithLocale)).pipe(
      tap((response) => {
        console.log(
          'Contentful response with locale:',
          this.currentLocale,
          response
        );
      }),
      catchError((error) => {
        console.error('Contentful error:', error);
        return throwError(() => error);
      })
    );
  }

  getEntry(entryId: string): Observable<Entry<any>> {
    const locale = this.translate.currentLang === 'es' ? 'es-ES' : 'en-US'; // Changed 'es' to 'es-ES'

    return from(this.client.getEntry(entryId, { locale })).pipe(
      catchError((error) => {
        console.error('Contentful error:', error);
        return throwError(() => error);
      })
    );
  }
}
