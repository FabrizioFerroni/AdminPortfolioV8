import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap, timer } from 'rxjs';
import { AuthActions } from './auth.actions';
import { AuthService } from '@/features/auth/services';
import { TokenService } from '@/shared/services';
import { RefreshToken } from '@/shared/interfaces';
import { Rutas } from '@/shared/utils';
import { ActivatedRoute } from '@angular/router';
import { toast } from 'ngx-sonner';

export const loginEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ body, rememberMe }) =>
        authService.login(body).pipe(
          map(({ data: { user, access_token, refresh_token } }) =>
            AuthActions.loginSuccess({ user, access_token, refresh_token, rememberMe })
          ),
          catchError(({ statusCode }: { statusCode: number }) => {
            const messages: Record<number, string> = {
              400: 'El email o contraseña no son válidos.',
              404: 'Usuario no encontrado...',
            };
            const error = messages[statusCode] ?? 'Hubo un error inesperado. Intente nuevamente.';
            return of(AuthActions.loginFailure({ error, statusCode }));
          })
        )
      )
    ),
  { functional: true }
);

export const loginSuccessEffect = createEffect(
  (
    actions$ = inject(Actions),
    tokenService = inject(TokenService),
    router = inject(Router),
    route = inject(ActivatedRoute)
  ) =>
    actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ user, access_token, refresh_token, rememberMe }) => {
        const bodyRT: RefreshToken = { token: refresh_token };

        if (rememberMe) {
          tokenService.setUserLS(user);
          tokenService.setLocalStorage(access_token);
        } else {
          tokenService.setUserSS(user);
          tokenService.setSessionStorage(access_token);
        }

        tokenService.setCookieRefresh(bodyRT);

        toast.success('Éxito', {
          description: `${user.name} te has logueado correctamente!`,
          position: 'top-right',
        });

        const { fragment } = route.snapshot;
        const redirectUrl = fragment ? fragment.split('=')[1] : `/${Rutas.DASHBOARD}`;
        router.navigate([redirectUrl]);
      })
    ),
  { functional: true, dispatch: false }
);

export const logoutEffect = createEffect(
  (actions$ = inject(Actions), tokenService = inject(TokenService)) =>
    actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => tokenService.logOut())
    ),
  { functional: true, dispatch: false }
);

export const clearErrorEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AuthActions.loginFailure),
      switchMap(() => timer(5000).pipe(map(() => AuthActions.clearError())))
    ),
  { functional: true }
);

export const hydrateEffect = createEffect(
  (actions$ = inject(Actions), tokenService = inject(TokenService)) =>
    actions$.pipe(
      ofType(AuthActions.init),
      map(() => {
        const user = tokenService.getUserSS() ?? tokenService.getUserLS();
        if (user) {
          return AuthActions.hydrate({ user });
        }
        return AuthActions.clearError();
      })
    ),
  { functional: true }
);
