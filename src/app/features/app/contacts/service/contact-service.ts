import { construirQueryParams } from '@/shared/functions/construirQueryParams';
import { PaginationAuditQuery } from '@/shared/interfaces';
import { ApiResponse } from '@/shared/response';
import { BaseHttpService } from '@/shared/services';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactCount, ContactData, ContactList, UpdateStatusContact } from '../interfaces';

@Injectable()
export class ContactService extends BaseHttpService {
  obtenerTodos(paginado: PaginationAuditQuery): Observable<HttpResponse<ApiResponse<ContactData>>> {
    const params = construirQueryParams(paginado);
    return this.http.get<ApiResponse<ContactData>>(`${this.apiUrl}/contact`, {
      params,
      observe: 'response',
    });
  }

  exportAll(): Observable<HttpResponse<ApiResponse<ContactData>>> {
    return this.http.get<ApiResponse<ContactData>>(`${this.apiUrl}/contact`, {
      params: { page: 1, limit: 100 },
      observe: 'response',
    });
  }

  obtenerPorId(id: string): Observable<HttpResponse<ApiResponse<ContactList>>> {
    return this.http.get<ApiResponse<ContactList>>(`${this.apiUrl}/contact/${id}`, {
      observe: 'response',
    });
  }

  getStats(): Observable<HttpResponse<ApiResponse<ContactCount>>> {
    return this.http.get<ApiResponse<ContactCount>>(`${this.apiUrl}/contact/count`, {
      observe: 'response',
    });
  }

  updateStatusContact(
    id: string,
    data: UpdateStatusContact
  ): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.patch<ApiResponse<string>>(`${this.apiUrl}/contact/status/${id}`, data, {
      observe: 'response',
    });
  }

  deleteContact(id: string): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/contact/${id}`, {
      observe: 'response',
    });
  }
}
