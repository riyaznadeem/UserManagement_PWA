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
  public getRole! :any;
  public dashboardCount: any;

  constructor() {
    const decoded = this._authService.getDecodedToken();
    this.username = decoded?.DisplayName || 'Unknown';
  }

  ngOnInit() {
    this._userService.getDashboard().subscribe((res) => {
      this.dashboardCount = res;
    });
     this.getRole = localStorage.getItem('role');
  }

  logout() {
   this._authService.logout();
  }

  get translate() {
    return this.language.translate.bind(this.language);
  }
}
