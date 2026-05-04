import { EnvironmentProviders, Provider } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { SubscribersService } from './service/subscribers';
import { subscribersFeature } from './store/subscribers.reducer';
import { provideState } from '@ngrx/store';
import * as subscriberEffects from './store/subscribers.effects';

export const subscribersConfig: (Provider | EnvironmentProviders)[] = [
  SubscribersService,
  provideState(subscribersFeature),
  provideEffects(subscriberEffects),
];
