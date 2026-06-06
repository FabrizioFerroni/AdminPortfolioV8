import { BaseHttpService } from '@/shared/services';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ApiResponse } from '@/shared/response';
import { AnalyticsResponse, DashboardMonthlySummaryDto, DashboardSummaryDto } from '../interfaces';
import { AuditLogsList } from '../../audit-logs/interfaces';
import { AnalyticsRange } from '../enum/analitycrange.enum';

@Injectable()
export class DashboardService extends BaseHttpService {
  getStatsCompleted(): Observable<HttpResponse<ApiResponse<DashboardSummaryDto>>> {
    return this.http.get<ApiResponse<DashboardSummaryDto>>(`${this.apiUrl}/dashboard/stats`, {
      observe: 'response',
    });
  }

  getStatsMonthlyCompleted(): Observable<HttpResponse<ApiResponse<DashboardMonthlySummaryDto>>> {
    return this.http.get<ApiResponse<DashboardMonthlySummaryDto>>(
      `${this.apiUrl}/dashboard/stats/monthly`,
      {
        observe: 'response',
      }
    );
  }

  getLastFiveAudits(): Observable<HttpResponse<ApiResponse<AuditLogsList[]>>> {
    return this.http.get<ApiResponse<AuditLogsList[]>>(`${this.apiUrl}/audits/dashboard`, {
      observe: 'response',
    });
  }

  getPortfolioViews(
    range: AnalyticsRange
  ): Observable<HttpResponse<ApiResponse<AnalyticsResponse>>> {
    return this.http.get<ApiResponse<AnalyticsResponse>>(`${this.apiUrl}/analytics/${range}`, {
      observe: 'response',
    });
  }
}
