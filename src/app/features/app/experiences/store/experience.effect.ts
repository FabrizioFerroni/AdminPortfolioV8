import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ExperienceService } from '../service/experience-service';
import { ExperiencesActions } from './experience.action';
import { catchError, from, map, mergeMap, of, switchMap, tap, timer } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { HandledError } from '@/shared/interfaces/error-response.interface';
import { Router } from '@angular/router';
import { Rutas } from '@/shared/utils';

export const getAllExperiencesEffect = createEffect(
  (actions$ = inject(Actions), experienceService = inject(ExperienceService)) =>
    actions$.pipe(
      ofType(ExperiencesActions.getAll),
      switchMap(({ paginado }) =>
        experienceService.obtenerTodos(paginado).pipe(
          map(({ body }) => ExperiencesActions.getAllSuccess({ data: body!.data })),
          catchError((error: HttpErrorResponse) => {
            const messages: Record<number, string> = {
              401: 'No estas autenticado.',
              403: 'No tenés permisos para ver las experiencias.',
            };
            const msg = messages[error.status] ?? 'Error inesperado. Intentá nuevamente.';
            return of(ExperiencesActions.getAllFailure({ error: msg, statusCode: error.status }));
          })
        )
      )
    ),
  { functional: true }
);

export const getExperiencesStatsEffect = createEffect(
  (actions$ = inject(Actions), experienceService = inject(ExperienceService)) =>
    actions$.pipe(
      ofType(ExperiencesActions.getStats),
      switchMap(() =>
        experienceService.getStats().pipe(
          map(({ body }) => ExperiencesActions.getStatsSuccess({ stats: body!.data })),
          catchError((error: HttpErrorResponse) => {
            const messages: Record<number, string> = {
              403: 'No tenés permisos para ver las estadísticas.',
            };
            const msg = messages[error.status] ?? 'Error inesperado. Intentá nuevamente.';
            return of(ExperiencesActions.getStatsFailure({ error: msg, statusCode: error.status }));
          })
        )
      )
    ),
  { functional: true }
);

export const getExperienceByIdEffect = createEffect(
  (actions$ = inject(Actions), experienceService = inject(ExperienceService)) =>
    actions$.pipe(
      ofType(ExperiencesActions.getById),
      switchMap(({ id }) =>
        experienceService.obtenerPorId(id).pipe(
          map(({ body }) => ExperiencesActions.getByIdSuccess({ experience: body!.data })),
          catchError((error: HttpErrorResponse) => {
            const messages: Record<number, string> = {
              401: 'No estas autenticado.',
              403: 'No tenés permisos para ver la experiencia.',
              404: 'No se encontraron experiencia.',
            };
            const msg = messages[error.status] ?? 'Error inesperado. Intentá nuevamente.';
            return of(ExperiencesActions.getByIdFailure({ error: msg, statusCode: error.status }));
          })
        )
      )
    ),
  { functional: true }
);

