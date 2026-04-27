import { Routes } from '@angular/router';
import { Rutas } from './shared/utils/rutas';
import { NotFoundComponent } from './shared/components/not-found/not-found';

export const routes: Routes = [
  {
    path: Rutas.HOME,
    loadChildren: () => import('./features/auth/auth.routes'),
  },
  {
    path: Rutas.HOME,
    loadChildren: () => import('./features/app/app.routes'),
  },
  {
    path: Rutas.NOT_FOUND,
    component: NotFoundComponent,
    pathMatch: 'full',
  },
];
