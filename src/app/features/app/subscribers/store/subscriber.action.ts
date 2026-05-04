import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SubscriberCount, SubscriberList, SubscribersData } from '../interfaces';
import { PaginacionQuery } from '@/shared/interfaces';

export const SubscribersActions = createActionGroup({
  source: 'Subscribers',
  events: {
    // Triggers
    'Get All': props<{ paginado: PaginacionQuery }>(),
    'Get By Id': props<{ id: string }>(),

    // Success
    'Get All Success': props<{ data: SubscribersData }>(),
    'Get By Id Success': props<{ subscriber: SubscriberList }>(),

    // Failure
    'Get All Failure': props<{ error: string; statusCode: number }>(),
    'Get By Id Failure': props<{ error: string; statusCode: number }>(),

    // Triggers
    Delete: props<{ email: string }>(),

    // Success
    'Delete Success': props<{ email: string }>(),

    // Failure
    'Delete Failure': props<{ error: string; statusCode: number }>(),

    // Misc
    'Clear Error': emptyProps(),

    // Triggers
    'Get Stats': emptyProps(),

    // Success
    'Get Stats Success': props<{ stats: SubscriberCount }>(),

    // Failure
    'Get Stats Failure': props<{ error: string; statusCode: number }>(),
  },
});
