// src/app/services/auth.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   private readonly _http = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _jwtHelper = new JwtHelperService();

  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'token';

  login(request: any) {
    return this._http
      .post<{ token: string }>(`${this.apiUrl}/api/Auth/login`, request)
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, res.token);
          this._router.navigate(['/dashboard']);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this._jwtHelper.isTokenExpired(token);
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;
    return this._jwtHelper.decodeToken(token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.clear();
    this._router.navigate(['/login']);
  }

  getUsername(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.username || null;
  }

  getRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.role || null;
  }
}
