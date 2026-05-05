import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuditLogsService } from '../service/audit-log-service';
import { AuditsLogsActions } from './audit-logs.action';
import { catchError, map, of, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const getAllAuditLogsEffect = createEffect(
  (actions$ = inject(Actions), auditsService = inject(AuditLogsService)) =>
    actions$.pipe(
      ofType(AuditsLogsActions.getAll),
      switchMap(({ paginado }) =>
        auditsService.obtenerTodos(paginado).pipe(
          map(({ body }) => AuditsLogsActions.getAllSuccess({ data: body!.data })),
          catchError((error: HttpErrorResponse) => {
            const messages: Record<number, string> = {
              403: 'No tenés permisos para ver las auditorias.',
              404: 'No se encontraron auditorias.',
            };
            const msg = messages[error.status] ?? 'Error inesperado. Intentá nuevamente.';
            return of(AuditsLogsActions.getAllFailure({ error: msg, statusCode: error.status }));
          })
        )
      )
    ),
  { functional: true }
);

export const getAuditLogsStatsEffect = createEffect(
  (actions$ = inject(Actions), auditsService = inject(AuditLogsService)) =>
    actions$.pipe(
      ofType(AuditsLogsActions.getStats),
      switchMap(() =>
        auditsService.getStats().pipe(
          map(({ body }) => AuditsLogsActions.getStatsSuccess({ stats: body!.data })),
          catchError((error: HttpErrorResponse) => {
            const messages: Record<number, string> = {
              403: 'No tenés permisos para ver las estadísticas.',
            };
            const msg = messages[error.status] ?? 'Error inesperado. Intentá nuevamente.';
            return of(AuditsLogsActions.getStatsFailure({ error: msg, statusCode: error.status }));
          })
        )
      )
    ),
  { functional: true }
);
