import { Routes } from '@angular/router';
import { publicGuard } from '@/core';
import { Rutas } from '@/shared/utils';

export const AUTH_ROUTES: Routes = [
  {
    path: Rutas.HOME,
    loadComponent: () => import('./login').then(c => c.Login),
    canActivate: [publicGuard],
  },
  {
    path: Rutas.FORGOT_PASSWORD,
    loadComponent: () => import('./forgot-password').then(c => c.ForgotPassword),
    canActivate: [publicGuard],
  },
  {
    path: `${Rutas.CHANGE_PASSWORD}/:token`,
    loadComponent: () => import('./cambiar-clave').then(c => c.CambiarClave),
    canActivate: [publicGuard],
  },
] as Routes;
