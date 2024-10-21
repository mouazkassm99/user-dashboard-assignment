import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../../models/remote/entities/user';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import InternalRoutes from '../../constants/internal-routes';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  users: User[] = [];
  loading: boolean = false;
  totalPages: number = 0;

  currentPage: number = 1;

  routes = InternalRoutes;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.loadUsers(this.currentPage);
  }

  loadUsers(page: number): void {
    this.loading = true
    this.usersService.fetchUsers(page).subscribe({
      next: usersPaginatedListWithInfo => {
        this.users = usersPaginatedListWithInfo.users;
        this.totalPages = usersPaginatedListWithInfo.totalPages;
        this.loading = false;
      },
      error: error => {
        console.error('Error fetching users:', error);
        this.loading = false;
      },
    });
  }

  nextPage(): void {
    this.currentPage++;
    this.loadUsers(this.currentPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers(this.currentPage);
    }
  }

}
