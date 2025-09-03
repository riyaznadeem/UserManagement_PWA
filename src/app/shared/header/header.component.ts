import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
 private readonly _authService = inject(AuthService);
  _languageService = inject(LanguageService);
  router = inject(Router);
  username: string = '';

  constructor() {
    const decoded = this._authService.getDecodedToken();

    if (decoded) {
      this.username = decoded.DisplayName ;

      const roleClaim =
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const role = decoded[roleClaim];

      if (role) {
        localStorage.setItem('role', role);
      }
    }
  }

   get user() {
    return this.username;
  }
  get initials(): string {
    return this.username
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
  logout() {
    this._authService.logout();
  }

    t(key: string): string {
    return this._languageService.translate(key);
  }

  toggleLanguage() {
    this._languageService.toggleLanguage();
  }
    get languageLabel() {
    return this._languageService.language.code === 'en' ? 'عربي' : 'EN';
  }
}
