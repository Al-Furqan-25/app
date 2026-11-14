import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/login/login';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { TeacherDashboard } from './features/teacher-portal/teacher-dashboard/teacher-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'teacher-dashboard', pathMatch: 'full' },
      { path: 'teacher/dashboard', component: TeacherDashboard },
      {
        path: 'teacher/daily-harvest',
        loadComponent: () =>
          import('./features/teacher-portal/daily-harvest/daily-harvest')
            .then(m => m.DailyHarvest)
      }
    ]
  },
  { path: '**', redirectTo: 'home' }
];
