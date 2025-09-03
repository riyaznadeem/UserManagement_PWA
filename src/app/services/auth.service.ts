// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/api/Auth/login`, { username, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        const decoded = this.jwtHelper.decodeToken(res.token);
        console.log('Decoded token:', decoded);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  getDecodedToken(): any {
  const token = this.getToken();
  if (!token) return null;
  return this.jwtHelper.decodeToken(token);
}
}
