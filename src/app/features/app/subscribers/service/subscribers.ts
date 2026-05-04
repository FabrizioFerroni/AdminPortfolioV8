import { PaginacionQuery } from '@/shared/interfaces';
import { ApiResponse } from '@/shared/response';
import { BaseHttpService } from '@/shared/services';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriberCount, SubscribersData } from '../interfaces';
import { construirQueryParams } from '@/shared/functions/construirQueryParams';

@Injectable()
export class SubscribersService extends BaseHttpService {
  obtenerTodos(paginado: PaginacionQuery): Observable<HttpResponse<ApiResponse<SubscribersData>>> {
    const params = construirQueryParams(paginado);
    return this.http.get<ApiResponse<SubscribersData>>(`${this.apiUrl}/subscribers`, {
      params,
      observe: 'response',
    });
  }

  exportAll(): Observable<HttpResponse<ApiResponse<SubscribersData>>> {
    return this.http.get<ApiResponse<SubscribersData>>(`${this.apiUrl}/subscribers`, {
      params: { page: 1, limit: 100 },
      observe: 'response',
    });
  }

  getStats(): Observable<HttpResponse<ApiResponse<SubscriberCount>>> {
    return this.http.get<ApiResponse<SubscriberCount>>(`${this.apiUrl}/subscribers/count`, {
      observe: 'response',
    });
  }

  deleteSubscriber(email: string): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/subscribers/${email}`, {
      observe: 'response',
    });
  }
}
