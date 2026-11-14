import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private titleSignal = signal<string>('');
  
  readonly title = this.titleSignal.asReadonly();

  setTitle(newTitle: string) {
    this.titleSignal.set(newTitle);
  }

  clearTitle() {
    this.titleSignal.set('');
  }
}