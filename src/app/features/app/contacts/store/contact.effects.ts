import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ContactService } from '../service/contact-service';
import { ContactsActions } from './contact.action';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ApiResponse } from '@/shared/response';
import { ContactList } from '../interfaces';
import { toast } from 'ngx-sonner';

export const getAllContactsEffect = createEffect(
  (actions$ = inject(Actions), contactService = inject(ContactService)) =>
    actions$.pipe(
      ofType(ContactsActions.getAll),
      switchMap(({ paginado }) =>
        contactService.obtenerTodos(paginado).pipe(
          map(({ body }) => ContactsActions.getAllSuccess({ data: body!.data })),
          catchError((error: HttpErrorResponse) => {
            const messages: Record<number, string> = {
              403: 'No tenés permisos para ver los contactos.',
              404: 'No se encontraron contactos.',
            };
            const msg = messages[error.status] ?? 'Error inesperado. Intentá nuevamente.';
            return of(ContactsActions.getAllFailure({ error: msg, statusCode: error.status }));
          })
        )
      )
    ),
  { functional: true }
);

export const getContactByIdEffect = createEffect(
  (actions$ = inject(Actions), contactService = inject(ContactService)) =>
    actions$.pipe(
      ofType(ContactsActions.getById),
      switchMap(({ id }) =>
        contactService.obtenerPorId(id).pipe(
          map(({ body }: HttpResponse<ApiResponse<ContactList>>) => {
            return ContactsActions.getByIdSuccess({ contact: body!.data });
          }),
          catchError((error: HttpErrorResponse) => {
            const messages: Record<number, string> = {
              403: 'No tenés permisos para eliminar suscriptores.',
              404: 'El suscriptor no fue encontrado.',
            };
            const msg = messages[error.status] ?? 'Error inesperado. Intentá nuevamente.';
            return of(ContactsActions.getByIdFailure({ error: msg, statusCode: error.status }));
          })
        )
      )
    ),
  { functional: true }
);

export const getContactsStatsEffect = createEffect(
  (actions$ = inject(Actions), contactService = inject(ContactService)) =>
    actions$.pipe(
      ofType(ContactsActions.getStats),
      switchMap(() =>
        contactService.getStats().pipe(
          map(({ body }) => ContactsActions.getStatsSuccess({ stats: body!.data })),
          catchError((error: HttpErrorResponse) => {
            const messages: Record<number, string> = {
              403: 'No tenés permisos para ver las estadísticas.',
            };
            const msg = messages[error.status] ?? 'Error inesperado. Intentá nuevamente.';
            return of(ContactsActions.getStatsFailure({ error: msg, statusCode: error.status }));
          })
        )
      )
    ),
  { functional: true }
);

export const updateStatusContactEffect = createEffect(
  (actions$ = inject(Actions), contactService = inject(ContactService)) =>
    actions$.pipe(
      ofType(ContactsActions.updateStatus),
      switchMap(({ id, data }) =>
        contactService.updateStatusContact(id, data).pipe(
          map(({ body }: HttpResponse<ApiResponse<string>>) => {
            toast.success('Éxito', {
              description: `${body!.data}`,
              position: 'top-right',
            });

            return ContactsActions.updateStatusSuccess({
              message: body!.data,
              id,
              status: data.status,
            });
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
            return of(
              ContactsActions.updateStatusFailure({ error: msg, statusCode: error.status })
            );
          })
        )
      )
    ),
  { functional: true }
);

export const deleteContactEffect = createEffect(
  (actions$ = inject(Actions), contactService = inject(ContactService)) =>
    actions$.pipe(
      ofType(ContactsActions.delete),
      switchMap(({ id }) =>
        contactService.deleteContact(id).pipe(
          map(({ body }: HttpResponse<ApiResponse<string>>) => {
            toast.success('Éxito', {
              description: `${body!.data}`,
              position: 'top-right',
            });

            return ContactsActions.deleteSuccess({ id });
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
            return of(ContactsActions.deleteFailure({ error: msg, statusCode: error.status }));
          })
        )
      )
    ),
  { functional: true }
);

export const reloadAfterUpdateStatusEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(ContactsActions.updateStatusSuccess, ContactsActions.deleteSuccess),
      mergeMap(() => [
        ContactsActions.getAll({ paginado: { page: 1, limit: 10 } }),
        ContactsActions.getStats(),
      ])
    ),
  { functional: true }
);
