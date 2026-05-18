import { Rutas } from '@/shared/utils';
import { Routes } from '@angular/router';

export const PROJECTS_ROUTES: Routes = [
  {
    path: Rutas.HOME,
    loadComponent: () => import('./page').then(c => c.Project),
  },
  {
    path: Rutas.NEW_ROUTES_O,
    loadComponent: () => import('./forms').then(c => c.CreateProject),
  },
  {
    path: `${Rutas.UPDATE_ROUTES}/:id`,
    loadComponent: () => import('./forms').then(c => c.UpdateProject),
  },
];
