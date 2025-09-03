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
import { LanguageService } from '../../services/language.service';

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
  readonly _languageService = inject(LanguageService);

  readonly loginForm: FormGroup = this._formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = false;

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this._authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this._toast.show(this._languageService.translate('login.success'));
      },
      error: () => {
        this.isLoading = false;
        this._toast.show(this._languageService.translate('login.failed'), {
          classname: 'bg-danger text-light',
          delay: 5000,
        });
      },
    });
  }

  toggleLanguage() {
    this._languageService.toggleLanguage();
  }

  t(key: string): string {
    return this._languageService.translate(key);
  }
}
