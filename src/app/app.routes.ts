import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/login/login';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { TeacherDashboard } from './features/teacher-portal/teacher-dashboard/teacher-dashboard';
import { ExpDashboard } from './features/exp-stn-portal/exp-dashboard/exp-dashboard';
import { YStnDashboard } from './features/young-stn-portal/y-stn-dashboard/y-stn-dashboard';
import { roleGuard } from './shared/guards/role.guard';
import { AppRoles } from './core/constants/app-roles';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  // teacher portal routes
  {
    path: 'teacher',
    component: MainLayout,
    canActivate: [roleGuard],
    data: { roles: [AppRoles.TEACHER] },
    children: [
      { path: '', redirectTo: 'daily-harvest', pathMatch: 'full' },
      { path: 'dashboard', component: TeacherDashboard },
      {
        path: 'daily-harvest',
        loadComponent: () =>
          import('./features/teacher-portal/daily-harvest/daily-harvest')
            .then(m => m.DailyHarvest)
      }
    ]
  },
  // expStn portal routes
 {
    path: 'expStn',
    component: MainLayout,
    canActivate: [roleGuard],
    data: { roles: [AppRoles.EXP_STN] },
    children: [
      { path: '', redirectTo: 'daily-harvest', pathMatch: 'full' },
      { path: 'dashboard', component: ExpDashboard },
      {
        path: 'daily-harvest',
        loadComponent: () =>
          import('./features/exp-stn-portal/e-daily-harvest/e-daily-harvest')
            .then(m => m.EDailyHarvest)
      }
    ]
  },
  // young student portal routes
  {
    path: 'youngStn',
    component: MainLayout,
    canActivate: [roleGuard],
    data: { roles: [AppRoles.YOUNG_STN] },
    children: [
      { path: '', redirectTo: 'yDaily-harvest', pathMatch: 'full' },
      { path: 'dashboard', component: YStnDashboard },
      {
        path: 'yDaily-harvest',
        loadComponent: () =>
          import('./features/young-stn-portal/y-daily-harvest/y-daily-harvest')
            .then(m => m.YDailyHarvest)
      }
    ]
  },
  { path: '**', redirectTo: 'home' }
];
