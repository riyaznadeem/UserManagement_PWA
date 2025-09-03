import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
username: string = 'Guest';

  constructor(private _authService: AuthService, private _router: Router) {
    const decoded = this._authService.getDecodedToken();
    this.username = decoded?.DisplayName || 'Guest';
  }

  logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/']);
  }
}