export const postExperienceEffect = createEffect(
  (
    actions$ = inject(Actions),
    experienceService = inject(ExperienceService),
    router = inject(Router)
  ) =>
    actions$.pipe(
      ofType(ExperiencesActions.createExperience),
      switchMap(({ data }) =>
        experienceService.createExperience(data).pipe(
          switchMap(({ body }) =>
            from(router.navigateByUrl(`${Rutas.EXPERIENCES}`)).pipe(
              tap(() => {
                toast.success('Éxito', {
                  description: `${body!.data}`,
                  position: 'top-right',
                });
              }),
              map(() => ExperiencesActions.createExperienceSuccess())
            )
          ),
          catchError((error: HandledError) => {
            return of(
              ExperiencesActions.createExperienceFailure({
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

export const updateExperienceEffect = createEffect(
  (
    actions$ = inject(Actions),
    experienceService = inject(ExperienceService),
    router = inject(Router)
  ) =>
    actions$.pipe(
      ofType(ExperiencesActions.updateExperience),
      switchMap(({ id, data }) =>
        experienceService.updateExperience(id, data).pipe(
          switchMap(({ body }) =>
            from(router.navigateByUrl(`${Rutas.EXPERIENCES}`)).pipe(
              tap(() => {
                toast.success('Éxito', {
                  description: `${body!.data}`,
                  position: 'top-right',
                });
              }),
              map(() => ExperiencesActions.updateExperienceSuccess({ id }))
            )
          ),
          catchError((error: HandledError) => {
            return of(
              ExperiencesActions.createExperienceFailure({
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

export const moveUpExperienceEffect = createEffect(
  (actions$ = inject(Actions), experienceService = inject(ExperienceService)) =>
    actions$.pipe(
      ofType(ExperiencesActions.moveUpExperience),
      switchMap(({ id }) =>
        experienceService.moveUpDisplayOrder(id).pipe(
          map(({ body }) => {
            toast.success('Éxito', {
              description: `${body!.data}`,
              position: 'top-right',
            });
            return ExperiencesActions.moveUpExperienceSuccess({ id });
          }),
          catchError((error: HttpErrorResponse) => {
            const messages: Record<number, string> = {
              401: 'No estas autenticado.',
              403: 'No tenés permisos para editar una experiencias.',
              404: 'No se encontraron experiencia.',
            };
            const msg = messages[error.status] ?? 'Error inesperado. Intentá nuevamente.';
            return of(
              ExperiencesActions.moveUpExperienceFailure({ error: msg, statusCode: error.status })
            );
          })
        )
      )
    ),
  { functional: true }
);

export const moveDownExperienceEffect = createEffect(
  (actions$ = inject(Actions), experienceService = inject(ExperienceService)) =>
    actions$.pipe(
      ofType(ExperiencesActions.moveDownExperience),
      switchMap(({ id }) =>
        experienceService.moveDownDisplayOrder(id).pipe(
          map(({ body }) => {
            toast.success('Éxito', {
              description: `${body!.data}`,
              position: 'top-right',
            });
            return ExperiencesActions.moveDownExperienceSuccess({ id });
          }),
          catchError((error: HttpErrorResponse) => {
            const messages: Record<number, string> = {
              401: 'No estas autenticado.',
              403: 'No tenés permisos para editar una experiencias.',
              404: 'No se encontraron experiencia.',
            };
            const msg = messages[error.status] ?? 'Error inesperado. Intentá nuevamente.';
            return of(
              ExperiencesActions.moveDownExperienceFailure({ error: msg, statusCode: error.status })
            );
          })
        )
      )
    ),
  { functional: true }
);

export const deleteExperienceEffect = createEffect(
  (actions$ = inject(Actions), experienceService = inject(ExperienceService)) =>
    actions$.pipe(
      ofType(ExperiencesActions.deleteExperience),
      switchMap(({ id }) =>
        experienceService.deleteExperience(id).pipe(
          map(({ body }) => {
            toast.success('Éxito', {
              description: `${body!.data}`,
              position: 'top-right',
            });

            return ExperiencesActions.deleteExperienceSuccess({ id });
          }),
          catchError((error: HttpErrorResponse) => {
            const messages: Record<number, string> = {
              401: 'No estas autenticado.',
              403: 'No tenés permisos para eliminar una experiencias.',
              404: 'No se encontraron experiencia.',
            };
            const msg = messages[error.status] ?? 'Error inesperado. Intentá nuevamente.';
            return of(
              ExperiencesActions.deleteExperienceFailure({ error: msg, statusCode: error.status })
            );
          })
        )
      )
    ),
  { functional: true }
);

export const reloadAfterStatusEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(
        ExperiencesActions.createExperienceSuccess,
        ExperiencesActions.updateExperienceSuccess,
        ExperiencesActions.moveUpExperienceSuccess,
        ExperiencesActions.moveDownExperienceSuccess,
        ExperiencesActions.deleteExperienceSuccess
      ),
      mergeMap(() => [
        ExperiencesActions.getAll({ paginado: { page: 1, limit: 10 } }),
        ExperiencesActions.getStats(),
      ])
    ),
  { functional: true }
);

export const clearExperienceErrorEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(
        ExperiencesActions.createExperienceFailure,
        ExperiencesActions.updateExperienceFailure,
        ExperiencesActions.moveDownExperienceFailure,
        ExperiencesActions.moveUpExperienceFailure
      ),
      switchMap(() => timer(5000).pipe(map(() => ExperiencesActions.clearError())))
    ),
  { functional: true }
);
