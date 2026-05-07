import { PaginationAuditQuery } from '@/shared/interfaces';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ContactCount, ContactData, ContactList, UpdateStatusContact } from '../interfaces';

export const ContactsActions = createActionGroup({
  source: 'Contacts',
  events: {
    // Triggers
    'Get All': props<{ paginado: PaginationAuditQuery }>(),
    'Get By Id': props<{ id: string }>(),
    'Get Stats': emptyProps(),
    'Update Status': props<{ id: string; data: UpdateStatusContact }>(),
    Delete: props<{ id: string }>(),

    // Success
    'Get All Success': props<{ data: ContactData }>(),
    'Get By Id Success': props<{ contact: ContactList }>(),
    'Get Stats Success': props<{ stats: ContactCount }>(),
    'Update Status Success': props<{ message: string; id: string; status: string }>(),
    'Delete Success': props<{ id: string }>(),

    // Failure
    'Get All Failure': props<{ error: string; statusCode: number }>(),
    'Get By Id Failure': props<{ error: string; statusCode: number }>(),
    'Get Stats Failure': props<{ error: string; statusCode: number }>(),
    'Update Status Failure': props<{ error: string; statusCode: number }>(),
    'Delete Failure': props<{ error: string; statusCode: number }>(),

    // Misc
    'Clear Error': emptyProps(),
  },
});
