import { BaseHttpService } from '@/shared/services';
import { Injectable } from '@angular/core';
import { AuditLogsData } from '../../audit-logs/interfaces';
import { PaginationAuditQuery } from '@/shared/interfaces';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ApiResponse } from '@/shared/response';
import { construirQueryParams } from '@/shared/functions/construirQueryParams';

@Injectable()
export class DashboardService extends BaseHttpService {
  obtenerRecientes(): Observable<HttpResponse<ApiResponse<AuditLogsData>>> {
    const paginado: PaginationAuditQuery = {
      page: 1,
      limit: 10,
    };
    const params = construirQueryParams(paginado);
    return this.http.get<ApiResponse<AuditLogsData>>(`${this.apiUrl}/audits`, {
      params,
      observe: 'response',
    });
  }
}
