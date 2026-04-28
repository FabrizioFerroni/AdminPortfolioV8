import { provideEffects } from '@ngrx/effects';
import { EnvironmentProviders, Provider } from '@angular/core';
import * as authEffects from './store/auth.effects';
import { authFeature } from './store/auth.reducer';
import { AuthService } from './services';
import { provideState } from '@ngrx/store';

export const authConfig: (Provider | EnvironmentProviders)[] = [
  AuthService,
  provideState(authFeature),
  provideEffects(authEffects),
];
