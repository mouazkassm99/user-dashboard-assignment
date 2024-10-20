import InternalRoutes from './constants/internal-routes';

import { HomeComponent } from './pages/home/home.component';

import { UsersComponent } from './pages/users/users.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';



import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: InternalRoutes.homePage, component: HomeComponent },
    { path: InternalRoutes.usersPage, component: UsersComponent },
    { path: InternalRoutes.userDetailsPage, component: UserDetailsComponent },
];
