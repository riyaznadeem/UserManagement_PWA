import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  username: string = '';

  constructor(private _authService: AuthService, private _router: Router, private _toast: ToastService) {
    const decoded = this._authService.getDecodedToken();
    this.username = decoded?.DisplayName || 'Unknown';
  }

  logout() {
   localStorage.removeItem('token');
  this._toast.show('You have been logged out.', {
    classname: 'bg-warning text-dark'
  });
  this._router.navigate(['/']);
  }
}
