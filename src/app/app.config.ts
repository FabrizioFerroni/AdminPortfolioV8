import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { provideZard } from '@/shared/core/provider/providezard';
import { AuthService } from './features/auth/services';
import { errorHandlerInterceptor, refreshInterceptor } from './core';

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
    AuthService,
  ],
};
