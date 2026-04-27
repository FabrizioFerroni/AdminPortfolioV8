import { Routes } from '@angular/router';
import { publicGuard } from '@/core';
import { Rutas } from '@/shared/utils';

export default [
  {
    path: Rutas.HOME,
    loadComponent: () => import('./login/login'),
    canActivate: [publicGuard],
  },
] as Routes;
