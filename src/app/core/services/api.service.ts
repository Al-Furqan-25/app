import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // ضعي هنا رابط نشر الـ Web App الخاص بـ Google Apps Script
  private gasUrl = 'https://script.google.com/macros/s/AKfycbyt4K8pOJVJhYfEAbjqF-dVq57Uo_W9N0k3WkHW-SvTtJE-GAjJvRp7Njz34B0ZyXtJ/exec';

  constructor(private http: HttpClient) {}

  getLinkWebApp(): string {
    return this.gasUrl;
  }

  getPasswords(): Observable<any> {
    return this.http.get(`${this.gasUrl}?action=getPasswords`);
  }

  getTeacherById(id: string): Observable<any> {
    return this.http.get(`${this.gasUrl}?action=getTeacherById&id=${id}`);
  }

  getStudentById(id: string): Observable<any> {
    return this.http.get(`${this.gasUrl}?action=getStudentById&id=${id}`);
  }

  getPdfDetails(): Observable<any> {
    return this.http.get(`${this.gasUrl}?action=getPdfDetails`);
  }
}