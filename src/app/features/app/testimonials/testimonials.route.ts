import { Rutas } from '@/shared/utils';
import { Routes } from '@angular/router';

export const TESTIMONIALS_ROUTES: Routes = [
  {
    path: Rutas.HOME,
    loadComponent: () => import('./page').then(c => c.Testimonials),
  },
  {
    path: Rutas.NEW_ROUTES_O,
    loadComponent: () => import('./forms').then(c => c.CreateTestimonial),
  },
  {
    path: `${Rutas.UPDATE_ROUTES}/:id`,
    loadComponent: () => import('./forms').then(c => c.UpdateTestimonial),
  },
];
