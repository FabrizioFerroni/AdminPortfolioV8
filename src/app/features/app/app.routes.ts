import { logedGuard } from '@/core';
import { Rutas } from '@/shared/utils';
import { Routes } from '@angular/router';

export default [
  {
    path: Rutas.DASHBOARD,
    loadComponent: () => import('./dashboard/dashboard'),
    canActivate: [logedGuard],
  },
] as Routes;
