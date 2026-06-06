import { EnvironmentProviders, Provider } from '@angular/core';
import { DashboardService } from './service';
import { provideState } from '@ngrx/store';
import { dashboardEffects, dashboardFeature } from './store';
import { provideEffects } from '@ngrx/effects';

export const dashboardConfig: (Provider | EnvironmentProviders)[] = [
  DashboardService,
  provideState(dashboardFeature),
  provideEffects(dashboardEffects),
];
