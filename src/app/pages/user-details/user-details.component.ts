import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/remote/entities/user';
import { CommonModule } from '@angular/common';
import InternalRoutes from '../../constants/internal-routes';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {


  loading: boolean = false;
  user: User | null = null;

  routes = InternalRoutes;

  constructor(private route: ActivatedRoute, private usersService: UsersService) {
  }

  ngOnInit(): void {
    const extractedId = this.route.snapshot.paramMap.get('id');

    if (!extractedId) {
      throw new Error('No id was provided');
    }
    this.loadUserData(extractedId);
  }

  loadUserData(userId: string): void {

    this.loading = true;

    this.usersService.fetchUserById(userId)
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
