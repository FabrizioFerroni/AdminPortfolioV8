import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SettingsService } from '../service';
import { SettingActions } from './setting.action';
import { catchError, map, mergeMap, of, switchMap, tap, timer } from 'rxjs';
import { HandledError } from '@/shared/interfaces/error-response.interface';
import { toast } from 'ngx-sonner';

export const getSettingEffect = createEffect(
  (actions$ = inject(Actions), settingService = inject(SettingsService)) =>
    actions$.pipe(
      ofType(SettingActions.getSetting),
      switchMap(() =>
        settingService.getSetting().pipe(
          map(({ body }) => SettingActions.getSettingSuccess({ data: body!.data })),
          catchError((error: HandledError) => {
            return of(
              SettingActions.getSettingFailure({
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

export const updateSettingEffect = createEffect(
  (actions$ = inject(Actions), settingService = inject(SettingsService)) =>
    actions$.pipe(
      ofType(SettingActions.updateSetting),
      switchMap(({ data }) =>
        settingService.updateSetting(data).pipe(
          tap(() => {
            toast.success('Éxito', {
              description: `Se ha actualizado con éxito la configuración`,
              position: 'top-right',
            });
          }),
          map(() => SettingActions.updateSettingSuccess()),
          catchError((error: HandledError) => {
            return of(
              SettingActions.updateSettingFailure({
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

export const reloadAfterUpdateSettingEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(SettingActions.updateSettingSuccess),
      mergeMap(() => [SettingActions.getSetting()])
    ),
  { functional: true }
);

export const clearErrorFormSettingEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(SettingActions.updateSettingFailure),
      switchMap(() => timer(5000).pipe(map(() => SettingActions.clearError())))
    ),
  { functional: true }
);
