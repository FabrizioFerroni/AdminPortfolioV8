import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SubscribersActions } from './subscriber.action';
import { SubscribersService } from '../service/subscribers';
import { toast } from 'ngx-sonner';
import { ApiResponse } from '@/shared/response';

export const getAllSubscribersEffect = createEffect(
  (actions$ = inject(Actions), subscribersService = inject(SubscribersService)) =>
    actions$.pipe(
      ofType(SubscribersActions.getAll),
      switchMap(({ paginado }) =>
        subscribersService.obtenerTodos(paginado).pipe(
          map(({ body }) => SubscribersActions.getAllSuccess({ data: body!.data })),
          catchError((error: HttpErrorResponse) => {
            const messages: Record<number, string> = {
              403: 'No tenés permisos para ver los suscriptores.',
              404: 'No se encontraron suscriptores.',
            };
            const msg = messages[error.status] ?? 'Error inesperado. Intentá nuevamente.';
            return of(SubscribersActions.getAllFailure({ error: msg, statusCode: error.status }));
          })
        )
      )
    ),
  { functional: true }
);

export const deleteSubscriberEffect = createEffect(
  (actions$ = inject(Actions), subscribersService = inject(SubscribersService)) =>
    actions$.pipe(
      ofType(SubscribersActions.delete),
      switchMap(({ email }) =>
        subscribersService.deleteSubscriber(email).pipe(
          map(({ body }: HttpResponse<ApiResponse<string>>) => {
            toast.success('Éxito', {
              description: `${body!.data}`,
              position: 'top-right',
            });

            return SubscribersActions.deleteSuccess({ email });
          }),
          catchError((error: HttpErrorResponse) => {
            const messages: Record<number, string> = {
              403: 'No tenés permisos para eliminar suscriptores.',
              404: 'El suscriptor no fue encontrado.',
            };
            const msg = messages[error.status] ?? 'Error inesperado. Intentá nuevamente.';
            toast.error('Upps...', {
              description: `${msg}`,
              position: 'top-right',
            });
            return of(SubscribersActions.deleteFailure({ error: msg, statusCode: error.status }));
          })
        )
      )
    ),
  { functional: true }
);

export const getSubscriberStatsEffect = createEffect(
  (actions$ = inject(Actions), subscribersService = inject(SubscribersService)) =>
    actions$.pipe(
      ofType(SubscribersActions.getStats),
      switchMap(() =>
        subscribersService.getStats().pipe(
          map(({ body }) => SubscribersActions.getStatsSuccess({ stats: body!.data })),
          catchError((error: HttpErrorResponse) => {
            const messages: Record<number, string> = {
              403: 'No tenés permisos para ver las estadísticas.',
            };
            const msg = messages[error.status] ?? 'Error inesperado. Intentá nuevamente.';
            return of(SubscribersActions.getStatsFailure({ error: msg, statusCode: error.status }));
          })
        )
      )
    ),
  { functional: true }
);
