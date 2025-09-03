import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: { text: string, classname: string, delay?: number }[] = [];

  show(text: string, options: { classname: string, delay?: number } = { classname: 'bg-success text-light', delay: 3000 }) {
    this.toasts.push({ ...options, text });
    setTimeout(() => this.remove(this.toasts[0]), options.delay || 3000);
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  clear() {
    this.toasts = [];
  }
}
