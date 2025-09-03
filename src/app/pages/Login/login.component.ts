import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly _authService = inject(AuthService);
  private readonly _toast = inject(ToastService);
  private readonly _formBuilder = inject(FormBuilder);

  readonly loginForm: FormGroup = this._formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this._authService.login(this.loginForm.value).subscribe({
      next: () => this._toast.show('Login successful!'),
      error: () =>
        this._toast.show('❌ Login failed. Please check your credentials.', {
          classname: 'bg-danger text-light',
          delay: 5000,
        }),
    });
  }
}
