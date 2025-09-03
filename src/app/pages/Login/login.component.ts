import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
username = '';
  password = '';

  constructor(private _authService: AuthService,private _toast: ToastService) {}

  login() {
   this._authService.login(this.username, this.password).subscribe({
    next: () => this._toast.show('Login successful!'),
    error: () => this._toast.show('Login failed. Please check your credentials.', {
      classname: 'bg-danger text-light',
      delay: 5000
    })
  });
  }
}
