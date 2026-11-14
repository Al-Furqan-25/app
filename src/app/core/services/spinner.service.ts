import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private loading = signal<boolean>(false);
  readonly isLoading = this.loading.asReadonly();

  show() {
    this.loading.set(true);
  }

  hide() {
    this.loading.set(false);
  }
}