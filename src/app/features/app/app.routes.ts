import { Rutas } from '@/shared/utils';
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: Rutas.DASHBOARD,
    loadComponent: () => import('./dashboard').then(m => m.Dashboard),
  },
  {
    path: Rutas.SUBSCRIBERS,
    loadComponent: () => import('./subscribers/subscribers').then(m => m.Subscribers),
  },
  {
    path: Rutas.AUDITS,
    loadComponent: () => import('./audit-logs').then(m => m.AuditLogs),
  },
  {
    path: Rutas.CONTACTS,
    loadComponent: () => import('./contacts').then(m => m.Contacts),
  },
  {
    path: Rutas.EXPERIENCES,
    loadChildren: () => import('./experiences').then(m => m.EXPERIENCES_ROUTES),
  },
  {
    path: Rutas.PROFILE,
    loadComponent: () => import('./profile').then(c => c.Profile),
  },
  {
    path: Rutas.SETTINGS,
    loadComponent: () => import('./settings').then(c => c.Settings),
  },
  {
    path: Rutas.PROJECTS,
    loadChildren: () => import('./projects').then(m => m.PROJECTS_ROUTES),
  },
];
