import { Routes } from '@angular/router';
import { LoginComponent } from './pages/Login/login.component';
import { DashboardComponent } from './pages/Dashboard/dashboard.component';
import { authGuard } from './pages/guards/auth.guard';
import { UserManagementComponent } from './pages/user-management/user-management.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
   { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'usermanagement', component: UserManagementComponent, canActivate: [authGuard] },
];
