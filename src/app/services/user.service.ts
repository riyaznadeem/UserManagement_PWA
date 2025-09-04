import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 private readonly _http = inject(HttpClient);
  private readonly _baseUrl = `${environment.apiUrl}/api/Users`;

  getUserList(request: any) {
    return this._http.post<any>(`${this._baseUrl}/GetUserList`, request);
  }

    getRoleList() {
    return this._http.get<any>(`${environment.apiUrl}/api/Role/GetRoleLookup`);
  }

   createUser(user: any) {
    return this._http.post(`${this._baseUrl}`, user);
  }

  updateUser(user: any) {
    return this._http.post(`${this._baseUrl}/Update/${user.id}`, user);
  }

  updateOwn(user: any) {
    return this._http.post(`${this._baseUrl}/me`, user);
  }

  deleteUser(id: string) {
    return this._http.delete(`${this._baseUrl}/Delete/${id}`);
  }

    getDashboard() {
    return this._http.get<any>(`${environment.apiUrl}/api/Dashboard/GetDashboard`);
  }
}
