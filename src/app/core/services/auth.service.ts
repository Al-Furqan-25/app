import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
class AuthService {
  // جلب معرف المستخدم من الـ localStorage
  getUserId(): string {
    return localStorage.getItem('USER_ID') || 'guest';
  }

  // جلب دور المستخدم أو صلاحياته لتغيير محتوى القوائم
  getUserRole(): string {
    return localStorage.getItem('user_role') || 'teacher';
  }

  getNavigationItems() {
    const role = this.getUserRole();

    if (role === 'admin') {
      return [
        { label: 'لوحة التحكم الإدارية', route: '/admin/dashboard', icon: 'bi bi-speedometer2' },
        { label: 'إدارة المستخدمين', route: '/admin/users', icon: 'bi bi-people' },
        { label: 'الطلبات والتدقيق', route: '/admin/tlabat', icon: 'bi bi-check-circle' }
      ];
    } else if (role === 'stn') {
      return [
        { label: 'الرئيسية (STN)', route: '/stn/dashboard', icon: 'bi bi-house-door' },
        { label: 'الدورات المسجلة', route: '/stn/courses', icon: 'bi bi-book' }
      ];
    } else if (role === 'teacher') {
      // الافتراضي: بوابة المعلم (Teacher Portal)
      return [
        // { label: 'الصفحة الرئيسية', route: '/teacher/dashboard', icon: 'bi bi-house-door' },
        { label: 'معسكر همة', route: '/teacher/daily-harvest', icon: 'bi bi-moon-stars' }
        // { label: 'علوم رديفة', route: '/teacher/subjects', icon: 'bi bi-journals' },
        // { label: 'الطلبات التطوعية', route: '/teacher/tlabat', icon: 'bi bi-send-check' },
        // { label: 'الدورات', route: '/teacher/courses', icon: 'fa-solid fa-book-open-reader' },
        // { label: 'الملفات', route: '/teacher/books', icon: 'bi bi-cloud-arrow-down' }
      ];
    } else {
       return [
        { label: 'الرئيسية (STN)', route: '/stn/dashboard', icon: 'bi bi-house-door' },
        { label: 'الدورات المسجلة', route: '/stn/courses', icon: 'bi bi-book' }
      ];
    }
  }

  getFooterItems() {
    const role = this.getUserRole();

    if (role === 'admin') {
      return [
        { label: 'الرئيسية', route: '/admin/dashboard', icon: 'bi-speedometer2' },
        { label: 'المستخدمين', route: '/admin/users', icon: 'bi-people' },
        { label: 'الطلبات', route: '/admin/tlabat', icon: 'bi-check-circle' }
      ];
    } else if (role === 'teacher') {
      return [
        // { label: 'الرئيسية', route: '/teacher/dashboard', icon: 'bi-house-door' },
        { label: 'معسكر همة', route: '/teacher/daily-harvest', icon: 'bi-moon-stars' },
        // { label: 'الطلبات', route: '/teacher/tlabat', icon: 'bi-send-check' },
        // { label: 'الملفات', route: '/teacher/books', icon: 'bi-cloud-arrow-down' }
      ];
    } else {
      return [
        { label: 'الرئيسية', route: '/stn/dashboard', icon: 'bi-house-door' },
        { label: 'الدورات', route: '/stn/courses', icon: 'bi-book' }
      ];
    }
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
export { AuthService };