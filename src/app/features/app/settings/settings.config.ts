import { EnvironmentProviders, Provider } from '@angular/core';
import { SettingsService } from './service';
import { settingFeature } from './store';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as settingEffects from './store/setting.effect';

export const settingsConfig: (Provider | EnvironmentProviders)[] = [
  SettingsService,
  provideState(settingFeature),
  provideEffects(settingEffects),
];
