import { auditsLogsFeature } from './audit-logs.reducer';

export const selectAuditsLogs = auditsLogsFeature.selectAudits;
export const selectAuditLogsLoading = auditsLogsFeature.selectIsLoading;
export const selectAuditLogsError = auditsLogsFeature.selectError;
export const selectSelectedAuditLog = auditsLogsFeature.selectSelected;
export const selectAuditLogsStatusCode = auditsLogsFeature.selectStatusCode;
export const selectAuditLogMeta = auditsLogsFeature.selectMeta;
export const selectAuditLogstats = auditsLogsFeature.selectStats;
export const selectAuditLogstatsLoading = auditsLogsFeature.selectIsLoadingStats;
