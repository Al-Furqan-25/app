import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderService } from '../../../core/services/header.service';

@Component({
  imports: [CommonModule],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  @Input() pageTitle: string = 'الرئيسية';
  @Output() onToggleSidebar = new EventEmitter<void>();

  headerService = inject(HeaderService);

  toggleSidebar() {
    this.onToggleSidebar.emit();
  }
}
