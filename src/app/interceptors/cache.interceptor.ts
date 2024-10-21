import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UserPaginationResponse, UserDetailsResponse } from '../models/remote/responses/user-responses';
import { CachingService } from '../services/caching.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private cachingService: CachingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const url = new URL(req.url);

    if (url.pathname.includes('/users') && url.searchParams.has('page')) {
      const page = +url.searchParams.get('page')!;
      const cachedUsers = this.cachingService.getCachedUsersByPage(page);
      if (cachedUsers.users) {
        // If cached, return Observable of cached response
        const cachedResponse: HttpEvent<any> = {
          body: { data: cachedUsers.users, total_pages: cachedUsers.totalPages } as UserPaginationResponse
        } as HttpEvent<any>;
        return of(cachedResponse);
      }
    }

    if (url.pathname.includes('/users/') && !url.searchParams.has('page')) {
      const userId = url.pathname.split('/').pop();
      const cachedUser = this.cachingService.getCachedUserById(userId!);
      if (cachedUser) {
        // If cached, return Observable of cached response
        const cachedResponse: HttpEvent<any> = {
          body: { data: cachedUser } as UserDetailsResponse
        } as HttpEvent<any>;
        return of(cachedResponse);
      }
    }

    // If not cached, proceed with the request
    return next.handle(req);
  }
}
