import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  imports: [CommonModule, RouterLink, RouterLinkActive],
  selector: 'app-footer-tabs',
  styleUrl: './footer-tabs.scss',
  templateUrl: './footer-tabs.html',
})
export class FooterTabs {
  private router = inject(Router);
  private authService = inject(AuthService);

  userId = this.authService.getUserId();
  footerItems = this.authService.getFooterItems();

  navigate(page: string) {
    this.router.navigate([page], { queryParams: { user: this.userId } });
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }
}
