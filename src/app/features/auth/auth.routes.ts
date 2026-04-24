import { Routes } from '@angular/router';
import { Rutas } from '../../shared/utils/rutas';

export default [
  {
    path: Rutas.HOME,
    loadComponent: () => import('./login/login'),
  },
] as Routes;
