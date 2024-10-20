import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent {

  id: string;

  constructor(private route: ActivatedRoute) {
    this.id = '';
  }

  ngOnInit(): void {
    const extractedId = this.route.snapshot.paramMap.get('id');

    if (!extractedId) {
      throw new Error('No id was provided');
    }
    this.id = extractedId;
  }

}
