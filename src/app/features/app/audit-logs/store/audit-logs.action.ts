import { PaginationAuditQuery } from '@/shared/interfaces';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuditLogsCount, AuditLogsData, AuditLogsList } from '../interfaces';

export const AuditsLogsActions = createActionGroup({
  source: 'AuditsLogs',
  events: {
    // Triggers
    'Get All': props<{ paginado: PaginationAuditQuery }>(),
    'Get By Id': props<{ id: string }>(),
    'Get Stats': emptyProps(),

    // Success
    'Get All Success': props<{ data: AuditLogsData }>(),
    'Get By Id Success': props<{ audit: AuditLogsList }>(),
    'Get Stats Success': props<{ stats: AuditLogsCount }>(),

    // Failure
    'Get All Failure': props<{ error: string; statusCode: number }>(),
    'Get By Id Failure': props<{ error: string; statusCode: number }>(),
    'Get Stats Failure': props<{ error: string; statusCode: number }>(),

    // Misc
    'Clear Error': emptyProps(),
  },
});
