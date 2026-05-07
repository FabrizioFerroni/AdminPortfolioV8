import { EnvironmentProviders, Provider } from '@angular/core';
import { ContactService } from './service/contact-service';
import { provideState } from '@ngrx/store';
import { contactFeature } from './store';
import * as contactEffects from './store/contact.effects';
import { provideEffects } from '@ngrx/effects';

export const contactConfig: (Provider | EnvironmentProviders)[] = [
  ContactService,
  provideState(contactFeature),
  provideEffects(contactEffects),
];
