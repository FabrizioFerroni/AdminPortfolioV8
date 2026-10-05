import { EnvironmentProviders, Provider } from '@angular/core';
import { ProfileService } from './service';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { cvFeature, userFeature } from './store';
import * as userEffects from './store/user.effect';

export const profileConfig: (Provider | EnvironmentProviders)[] = [
  ProfileService,
  provideState(userFeature),
  provideState(cvFeature),
  provideEffects(userEffects),
];
