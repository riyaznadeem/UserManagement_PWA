import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './shared/toast/toast-container.component';
import { LoaderComponent } from './shared/loader/loader.component';

@Component({
 selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent,LoaderComponent],
  template: `
    <router-outlet></router-outlet>
    <app-toast-container></app-toast-container>
    <app-loader></app-loader>
  `
})
export class AppComponent {
  title = 'user-management';
}
