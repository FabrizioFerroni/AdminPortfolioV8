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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  auditLogsConfig,
  contactConfig,
  experienceConfig,
  profileConfig,
  projectConfig,
  settingsConfig,
} from './features';
import { MARKED_OPTIONS, provideMarkdown } from 'ngx-markdown';

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
    provideAnimationsAsync(),
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
    // provideMarkdown(),
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
  ],
};
