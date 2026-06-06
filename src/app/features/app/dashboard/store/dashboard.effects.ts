import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DashboardService } from '../service';
import { DashboardActions } from './dashboard.action';
import { catchError, map, of, switchMap } from 'rxjs';
import { HandledError } from '@/shared/interfaces/error-response.interface';

export const getDashboardStatsEffect = createEffect(
  (actions$ = inject(Actions), dashboardService = inject(DashboardService)) =>
    actions$.pipe(
      ofType(DashboardActions.getStats),
      switchMap(() =>
        dashboardService.getStatsCompleted().pipe(
          map(({ body }) => DashboardActions.getStatsSuccess({ stats: body!.data })),
          catchError((error: HandledError) => {
            return of(
              DashboardActions.getStatsFailure({
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

export const getDashboardStatsMonthlyEffect = createEffect(
  (actions$ = inject(Actions), dashboardService = inject(DashboardService)) =>
    actions$.pipe(
      ofType(DashboardActions.getStatsMonthly),
      switchMap(() =>
        dashboardService.getStatsMonthlyCompleted().pipe(
          map(({ body }) => DashboardActions.getStatsMonthlySuccess({ monthly: body!.data })),
          catchError((error: HandledError) => {
            return of(
              DashboardActions.getStatsMonthlyFailure({
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

export const getLastFiveAuditsEffect = createEffect(
  (actions$ = inject(Actions), dashboardService = inject(DashboardService)) =>
    actions$.pipe(
      ofType(DashboardActions.getLastFiveAudits),
      switchMap(() =>
        dashboardService.getLastFiveAudits().pipe(
          map(({ body }) => DashboardActions.getLastFiveAuditsSuccess({ audits: body!.data })),
          catchError((error: HandledError) => {
            return of(
              DashboardActions.getLastFiveAuditsFailure({
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

export const getAnalitycsByRange = createEffect(
  (actions$ = inject(Actions), dashboardService = inject(DashboardService)) =>
    actions$.pipe(
      ofType(DashboardActions.getAnalitycs),
      switchMap(({ range }) =>
        dashboardService.getPortfolioViews(range).pipe(
          map(({ body }) => DashboardActions.getAnalitysSuccess({ analitycs: body!.data })),
          catchError((error: HandledError) => {
            return of(
              DashboardActions.getAnalitycsFailure({
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
