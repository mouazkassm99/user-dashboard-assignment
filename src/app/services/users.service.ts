import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { UserDetailsResponse, UserPaginationResponse } from '../models/remote/responses/user-responses';
import { User } from '../models/remote/entities/user';
import RemoteUrls from '../constants/remote-urls';
import { CachingService } from './caching.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.usersSubject.asObservable();

  private userByIdSubject = new BehaviorSubject<User | null>(null);
  userById$: Observable<User | null> = this.userByIdSubject.asObservable();

  private totalPages = new BehaviorSubject<number>(0);
  totalPages$: Observable<number> = this.totalPages.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private http: HttpClient, private cachingService: CachingService) { }


  fetchUsers(page: number): void {
    const cachedUsers = this.cachingService.getCachedUsersByPage(page);

    if (cachedUsers) {
      this.usersSubject.next(cachedUsers);
    } else {
      this.loadingSubject.next(true);
      const url = new URL(RemoteUrls.users);
      url.searchParams.set('page', page.toString());

      this.http.get<UserPaginationResponse>(url.toString())
        .pipe(
          tap(response => {
            this.cachingService.cacheUsersByPage(page, response.data);
            this.totalPages.next(response.total_pages);
            this.usersSubject.next(response.data);
            this.loadingSubject.next(false);
          })
        )
        .subscribe();
    }
  }

  fetchUserById(userId: string): void {
    const cachedUser = this.cachingService.getCachedUserById(userId);

    if (cachedUser) {
      this.userByIdSubject.next(cachedUser);
    } else {
      this.loadingSubject.next(true);
      const url = new URL(RemoteUrls.userByIdFn(userId));

      this.http.get<UserDetailsResponse>(url.toString())
        .pipe(
          tap(response => {
            this.cachingService.cacheUserById(userId, response.data);
            this.userByIdSubject.next(response.data);
            this.loadingSubject.next(false);
          }),
          catchError(error => {
            if (error.status === 404) {
              console.error("User not found (404)", error);
              this.userByIdSubject.next(null);
            } else {
              console.error("An error occurred", error);
            }
            this.loadingSubject.next(false);
            return throwError(() => error);
          })
        )
        .subscribe();
    }
  }
}
