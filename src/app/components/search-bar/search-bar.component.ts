import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
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

  user$!: Observable<User | null>;
  loading$!: Observable<boolean>;

  errorMessage: string = '';

  private searchSubject = new Subject<string>(); // Subject to handle the search input

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    // Listen to the search input and debounce it

    this.user$ = this.usersService.userById$;
    this.loading$ = this.usersService.loading$;

    this.searchSubject.pipe(
      debounceTime(500), // Wait for the user to stop typing for 500ms
      distinctUntilChanged() // Only trigger if the search term changes
    ).subscribe((searchTerm: string) => {
      this.fetchUser(searchTerm);
    });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery); // Send search input to the Subject
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
      this.errorMessage = 'Please enter a valid User ID';
      // this.user = null;
      return;
    }

    // Reset the states
    // this.user = null;
    // this.loading = true;
    // this.errorMessage = '';

    this.usersService.fetchUserById(trimmedUserId)
  }


}
