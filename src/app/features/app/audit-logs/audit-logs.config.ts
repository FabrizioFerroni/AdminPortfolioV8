import { EnvironmentProviders, Provider } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { AuditLogsService } from './service/audit-log-service';
import { provideState } from '@ngrx/store';
import * as auditLogEffects from './store/audit-logs.effects';
import { auditsLogsFeature } from './store';
export const auditLogsConfig: (Provider | EnvironmentProviders)[] = [
  AuditLogsService,
  provideState(auditsLogsFeature),
  provideEffects(auditLogEffects),
];
