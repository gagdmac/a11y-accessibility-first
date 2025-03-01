import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, delay } from 'rxjs/operators';
import { LoadingService } from '../services/loading/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Only show loader for blog-related requests
    if (
      request.url.includes('accessibility-today') ||
      request.url.includes('blog')
    ) {
      this.loadingService.show();
      return next.handle(request).pipe(
        delay(300), // Add small delay to avoid flickering
        finalize(() => this.loadingService.hide())
      );
    }
    return next.handle(request);
  }
}
