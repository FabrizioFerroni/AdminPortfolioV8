import { construirQueryParams } from '@/shared/functions/construirQueryParams';
import { PaginationAuditQuery } from '@/shared/interfaces';
import { ApiResponse } from '@/shared/response';
import { BaseHttpService } from '@/shared/services';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditLogsCount, AuditLogsData, AuditLogsList } from '../interfaces';

@Injectable()
export class AuditLogsService extends BaseHttpService {
  obtenerTodos(
    paginado: PaginationAuditQuery
  ): Observable<HttpResponse<ApiResponse<AuditLogsData>>> {
    const params = construirQueryParams(paginado);
    return this.http.get<ApiResponse<AuditLogsData>>(`${this.apiUrl}/audits`, {
      params,
      observe: 'response',
    });
  }

  exportAll(): Observable<HttpResponse<ApiResponse<AuditLogsData>>> {
    return this.http.get<ApiResponse<AuditLogsData>>(`${this.apiUrl}/audits`, {
      params: { page: 1, limit: 100 },
      observe: 'response',
    });
  }

  obtenerPorId(id: string): Observable<HttpResponse<ApiResponse<AuditLogsList>>> {
    return this.http.get<ApiResponse<AuditLogsList>>(`${this.apiUrl}/audits/${id}`, {
      observe: 'response',
    });
  }

  getStats(): Observable<HttpResponse<ApiResponse<AuditLogsCount>>> {
    return this.http.get<ApiResponse<AuditLogsCount>>(`${this.apiUrl}/audits/count`, {
      observe: 'response',
    });
  }
}
