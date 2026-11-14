import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  imports: [CommonModule, RouterLink, RouterLinkActive],
  selector: 'app-sidebar',
  styleUrl: './sidebar.scss',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  private router = inject(Router);
  private authService = inject(AuthService);

  userId = this.authService.getUserId();
  navItems = this.authService.getNavigationItems();

  navigate(page: string) {
    // التوجيه الديناميكي مع تمرير معرف المستخدم إذا لزم
    this.router.navigate([page], { queryParams: { user: this.userId } });
    this.close.emit();
  }

  closeSidebar() {
    this.close.emit();
  }

  logout() {
    this.authService.logout();
  }
}
