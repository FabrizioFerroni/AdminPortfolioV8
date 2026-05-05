import { Pagination } from '@/shared/interfaces';
import { AuditLogsCount, AuditLogsList } from './audit-logs.interface';

export interface AuditLogsState {
  audits: AuditLogsList[];
  selected: AuditLogsList | null;
  meta: Pagination | null;
  isLoading: boolean;
  error: string | null;
  statusCode: number | null;
  stats: AuditLogsCount | null;
  isLoadingStats: boolean;
}

export interface AuditLogsData {
  audits: AuditLogsList[];
  meta: Pagination;
}
