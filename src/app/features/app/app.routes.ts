import { Rutas } from '@/shared/utils';
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: Rutas.DASHBOARD,
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: Rutas.SUBSCRIBERS,
    loadComponent: () => import('./subscribers/subscribers').then(m => m.Subscribers),
  },
];
