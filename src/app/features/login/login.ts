import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../core/services/api.service';
import { SpinnerService } from '../../core/services/spinner.service';

@Component({
  imports: [CommonModule, FormsModule, ButtonModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private spinner = inject(SpinnerService);
  private api = inject(ApiService);
  private router = inject(Router);

  farqaniId = '';
  isLoading = false;

  async submitLogin() {
    const idValue = this.farqaniId.trim();
    if (!idValue) return;

    this.spinner.show();
    this.isLoading = true;

    this.api.getPasswords().subscribe({
      next: async (pas: any) => {
        try {
          if (idValue === pas[0]) {
            localStorage.setItem("adminPasswF", idValue);
            this.router.navigate(['/admin-dashboard']);
            return;
          }

          // if (idValue.includes('Fu') || idValue.includes('Fl') || idValue.includes('Ft')) {
            
          //   this.api.getTeacherById(idValue).subscribe((teacher: any) => {
          //     if (teacher) {
          //       localStorage.setItem("user_role", "teacher");
          //       localStorage.setItem("USER_ID", teacher.id);
          //       localStorage.setItem("USER_NAME", teacher.name);
          //       localStorage.setItem("USER_CATEGORY", teacher.category);
          //       // this.router.navigate(['/teacher/dashboard'], { queryParams: { id: idValue } });
          //       this.router.navigate(['/teacher/daily-harvest'], { queryParams: { id: idValue } });
          //     } else {
          //       this.router.navigate(['/student-dashboard'], { queryParams: { id: idValue } });
          //     }
          //   });
          // } else {
          //   this.router.navigate(['/student-dashboard'], { queryParams: { id: idValue } });
          // }

          this.api.getUserDataById(idValue).subscribe((user: any) => {
            if (user.role === 'مساعدة' && user.sharedWith === 'معسكر همة - مساعدات') {
              localStorage.setItem("user_role", "teacher");
              localStorage.setItem("USER_ID", user.id);
              localStorage.setItem("USER_NAME", user.name);
              localStorage.setItem("USER_CATEGORY", user.category);
              // this.router.navigate(['/teacher/dashboard'], { queryParams: { id: idValue } });
              this.router.navigate(['/teacher/daily-harvest'], { queryParams: { id: idValue } });
            } else if (user.role === 'مغتربة' && user.sharedWith === 'معسكر همة - مغتربات') {
              localStorage.setItem("user_role", "expStn");
              localStorage.setItem("USER_ID", user.id);
              localStorage.setItem("USER_NAME", user.name);
              localStorage.setItem("USER_CATEGORY", user.category);
              // this.router.navigate(['/teacher/dashboard'], { queryParams: { id: idValue } });
              this.router.navigate(['/expStn/daily-harvest'], { queryParams: { id: idValue } });
            } else if ((user.role === 'ثانوي' || user.role === 'إعدادي') && user.sharedWith === 'معسكر همة - يافعات') {
              localStorage.setItem("user_role", "yStn");
              localStorage.setItem("USER_ID", user.id);
              localStorage.setItem("USER_NAME", user.name);
              localStorage.setItem("USER_CATEGORY", user.category);
              // this.router.navigate(['/teacher/dashboard'], { queryParams: { id: idValue } });
              this.router.navigate(['/youngStn/yDaily-harvest'], { queryParams: { id: idValue } });
            } else if (user.role === 'جامعية' && user.sharedWith === 'معسكر') {
              localStorage.setItem("user_role", "uStn");
              localStorage.setItem("USER_ID", user.id);
              localStorage.setItem("USER_NAME", user.name);
              localStorage.setItem("USER_CATEGORY", user.category);
              // this.router.navigate(['/teacher/dashboard'], { queryParams: { id: idValue } });
              this.router.navigate(['/ustn/daily-harvest'], { queryParams: { id: idValue } });
            } else {
              this.router.navigate(['/student-dashboard'], { queryParams: { id: idValue } });
            }
          });
        } catch (e) {
          console.error(e);
        } finally {
          // this.spinner.hide();
          this.isLoading = false;
        }
      },
      error: () => {
        this.spinner.hide();
        this.isLoading = false;
        alert('حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.');
      }
    });
  }
}
