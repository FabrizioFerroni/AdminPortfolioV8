import { EnvironmentProviders, Provider } from '@angular/core';
import { TestimonialService } from './service';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { testimonialEffects, testimonialFeature } from './store';

export const testimonialsConfig: (Provider | EnvironmentProviders)[] = [
  TestimonialService,
  provideState(testimonialFeature),
  provideEffects(testimonialEffects),
];
