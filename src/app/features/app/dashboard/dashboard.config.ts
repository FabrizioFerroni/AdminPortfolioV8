import { EnvironmentProviders, Provider } from '@angular/core';
import { DashboardService } from './service';

export const dashboardConfig: (Provider | EnvironmentProviders)[] = [DashboardService];
