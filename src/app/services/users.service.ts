import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UserDetailsResponse, UserPaginationResponse } from '../models/remote/responses/user-responses';
import { User } from '../models/remote/entities/user';
import RemoteUrls from '../constants/remote-urls';
import { CachingService } from './caching.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private cachingService: CachingService) { }

  fetchUsers(page: number): Observable<User[]> {

    const cachedUsers = this.cachingService.getCachedUsersByPage(page);
    if (cachedUsers) {
      return of(cachedUsers); // Return cached data as an Observable
    }

    const url = new URL(RemoteUrls.users);
    url.searchParams.set('page', page.toString());

    return this.http.get<UserPaginationResponse>(url.toString()).pipe(
      map(response => response.data),
      tap(users => this.cachingService.cacheUsersByPage(page, users))
    );
  }

  fetchUserById(userId: string): Observable<User | null> {

    const cachedUser = this.cachingService.getCachedUserById(userId);
    if (cachedUser) {
      return of(cachedUser); // Return cached data as an Observable
    }

    // If not cached, make an API request
    const url = new URL(RemoteUrls.userByIdFn(userId));

    return this.http.get<UserDetailsResponse>(url.toString()).pipe(
      map(response => response.data),
      tap(user => {
        if (user) {
          this.cachingService.cacheUserById(userId, user);
        }
      }),
      catchError(error => {
        if (error.status === 404) {
          console.error("User not found (404)", error);
          return of(null);
        } else {
          console.error("An error occurred", error);
          return throwError(() => error);
        }
      })
    );
  }
}
