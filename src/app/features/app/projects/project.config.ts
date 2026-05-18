import { EnvironmentProviders, Provider } from '@angular/core';
import { ProjectService } from './service';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { projectEffects, projectFeature } from './store';

export const projectConfig: (Provider | EnvironmentProviders)[] = [
  ProjectService,
  provideState(projectFeature),
  provideEffects(projectEffects),
];
