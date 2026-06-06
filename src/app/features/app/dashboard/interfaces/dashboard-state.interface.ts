import { AuditLogsList } from '../../audit-logs/interfaces';
import {
  AnalyticsResponse,
  DashboardMonthlySummaryDto,
  DashboardSummaryDto,
} from './dashboard.interface';

export interface DashboardState {
  isLoadingStatsPrincipal: boolean;
  errorStatsPrincipal: string | null;
  statusCodeStatsPrincipal: number | null;
  statsPrincipal: DashboardSummaryDto | null;
  //-----------------------------------//
  statsMonthly: DashboardMonthlySummaryDto | null;
  isLoadingStatsMonthly: boolean;
  errorStatsMonthly: string | null;
  statusCodeStatsMonthly: number | null;
  //-----------------------------------//
  audits: AuditLogsList[] | null;
  isLoadingAudits: boolean;
  errorAudits: string | null;
  statusCodeAudits: number | null;
  //-----------------------------------//
  analitycs: AnalyticsResponse | null;
  isLoadingAnalitics: boolean;
  errorAnalitycs: string | null;
  statusCodeAnalitycs: number | null;
}
