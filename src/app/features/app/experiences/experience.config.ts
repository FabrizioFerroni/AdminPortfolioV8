import { EnvironmentProviders, Provider } from '@angular/core';
import { ExperienceService } from './service/experience-service';
import * as experienceEffects from './store/experience.effect';
import { provideState } from '@ngrx/store';
import { experienceFeature } from './store';
import { provideEffects } from '@ngrx/effects';

export const experienceConfig: (Provider | EnvironmentProviders)[] = [
  ExperienceService,
  provideState(experienceFeature),
  provideEffects(experienceEffects),
];
