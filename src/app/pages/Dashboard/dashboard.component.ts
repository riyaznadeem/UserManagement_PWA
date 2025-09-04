import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { LanguageService } from '../../services/language.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  username: string = '';
  private readonly _authService = inject(AuthService);
  private readonly _userService = inject(UserService);
  private readonly _router = inject(Router);
  private readonly _toast = inject(ToastService);
  private readonly language = inject(LanguageService);
  public getRole = localStorage.getItem('role');
  public dashboardCount: any;

  constructor() {
    const decoded = this._authService.getDecodedToken();
    this.username = decoded?.DisplayName || 'Unknown';
  }

  ngOnInit() {
    this._userService.getDashboard().subscribe((res) => {
      this.dashboardCount = res;
    });
  }

  logout() {
    localStorage.removeItem('token');
    this._toast.show('You have been logged out.', {
      classname: 'bg-warning text-dark',
    });
    this._router.navigate(['/']);
  }

  get t() {
    return this.language.translate.bind(this.language);
  }
}
