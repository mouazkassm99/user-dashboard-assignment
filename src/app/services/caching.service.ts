import { Injectable } from '@angular/core';
import { User } from '../models/remote/entities/user';

@Injectable({
  providedIn: 'root'
})
export class CachingService {

  private usersByPage: { [page: number]: User[] } = {};
  private userById: { [id: string]: User } = {};

  cacheUsersByPage(page: number, users: User[]): void {
    this.usersByPage[page] = users;
  }

  getCachedUsersByPage(page: number): User[] | null {
    return this.usersByPage[page] || null;
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
