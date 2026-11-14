import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../../shared/components/header/header';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { FooterTabs } from '../../../shared/components/footer-tabs/footer-tabs';

@Component({
  imports: [CommonModule, RouterOutlet, Header, Sidebar, FooterTabs],
  selector: 'app-main-layout',
  styleUrl: './main-layout.scss',
  templateUrl: './main-layout.html',
})
export class MainLayout {
  isSidebarOpen = false;
  currentTitle = 'لوحة التحكم';

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
