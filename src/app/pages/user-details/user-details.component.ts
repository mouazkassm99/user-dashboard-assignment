import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { Observable } from 'rxjs';
import { User } from '../../models/remote/entities/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {

  id: string;
  user$!: Observable<User | null>;
  loading$!: Observable<boolean>;

  constructor(private route: ActivatedRoute, private usersService: UsersService) {
    this.id = '';
  }

  ngOnInit(): void {
    const extractedId = this.route.snapshot.paramMap.get('id');

    if (!extractedId) {
      throw new Error('No id was provided');
    }
    this.id = extractedId;
    this.loadUserData(this.id);

    this.user$ = this.usersService.userById$;
    this.loading$ = this.usersService.loading$;
  }

  loadUserData(userId: string): void {
    this.usersService.fetchUserById(userId);
  }

  ngOnDestroy(): void {

  }

}
