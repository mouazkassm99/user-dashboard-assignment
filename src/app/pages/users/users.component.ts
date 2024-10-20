import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../models/remote/entities/user';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import InternalRoutes from '../../constants/internal-routes';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  users$!: Observable<User[]>;
  loading$!: Observable<boolean>;
  totalPages$!: Observable<number>;
  currentPage: number = 1;

  routes = InternalRoutes;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.loadUsers(this.currentPage);
    this.users$ = this.usersService.users$;
    this.loading$ = this.usersService.loading$;
    this.totalPages$ = this.usersService.totalPages$;
  }

  loadUsers(page: number): void {
    this.usersService.fetchUsers(page);
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
