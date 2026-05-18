import { Routes } from '@angular/router';
import { Rutas } from './shared/utils/rutas';
import { NotFoundComponent } from './shared/components/not-found/not-found';
import { MainLayout } from './layout';
import { logedGuard } from './core';

export const routes: Routes = [
  {
    path: Rutas.HOME,
    loadChildren: () => import('./features/auth/auth.routes'),
  },
  {
    path: Rutas.HOME,
    component: MainLayout,
    canActivate: [logedGuard],
    loadChildren: () => import('./features').then(m => m.APP_ROUTES),
  },
  {
    path: Rutas.NOT_FOUND,
    component: NotFoundComponent,
    pathMatch: 'full',
  },
];
