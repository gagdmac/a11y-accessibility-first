import { Injectable } from '@angular/core';
import { createClient, Entry, EntryCollection } from 'contentful';
import { from, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContentfulService {
  private client = createClient({
    space: environment.contentful.spaceId,
    accessToken: environment.contentful.accessToken,
  });

  constructor() {
    // Verify connection on service initialization
    console.log('Contentful client initialized with:', {
      space: environment.contentful.spaceId,
      accessToken: environment.contentful.accessToken.substring(0, 5) + '...',
    });
  }

  getEntries(query?: object): Observable<EntryCollection<any>> {
    const promise = this.client.getEntries(query);
    // console.log('Fetching entries with query:', query);
    return from(promise).pipe(
      tap((response) => console.log('Contentful response:', response)),
      catchError((error) => {
        console.error('Contentful error:', error);
        return throwError(() => error);
      })
    );
  }

  getEntry(entryId: string): Observable<Entry<any>> {
    const promise = this.client.getEntry(entryId);
    // console.log('Fetching entry:', entryId);
    return from(promise).pipe(
      tap((response) => console.log('Contentful entry response:', response)),
      catchError((error) => {
        console.error('Contentful error:', error);
        return throwError(() => error);
      })
    );
  }
}
