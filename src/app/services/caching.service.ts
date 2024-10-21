import { Injectable } from '@angular/core';
import { User } from '../models/remote/entities/user';
import { UsersPaginatedListWithInfo } from '../models/local/users-paginated-list-with-info';

@Injectable({
  providedIn: 'root'
})
export class CachingService {

  private usersByPage: { [page: number]: User[] } = {};
  private userById: { [id: string]: User } = {};
  private totalPages: number = 0;

  cacheUsersByPage(page: number, users: User[], totalPages: number): void {
    this.usersByPage[page] = users;
    this.totalPages = totalPages;
  }

  getCachedUsersByPage(page: number): UsersPaginatedListWithInfo {
    return {
      users: this.usersByPage[page] || null,
      totalPages: this.totalPages,
    };
  }

  cacheUserById(userId: string, user: User): void {
    this.userById[userId] = user;
  }

  getCachedUserById(userId: string): User | null {
    return this.userById[userId] || null;
  }

  clearCache(): void {
    this.usersByPage = {};
    this.userById = {};
  }
}
