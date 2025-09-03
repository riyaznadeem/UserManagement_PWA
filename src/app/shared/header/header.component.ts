import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
 private readonly _authService = inject(AuthService);

  username: string = 'Guest';

  constructor() {
    const decoded = this._authService.getDecodedToken();

    if (decoded) {
      this.username = decoded.displayName || decoded.username || 'Guest';

      const roleClaim =
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const role = decoded[roleClaim];

      if (role) {
        localStorage.setItem('role', role);
      }
    }
  }

  logout() {
    this._authService.logout();
  }
}
