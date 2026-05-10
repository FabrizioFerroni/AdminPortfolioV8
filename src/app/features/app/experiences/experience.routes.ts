import { Rutas } from '@/shared/utils';
import { Routes } from '@angular/router';

export const EXPERIENCES_ROUTES: Routes = [
  {
    path: Rutas.HOME,
    loadComponent: () => import('./page').then(c => c.Experience),
  },
  {
    path: Rutas.NEW_ROUTES,
    loadComponent: () => import('./forms').then(c => c.CreateExperience),
  },
  {
    path: `${Rutas.UPDATE_ROUTES}/:id`,
    loadComponent: () => import('./forms').then(c => c.UpdateExperience),
  },
];
