import { createFeature, createReducer, on } from '@ngrx/store';
import { AuditLogsState } from '../interfaces';
import { AuditsLogsActions } from './audit-logs.action';

const initialState: AuditLogsState = {
  audits: [],
  selected: null,
  meta: null,
  isLoading: false,
  error: null,
  statusCode: null,
  stats: null,
  isLoadingStats: false,
};

export const auditsLogsFeature = createFeature({
  name: 'auditlogs',
  reducer: createReducer(
    initialState,

    on(AuditsLogsActions.getAll, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),

    on(AuditsLogsActions.getAllSuccess, (state, { data }) => ({
      ...state,
      isLoading: false,
      audits: data.audits,
      meta: data.meta,
    })),

    on(AuditsLogsActions.getAllFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      error,
      statusCode,
    })),

    on(AuditsLogsActions.getByIdSuccess, (state, { audit }) => ({
      ...state,
      selected: audit,
    })),

    on(AuditsLogsActions.getByIdFailure, (state, { error, statusCode }) => ({
      ...state,
      error,
      statusCode,
    })),

    on(AuditsLogsActions.clearError, state => ({
      ...state,
      error: null,
      statusCode: null,
    })),

    on(AuditsLogsActions.getStats, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
      isLoadingStats: true,
    })),

    on(AuditsLogsActions.getStatsSuccess, (state, { stats }) => ({
      ...state,
      isLoading: false,
      isLoadingStats: false,
      stats,
    })),

    on(AuditsLogsActions.getStatsFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      isLoadingStats: false,
      error,
      statusCode,
    }))
  ),
});
