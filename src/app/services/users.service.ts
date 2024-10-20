import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { UserDetailsResponse, UserPaginationResponse } from '../models/remote/responses/user-responses';
import { User } from '../models/remote/entities/user';
import RemoteUrls from '../constants/remote-urls';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersByPage: { [page: number]: User[] } = {}; // Cache users by page
  private userById: { [id: string]: User } = {}; // Cache user by id

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.usersSubject.asObservable();

  private userByIdSubject = new BehaviorSubject<User | null>(null);
  userById$: Observable<User | null> = this.userByIdSubject.asObservable();

  private totalPages = new BehaviorSubject<number>(0);
  totalPages$: Observable<number> = this.totalPages.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {


  }

  fetchUsers(page: number): void {
    if (this.usersByPage[page]) {
      this.usersSubject.next(this.usersByPage[page]);
    } else {
      this.loadingSubject.next(true);

      const url = new URL(RemoteUrls.users);
      url.searchParams.set('page', page.toString());

      this.http.get<UserPaginationResponse>(url.toString())
        .pipe(
          tap(response => {

            this.usersByPage[page] = response.data;

            this.totalPages.next(response.total_pages);

            this.usersSubject.next(response.data);
            this.loadingSubject.next(false);
          })
        )
        .subscribe();
    }

  }

  fetchUserById(userId: string): void {
    if (this.userById[userId]) {
      this.userByIdSubject.next(this.userById[userId]);
    } else {
      this.loadingSubject.next(true);
      const url = new URL(RemoteUrls.userByIdFn(userId));

      this.http.get<UserDetailsResponse>(url.toString())
        .pipe(
          tap(response => {

            this.userById[userId] = response.data;

            this.userByIdSubject.next(response.data);
            this.loadingSubject.next(false); // Stop loading
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
