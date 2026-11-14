import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  imports: [CommonModule, ButtonModule],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  private authService = inject(AuthService);
  private router = inject(Router);
  private api = inject(ApiService);
  private sanitizer = inject(DomSanitizer);

  isPdfOpen = false;
  isLoadingPdf = false;
  pdfTitle = 'جاري تحميل الملف...';
  safePdfUrl: SafeResourceUrl = '';
  pdfDownloadUrl = '';

  userRole = this.authService.getUserRole();
  userId = this.authService.getUserId();

  goToLogin() {
    if (this.userRole === 'teacher') {
      // this.router.navigate(['/teacher/dashboard'], { queryParams: { user: this.userId } });
      this.router.navigate(['/teacher/daily-harvest'], { queryParams: { user: this.userId } });
    } else if (this.userRole === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  openPdfViewer() {
    this.isPdfOpen = true;
    this.isLoadingPdf = true;
    this.api.getPdfDetails().subscribe({
      next: (res: any) => {
        this.isLoadingPdf = false;
        if (res.success) {
          this.pdfTitle = res.title;
          this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.embedUrl);
          this.pdfDownloadUrl = res.downloadUrl;
        } else {
          this.pdfTitle = 'خطأ في تحميل الملف';
        }
      },
      error: () => {
        this.isLoadingPdf = false;
        this.pdfTitle = 'تعذر الاتصال بالخادم';
      },
    });
  }

  closePdfViewer() {
    this.isPdfOpen = false;
    this.safePdfUrl = '';
  }
}
