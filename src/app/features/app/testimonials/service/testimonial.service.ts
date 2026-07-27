import { construirQueryParams } from '@/shared/functions/construirQueryParams';
import { PaginacionQuery } from '@/shared/interfaces';
import { ApiResponse } from '@/shared/response';
import { BaseHttpService } from '@/shared/services';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TestimonialCount, TestimonialData, TestimonialList } from '../interface';

@Injectable()
export class TestimonialService extends BaseHttpService {
  obtenerTodos(paginado: PaginacionQuery): Observable<HttpResponse<ApiResponse<TestimonialData>>> {
    const params = construirQueryParams(paginado);
    return this.http.get<ApiResponse<TestimonialData>>(`${this.apiUrl}/testimonials/admin`, {
      params,
      observe: 'response',
    });
  }

  getStats(): Observable<HttpResponse<ApiResponse<TestimonialCount>>> {
    return this.http.get<ApiResponse<TestimonialCount>>(`${this.apiUrl}/testimonials/stats`, {
      observe: 'response',
    });
  }

  obtenerPorId(id: string): Observable<HttpResponse<ApiResponse<TestimonialList | null>>> {
    return this.http.get<ApiResponse<TestimonialList | null>>(`${this.apiUrl}/testimonials/${id}`, {
      observe: 'response',
    });
  }

  postTestimonial(data: FormData): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/testimonials`, data, {
      observe: 'response',
    });
  }

  updateTestimonial(id: string, data: FormData): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.patch<ApiResponse<string>>(`${this.apiUrl}/testimonials/${id}`, data, {
      observe: 'response',
    });
  }

  deleteTestimonial(id: string): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/testimonials/${id}`, {
      observe: 'response',
    });
  }
}
