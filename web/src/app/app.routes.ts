import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'board' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'board',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./board.component').then((m) => m.BoardComponent),
  },
  { path: '**', redirectTo: 'board' },
];
