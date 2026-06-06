import { createFeature, createReducer, on } from '@ngrx/store';
import { DashboardState } from '../interfaces';
import { DashboardActions } from './dashboard.action';

const initialState: DashboardState = {
  isLoadingStatsPrincipal: false,
  errorStatsPrincipal: null,
  statusCodeStatsPrincipal: null,
  statsPrincipal: null,
  //----------------------------//
  statsMonthly: null,
  isLoadingStatsMonthly: false,
  errorStatsMonthly: null,
  statusCodeStatsMonthly: null,
  //----------------------------//
  audits: null,
  isLoadingAudits: false,
  errorAudits: null,
  statusCodeAudits: null,
  //----------------------------//
  analitycs: null,
  isLoadingAnalitics: false,
  errorAnalitycs: null,
  statusCodeAnalitycs: null,
};

export const dashboardFeature = createFeature({
  name: 'dashboard',
  reducer: createReducer(
    initialState,
    on(DashboardActions.getStats, state => ({
      ...state,
      isLoadingStatsPrincipal: true,
      errorStatsPrincipal: null,
      statusCodeStatsPrincipal: null,
      statsPrincipal: null,
    })),

    on(DashboardActions.getStatsSuccess, (state, { stats }) => ({
      ...state,
      isLoadingStatsPrincipal: false,
      statsPrincipal: stats,
    })),

    on(DashboardActions.getStatsFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoadingStatsPrincipal: false,
      errorStatsPrincipal: error,
      statusCodeStatsPrincipal: statusCode,
      statsPrincipal: null,
    })),

    on(DashboardActions.getStatsMonthly, state => ({
      ...state,
      isLoadingStatsMonthly: true,
      errorStatsMonthly: null,
      statusCodeStatsMonthly: null,
      statsMonthly: null,
    })),

    on(DashboardActions.getStatsMonthlySuccess, (state, { monthly }) => ({
      ...state,
      isLoadingStatsMonthly: false,
      statsMonthly: monthly,
    })),

    on(DashboardActions.getStatsMonthlyFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoadingStatsMonthly: false,
      errorStatsMonthly: error,
      statusCodeStatsMonthly: statusCode,
      statsMonthly: null,
    })),

    on(DashboardActions.getLastFiveAudits, state => ({
      ...state,
      isLoadingAudits: true,
      errorAudits: null,
      statusCodeAudits: null,
      audits: null,
    })),

    on(DashboardActions.getLastFiveAuditsSuccess, (state, { audits }) => ({
      ...state,
      isLoadingAudits: false,
      audits: audits,
    })),

    on(DashboardActions.getLastFiveAuditsFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoadingStatsMonisLoadingAuditsthly: false,
      errorAudits: error,
      statusCodeAudits: statusCode,
      audits: null,
    })),

    on(DashboardActions.getAnalitycs, state => ({
      ...state,
      isLoadingAnalitics: true,
      errorAnalitycs: null,
      statusCodeAnalitycs: null,
      analitycs: null,
    })),

    on(DashboardActions.getAnalitysSuccess, (state, { analitycs }) => ({
      ...state,
      isLoadingAnalitics: false,
      analitycs,
    })),

    on(DashboardActions.getAnalitycsFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoadingAnalitics: false,
      errorAnalitycs: error,
      statusCodeAnalitycs: statusCode,
      analitycs: null,
    }))
  ),
});
