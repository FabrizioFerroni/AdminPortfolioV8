import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AnalyticsResponse, DashboardMonthlySummaryDto, DashboardSummaryDto } from '../interfaces';
import { AuditLogsList } from '../../audit-logs/interfaces';
import { AnalyticsRange } from '../enum/analitycrange.enum';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    // Triggers
    'Get Stats': emptyProps(),
    'Get Stats Monthly': emptyProps(),
    'Get Last Five Audits': emptyProps(),
    'Get Analitycs': props<{ range: AnalyticsRange }>(),

    // Success
    'Get Stats Success': props<{ stats: DashboardSummaryDto }>(),
    'Get Stats Monthly Success': props<{ monthly: DashboardMonthlySummaryDto }>(),
    'Get Last Five Audits Success': props<{ audits: AuditLogsList[] }>(),
    'Get Analitys Success': props<{ analitycs: AnalyticsResponse }>(),

    // Failure
    'Get Stats Failure': props<{ error: string; statusCode: number }>(),
    'Get Stats Monthly Failure': props<{ error: string; statusCode: number }>(),
    'Get Last Five Audits Failure': props<{ error: string; statusCode: number }>(),
    'Get Analitycs Failure': props<{ error: string; statusCode: number }>(),

    // Misc
    'Clear Error': emptyProps(),
  },
});
