import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TestimonialService } from '../service';
import { TestimonialsActions } from './testimonial.actions';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';
import { HandledError } from '@/shared/interfaces/error-response.interface';
import { Rutas } from '@/shared/utils';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';

export const getAllTestimonialsEffect = createEffect(
  (actions$ = inject(Actions), testimonialService = inject(TestimonialService)) =>
    actions$.pipe(
      ofType(TestimonialsActions.getAllTestimonials),
      switchMap(({ paginado }) =>
        testimonialService.obtenerTodos(paginado).pipe(
          map(({ body }) => TestimonialsActions.getAllTestimonialsSuccess({ data: body!.data })),
          catchError((error: HandledError) => {
            return of(
              TestimonialsActions.getAllTestimonialsFailure({
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

export const getTestimonialsStatsEffect = createEffect(
  (actions$ = inject(Actions), testimonialService = inject(TestimonialService)) =>
    actions$.pipe(
      ofType(TestimonialsActions.getTestimonialsStats),
      switchMap(() =>
        testimonialService.getStats().pipe(
          map(({ body }) => TestimonialsActions.getTestimonialsStatsSuccess({ stats: body!.data })),
          catchError((error: HandledError) => {
            return of(
              TestimonialsActions.getTestimonialsStatsFailure({
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

export const getTestimonialByIdEffect = createEffect(
  (actions$ = inject(Actions), testimonialService = inject(TestimonialService)) =>
    actions$.pipe(
      ofType(TestimonialsActions.getTestimonialById),
      switchMap(({ id }) =>
        testimonialService.obtenerPorId(id).pipe(
          map(({ body }) =>
            TestimonialsActions.getTestimonialByIdSuccess({ testimonial: body!.data })
          ),
          catchError((error: HandledError) => {
            return of(
              TestimonialsActions.getTestimonialByIdFailure({
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

export const createNewTestimonialEffect = createEffect(
  (
    actions$ = inject(Actions),
    testimonialService = inject(TestimonialService),
    router = inject(Router)
  ) =>
    actions$.pipe(
      ofType(TestimonialsActions.createTestimonial),
      switchMap(({ data }) =>
        testimonialService.postTestimonial(data).pipe(
          switchMap(({ body }) =>
            from(router.navigateByUrl(`${Rutas.TESTIMONIALS}`)).pipe(
              tap(() => {
                toast.success('Éxito', {
                  description: `${body!.data}`,
                  position: 'top-right',
                });
              }),
              map(() => TestimonialsActions.createTestimonialSuccess())
            )
          ),
          catchError((error: HandledError) => {
            return of(
              TestimonialsActions.createTestimonialFailure({
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

export const updateTestimonialEffect = createEffect(
  (
    actions$ = inject(Actions),
    testimonialService = inject(TestimonialService),
    router = inject(Router)
  ) =>
    actions$.pipe(
      ofType(TestimonialsActions.updateTestimonial),
      switchMap(({ id, data }) =>
        testimonialService.updateTestimonial(id, data).pipe(
          switchMap(({ body }) =>
            from(router.navigateByUrl(`${Rutas.TESTIMONIALS}`)).pipe(
              tap(() => {
                toast.success('Éxito', {
                  description: `${body!.data}`,
                  position: 'top-right',
                });
              }),
              map(() => TestimonialsActions.updateTestimonialSuccess())
            )
          ),
          catchError((error: HandledError) => {
            return of(
              TestimonialsActions.updateTestimonialFailure({
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

export const deleteTestimonialEffect = createEffect(
  (actions$ = inject(Actions), testimonialService = inject(TestimonialService)) =>
    actions$.pipe(
      ofType(TestimonialsActions.deleteTestimonial),
      switchMap(({ id }) =>
        testimonialService.deleteTestimonial(id).pipe(
          map(({ body }) => {
            toast.success('Éxito', {
              description: `${body!.data}`,
              position: 'top-right',
            });

            return TestimonialsActions.deleteTestimonialSuccess({ id });
          }),
          catchError((error: HandledError) => {
            return of(
              TestimonialsActions.deleteTestimonialFailure({
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
