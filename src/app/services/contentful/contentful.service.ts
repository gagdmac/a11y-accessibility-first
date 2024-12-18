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

  constructor(private translate: TranslateService) {
    // Verify connection on service initialization
    console.log('Contentful client initialized with:', {
      space: environment.contentful.spaceId,
      accessToken: environment.contentful.accessToken.substring(0, 5) + '...',
    });
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
    const promise = this.client.getEntries(query);
    return from(promise).pipe(
      switchMap((response) =>
        this.translateContent(response.items).pipe(
          map((translatedItems) => ({ ...response, items: translatedItems }))
        )
      ),
      catchError((error) => {
        console.error('Contentful error:', error);
        return throwError(() => error);
      })
    );
  }

  getEntry(entryId: string): Observable<Entry<any>> {
    const promise = this.client.getEntry(entryId);
    return from(promise).pipe(
      switchMap((response) => this.translateContent(response)),
      catchError((error) => {
        console.error('Contentful error:', error);
        return throwError(() => error);
      })
    );
  }
}
