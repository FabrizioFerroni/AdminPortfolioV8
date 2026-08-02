import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { provideZard } from '@/shared/core/provider/providezard';
import { errorHandlerInterceptor, refreshInterceptor } from './core';
import { authConfig } from './features/auth';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideStore } from '@ngrx/store';
import { provideRouterStore } from '@ngrx/router-store';
import { subscribersConfig } from './features/app/subscribers/subscriber.config';
import {
  auditLogsConfig,
  contactConfig,
  dashboardConfig,
  experienceConfig,
  profileConfig,
  projectConfig,
  settingsConfig,
  testimonialsConfig,
} from './features';
import { MARKED_OPTIONS, provideMarkdown } from 'ngx-markdown';
import localeEsAr from '@angular/common/locales/es-AR';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEsAr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      })
    ),
    provideZard(),
    provideHttpClient(withInterceptors([errorHandlerInterceptor, refreshInterceptor]), withFetch()),
    ReactiveFormsModule,
    provideStore({}),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: true,
      traceLimit: 75,
      connectInZone: true,
    }),
    provideRouterStore(),
    provideMarkdown({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useValue: {
          gfm: true,
        },
      },
    }),
    ...authConfig,
    ...subscribersConfig,
    ...auditLogsConfig,
    ...contactConfig,
    ...experienceConfig,
    ...profileConfig,
    ...settingsConfig,
    ...projectConfig,
    ...dashboardConfig,
    ...testimonialsConfig,
    { provide: LOCALE_ID, useValue: 'es-AR' },
  ],
};
