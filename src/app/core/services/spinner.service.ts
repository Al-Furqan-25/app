import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  // استخدام Signals (الطريقة الحديثة في Angular) لإدارة حالة التحميل
  private loading = signal<boolean>(false);
  readonly isLoading = this.loading.asReadonly();

  // إظهار شاشة التحميل
  show() {
    this.loading.set(true);
  }

  // إخفاء شاشة التحميل
  hide() {
    this.loading.set(false);
  }
}