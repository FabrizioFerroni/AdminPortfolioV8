export interface AuditLogsList {
  id: string;
  action: string;
  user: string;
  details: string;
  ip: string;
  module: string;
  date: string;
}

export interface AuditLogsCount {
  login: number;
  created: number;
  updated: number;
  deleted: number;
}
