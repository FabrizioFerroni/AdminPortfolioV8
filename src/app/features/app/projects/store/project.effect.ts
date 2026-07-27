import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProjectService } from '../service';
import { catchError, from, map, mergeMap, of, switchMap, tap, timer } from 'rxjs';
import { ProjectsActions } from './project.action';
import { HandledError } from '@/shared/interfaces/error-response.interface';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { Rutas } from '@/shared/utils';

export const getAllProjectsEffect = createEffect(
  (actions$ = inject(Actions), projectService = inject(ProjectService)) =>
    actions$.pipe(
      ofType(ProjectsActions.getAll),
      switchMap(({ paginado }) =>
        projectService.obtenerTodos(paginado).pipe(
          map(({ body }) => ProjectsActions.getAllSuccess({ data: body!.data })),
          catchError((error: HandledError) => {
            return of(
              ProjectsActions.getAllFailure({
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

export const getProjectsStatsEffect = createEffect(
  (actions$ = inject(Actions), projectService = inject(ProjectService)) =>
    actions$.pipe(
      ofType(ProjectsActions.getStats),
      switchMap(() =>
        projectService.getStats().pipe(
          map(({ body }) => ProjectsActions.getStatsSuccess({ stats: body!.data })),
          catchError((error: HandledError) => {
            return of(
              ProjectsActions.getStatsFailure({
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

export const getProjectsSelectEffect = createEffect(
  (actions$ = inject(Actions), projectService = inject(ProjectService)) =>
    actions$.pipe(
      ofType(ProjectsActions.getProjectSelect),
      switchMap(() =>
        projectService.getProjectsSelect().pipe(
          map(({ body }) => ProjectsActions.getProjectSelectSuccess({ select: body!.data })),
          catchError((error: HandledError) => {
            return of(
              ProjectsActions.getProjectSelectFailure({
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

export const getProjectByIdEffect = createEffect(
  (actions$ = inject(Actions), projectService = inject(ProjectService)) =>
    actions$.pipe(
      ofType(ProjectsActions.getById),
      switchMap(({ id }) =>
        projectService.obtenerPorId(id).pipe(
          map(({ body }) => ProjectsActions.getByIdSuccess({ project: body!.data })),
          catchError((error: HandledError) => {
            return of(
              ProjectsActions.getByIdFailure({
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

export const getImageProjectsByProjectIdEffect = createEffect(
  (actions$ = inject(Actions), projectService = inject(ProjectService)) =>
    actions$.pipe(
      ofType(ProjectsActions.getImagesByProjectId),
      switchMap(({ projectId }) =>
        projectService.obtenerImagenesPorProjectId(projectId).pipe(
          map(({ body }) => ProjectsActions.getImagesByProjectIdSuccess({ images: body!.data })),
          catchError((error: HandledError) => {
            return of(
              ProjectsActions.getImagesByProjectIdFailure({
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

export const createNewProjectEffect = createEffect(
  (actions$ = inject(Actions), projectService = inject(ProjectService), router = inject(Router)) =>
    actions$.pipe(
      ofType(ProjectsActions.createProject),
      switchMap(({ data }) =>
        projectService.postProject(data).pipe(
          switchMap(({ body }) =>
            from(router.navigateByUrl(`${Rutas.PROJECTS}`)).pipe(
              tap(() => {
                toast.success('Éxito', {
                  description: `${body!.data}`,
                  position: 'top-right',
                });
              }),
              map(() => ProjectsActions.createProjectSuccess())
            )
          ),
          catchError((error: HandledError) => {
            return of(
              ProjectsActions.createProjectFailure({
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

export const createImageProjectEffect = createEffect(
  (actions$ = inject(Actions), projectService = inject(ProjectService)) =>
    actions$.pipe(
      ofType(ProjectsActions.createProjectImage),
      switchMap(({ data }) =>
        projectService.postProjectImage(data).pipe(
          mergeMap(({ body }) => {
            toast.success('Éxito', {
              description: `${body!.message}`,
              position: 'top-right',
            });

            return [
              ProjectsActions.createProjectImageSuccess(),
              ProjectsActions.getImagesByProjectId({ projectId: data.get('projectId') as string }),
            ];
          }),
          catchError((error: HandledError) =>
            of(
              ProjectsActions.createProjectImageFailure({
                error: error.message,
                statusCode: error.statusCode,
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

export const deleteImageProjectEffect = createEffect(
  (actions$ = inject(Actions), projectService = inject(ProjectService)) =>
    actions$.pipe(
      ofType(ProjectsActions.deleteProjectImage),
      switchMap(({ id, projectId }) =>
        projectService.deleteProjectImage(id).pipe(
          mergeMap(({ body }) => {
            toast.success('Éxito', {
              description: `${body!.message}`,
              position: 'top-right',
            });

            return [
              ProjectsActions.deleteProjectImageSuccess({ id }),
              ProjectsActions.getImagesByProjectId({ projectId: projectId }),
            ];
          }),
          catchError((error: HandledError) =>
            of(
              ProjectsActions.deleteProjectImageFailure({
                error: error.message,
                statusCode: error.statusCode,
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

export const deleteImageProjectAllEffect = createEffect(
  (actions$ = inject(Actions), projectService = inject(ProjectService)) =>
    actions$.pipe(
      ofType(ProjectsActions.deleteProjectImageAll),
      switchMap(({ projectId }) =>
        projectService.deleteAllProjectImage(projectId).pipe(
          mergeMap(({ body }) => {
            toast.success('Éxito', {
              description: `${body!.message}`,
              position: 'top-right',
            });

            return [
              ProjectsActions.deleteProjectImageAllSuccess({ projectId: projectId }),
              ProjectsActions.getImagesByProjectId({ projectId: projectId }),
            ];
          }),
          catchError((error: HandledError) =>
            of(
              ProjectsActions.deleteProjectImageAllFailure({
                error: error.message,
                statusCode: error.statusCode,
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

export const updateProjectEffect = createEffect(
  (actions$ = inject(Actions), projectService = inject(ProjectService), router = inject(Router)) =>
    actions$.pipe(
      ofType(ProjectsActions.updateProject),
      switchMap(({ id, data }) =>
        projectService.updateProject(id, data).pipe(
          switchMap(({ body }) =>
            from(router.navigateByUrl(`${Rutas.PROJECTS}`)).pipe(
              tap(() => {
                toast.success('Éxito', {
                  description: `${body!.data}`,
                  position: 'top-right',
                });
              }),
              map(() => ProjectsActions.updateProjectSuccess())
            )
          ),
          catchError((error: HandledError) => {
            return of(
              ProjectsActions.updateProjectFailure({
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

export const deleteProjectEffect = createEffect(
  (actions$ = inject(Actions), projectService = inject(ProjectService)) =>
    actions$.pipe(
      ofType(ProjectsActions.deleteProject),
      switchMap(({ id }) =>
        projectService.deleteProject(id).pipe(
          map(({ body }) => {
            toast.success('Éxito', {
              description: `${body!.data}`,
              position: 'top-right',
            });

            return ProjectsActions.deleteProjectSuccess({ id });
          }),
          catchError((error: HandledError) => {
            return of(
              ProjectsActions.deleteProjectFailure({
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

export const reloadAfterProjectEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(
        ProjectsActions.createProjectSuccess,
        ProjectsActions.updateProjectSuccess,
        ProjectsActions.deleteProjectSuccess
      ),
      mergeMap(() => [
        ProjectsActions.getAll({ paginado: { page: 1, limit: 10 } }),
        ProjectsActions.getStats(),
      ])
    ),
  { functional: true }
);

export const clearErrorFormSettingEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(ProjectsActions.createProjectFailure),
      switchMap(() => timer(5000).pipe(map(() => ProjectsActions.clearError())))
    ),
  { functional: true }
);
