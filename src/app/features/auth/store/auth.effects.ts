import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap, timer } from 'rxjs';
import { AuthActions } from './auth.actions';
import { AuthService } from '@/features/auth/services';
import { TokenService } from '@/shared/services';
import { Rutas } from '@/shared/utils';
import { ActivatedRoute } from '@angular/router';
import { toast } from 'ngx-sonner';
import { HandledError } from '@/shared/interfaces/error-response.interface';

export const loginEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ body, rememberMe }) =>
        authService.login(body, rememberMe).pipe(
          map(({ data: { user, access_token } }) =>
            AuthActions.loginSuccess({ user, access_token, rememberMe })
          ),
          catchError((error: HandledError) => {
            return of(
              AuthActions.loginFailure({
                error: error.message,
                statusCode: error.statusCode,
              })
            );
          })
        )
      )
    ),
  { functional: true }
);

export const forgotPasswordEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
      ofType(AuthActions.forgotPassword),
      switchMap(({ body }) =>
        authService.forgotPassword(body).pipe(
          map(({ data }) => AuthActions.forgotPasswordSuccess({ message: data })),
          catchError((error: HandledError) => {
            return of(
              AuthActions.forgotPasswordFailure({
                error: error.message,
                statusCode: error.statusCode,
              })
            );
          })
        )
      )
    ),
  { functional: true }
);

export const verifyPasswordEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
      ofType(AuthActions.verifyTokenPassword),
      switchMap(({ token }) =>
        authService.verifyTokenPassword(token).pipe(
          map(({ data }) => AuthActions.verifyTokenPasswordSuccess({ message: data })),
          catchError((error: HandledError) => {
            return of(
              AuthActions.verifyTokenPasswordFailure({
                error: error.message,
                statusCode: error.statusCode,
              })
            );
          })
        )
      )
    ),
  { functional: true }
);

export const verifyPasswordFailureEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthActions.verifyTokenPasswordFailure),
      tap(({ error }) => {
        toast.error('Uppss... Hubo un error', {
          description: error,
          position: 'top-right',
        });
        router.navigateByUrl('/');
      })
    ),
  { functional: true, dispatch: false }
);

export const changePasswordEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
      ofType(AuthActions.changePassword),
      switchMap(({ body }) =>
        authService.changePassword(body).pipe(
          map(({ data }) => AuthActions.changePasswordSuccess({ message: data })),
          catchError((error: HandledError) => {
            return of(
              AuthActions.changePasswordFailure({
                error: error.message,
                statusCode: error.statusCode,
              })
            );
          })
        )
      )
    ),
  { functional: true }
);

const FORGOT_MESSAGE_TTL_MS = 20_000;

export const clearForgotMessageEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AuthActions.forgotPasswordSuccess),
      ofType(AuthActions.forgotPasswordFailure),
      switchMap(() =>
        timer(FORGOT_MESSAGE_TTL_MS).pipe(map(() => AuthActions.clearForgotMessage()))
      )
    ),
  { functional: true }
);

export const clearChangeMessageEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AuthActions.changePasswordSuccess),
      ofType(AuthActions.changePasswordFailure),
      switchMap(() =>
        timer(FORGOT_MESSAGE_TTL_MS).pipe(map(() => AuthActions.clearForgotMessage()))
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
      tap(({ user, access_token, rememberMe }) => {
        if (rememberMe) {
          tokenService.setUserLS(user);
          tokenService.setLocalStorage(access_token);
        } else {
          tokenService.setUserSS(user);
          tokenService.setSessionStorage(access_token);
        }

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
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
    tokenService = inject(TokenService)
  ) =>
    actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => authService.logout().pipe(catchError(() => of(null)))),
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
