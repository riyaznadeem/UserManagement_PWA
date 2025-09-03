import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './shared/toast/toast-container.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { HeaderComponent } from './shared/header/header.component';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
 selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NgIf, ToastContainerComponent,LoaderComponent,HeaderComponent],
  template: `
  <app-header *ngIf="showHeader"></app-header>
    <router-outlet>
    </router-outlet>
    <app-toast-container></app-toast-container>
    <app-loader></app-loader>
  `
})
export class AppComponent {
  title = 'user-management';
   showHeader: boolean = false;

  constructor(private _router: Router, private _authService: AuthService) {
    // Listen to route changes
    this._router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const publicRoutes = ['/', '/login'];
        const currentUrl = this._router.url;
        this.showHeader = !publicRoutes.includes(currentUrl);
      });
  }
}
