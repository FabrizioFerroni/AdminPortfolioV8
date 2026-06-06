import { dashboardFeature } from './dashboard.reducer';

export const isLoadingStatsDashboard = dashboardFeature.selectIsLoadingStatsPrincipal;
export const statsPrincipalDashboard = dashboardFeature.selectStatsPrincipal;
export const errorStatsDashboard = dashboardFeature.selectErrorStatsPrincipal;
export const statusCodeDashboard = dashboardFeature.selectStatusCodeStatsPrincipal;
export const dashboardState = dashboardFeature.selectDashboardState;

//Monthly
export const isLoadingStatsMonthlyDashboard = dashboardFeature.selectIsLoadingStatsMonthly;
export const statsMonthlyDashboard = dashboardFeature.selectStatsMonthly;
export const errorStatsMonthlyDashboard = dashboardFeature.selectErrorStatsMonthly;
export const statusCodeStatsMonthlyDashboard = dashboardFeature.selectStatusCodeStatsMonthly;

//Audits
export const isLoadingAuditsDashboard = dashboardFeature.selectIsLoadingAudits;
export const auditsDashboard = dashboardFeature.selectAudits;
export const errorAudits = dashboardFeature.selectErrorAudits;
export const statusCodeAuditsDashboard = dashboardFeature.selectStatusCodeAudits;

//Analitycs
export const isLoadingAnalitics = dashboardFeature.selectIsLoadingAnalitics;
export const analitycsDashboard = dashboardFeature.selectAnalitycs;
export const errorAnalitycs = dashboardFeature.selectErrorAnalitycs;
export const statusCodeAnalitycs = dashboardFeature.selectStatusCodeAnalitycs;
