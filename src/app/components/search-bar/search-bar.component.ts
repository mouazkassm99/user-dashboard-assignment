import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { debounceTime, distinctUntilChanged, Observable, of, Subject } from 'rxjs';
import { User } from '../../models/remote/entities/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import InternalRoutes from '../../constants/internal-routes';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ClickOutsideDirective],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  searchQuery: string = '';
  isWindowOpen: boolean = false;

  routes = InternalRoutes;

  loading: boolean = true;
  user: User | null = null;

  private searchSubject = new Subject<string>();

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    // Listen to the search input and debounce it
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((searchTerm: string) => {
      this.fetchUser(searchTerm);
    });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery);
  }

  openWindow(): void {
    this.isWindowOpen = true;
  }
  closeWindow(): void {
    this.isWindowOpen = false;
  }

  // Fetch the user from the service
  fetchUser(userId: string): void {
    const trimmedUserId = userId.trim();
    if (!trimmedUserId) {
      return;
    }
    this.loading = true;

    this.usersService.fetchUserById(trimmedUserId)
      .subscribe({
        next: (user) => {
          this.user = user;
          this.loading = false;
        },
        error: (error) => {
          this.user = null;
          this.loading = false;
        }
      });
  }

}
