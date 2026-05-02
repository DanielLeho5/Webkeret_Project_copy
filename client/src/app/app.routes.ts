import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { PublicGuard } from './public.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./user-dashboard-component/user-dashboard-component').then(m => m.UserDashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./history-page/history-page').then(m => m.HistoryPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./registration-page/registration-page').then(m => m.RegistrationPage),
    canActivate: [PublicGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./login-page/login-page').then(m => m.LoginPage),
    canActivate: [PublicGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./setting-page/setting-page').then(m => m.SettingPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-users',
    loadComponent: () => import('./admin-users-page-component/admin-users-page-component').then(m => m.AdminUsersPageComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin-settings',
    loadComponent: () => import('./admin-settings-page-component/admin-settings-page-component').then(m => m.AdminSettingsPageComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./page-not-found/page-not-found').then(m => m.PageNotFound),
  }
];
