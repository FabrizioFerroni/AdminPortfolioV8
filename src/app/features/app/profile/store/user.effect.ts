import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProfileService } from '../service';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { UserActions } from './user.action';
import { HandledError } from '@/shared/interfaces/error-response.interface';
import { HttpResponse } from '@angular/common/http';
import { ApiResponse } from '@/shared/response';
import { toast } from 'ngx-sonner';
import { TokenService } from '@/shared/services';
import { AuthActions } from '@/features/auth/store';

export const getProfileEffect = createEffect(
  (actions$ = inject(Actions), profileService = inject(ProfileService)) =>
    actions$.pipe(
      ofType(UserActions.getUser),
      switchMap(() =>
        profileService.getProfile().pipe(
          map(({ body }) => UserActions.getUserSuccess({ data: body!.data })),
          catchError((error: HandledError) => {
            return of(
              UserActions.getUserFailure({
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

export const updateUserProfileEffect = createEffect(
  (actions$ = inject(Actions), profileService = inject(ProfileService)) =>
    actions$.pipe(
      ofType(UserActions.updateProfile),
      switchMap(({ data }) =>
        profileService.updateProfile(data).pipe(
          map(({ body }: HttpResponse<ApiResponse<string>>) => {
            toast.success('Éxito', {
              description: `${body!.data}`,
              position: 'top-right',
            });

            return UserActions.updateProfileSuccess();
          }),
          catchError((error: HandledError) => {
            return of(
              UserActions.updateProfileFailure({
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

export const updateUserPasswordEffect = createEffect(
  (actions$ = inject(Actions), profileService = inject(ProfileService)) =>
    actions$.pipe(
      ofType(UserActions.updatePassword),
      switchMap(({ data }) =>
        profileService.updatePassword(data).pipe(
          map(({ body }: HttpResponse<ApiResponse<string>>) => {
            toast.success('Éxito', {
              description: `${body!.data}`,
              position: 'top-right',
            });

            return UserActions.updatePasswordSuccess();
          }),
          catchError((error: HandledError) => {
            return of(
              UserActions.updatePasswordFailure({
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

export const reloadAfterUpdateUserEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(UserActions.updateProfileSuccess, UserActions.updatePasswordSuccess),
      mergeMap(() => [UserActions.getUser()])
    ),
  { functional: true }
);

export const syncAuthUserAfterProfileUpdateEffect = createEffect(
  (actions$ = inject(Actions), tokenService = inject(TokenService)) =>
    actions$.pipe(
      ofType(UserActions.getUserSuccess),
      tap(({ data }) => {
        if (tokenService.getUserLS()) tokenService.setUserLS(data);
        if (tokenService.getUserSS()) tokenService.setUserSS(data);
      }),
      map(({ data }) => AuthActions.updateUser({ user: data }))
    ),
  { functional: true }
);
