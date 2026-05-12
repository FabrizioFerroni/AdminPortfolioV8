import { EnvironmentProviders, Provider } from '@angular/core';
import { ProfileService } from './service';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { userFeature } from './store';
import * as userEffects from './store/user.effect';

export const profileConfig: (Provider | EnvironmentProviders)[] = [
  ProfileService,
  provideState(userFeature),
  provideEffects(userEffects),
];
