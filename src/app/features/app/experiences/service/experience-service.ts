import { construirQueryParams } from '@/shared/functions/construirQueryParams';
import { PaginacionQuery } from '@/shared/interfaces';
import { ApiResponse } from '@/shared/response';
import { BaseHttpService } from '@/shared/services';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExperienceData } from '../interfaces/experience-state.interface';
import {
  CreateExperienceDto,
  ExperienceCount,
  ExperienceList,
  UpdateExperienceDto,
} from '../interfaces';

@Injectable()
export class ExperienceService extends BaseHttpService {
  obtenerTodos(paginado: PaginacionQuery): Observable<HttpResponse<ApiResponse<ExperienceData>>> {
    const params = construirQueryParams(paginado);
    return this.http.get<ApiResponse<ExperienceData>>(`${this.apiUrl}/experiences`, {
      params,
      observe: 'response',
    });
  }

  exportAll(): Observable<HttpResponse<ApiResponse<ExperienceData>>> {
    return this.http.get<ApiResponse<ExperienceData>>(`${this.apiUrl}/experiences`, {
      params: { page: 1, limit: 100 },
      observe: 'response',
    });
  }

  obtenerPorId(id: string): Observable<HttpResponse<ApiResponse<ExperienceList>>> {
    return this.http.get<ApiResponse<ExperienceList>>(`${this.apiUrl}/experiences/${id}`, {
      observe: 'response',
    });
  }

  getStats(): Observable<HttpResponse<ApiResponse<ExperienceCount>>> {
    return this.http.get<ApiResponse<ExperienceCount>>(`${this.apiUrl}/experiences/count`, {
      observe: 'response',
    });
  }

  createExperience(data: CreateExperienceDto): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/experiences`, data, {
      observe: 'response',
    });
  }

  updateExperience(
    id: string,
    data: UpdateExperienceDto
  ): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.patch<ApiResponse<string>>(`${this.apiUrl}/experiences/${id}`, data, {
      observe: 'response',
    });
  }

  moveUpDisplayOrder(id: string): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.patch<ApiResponse<string>>(
      `${this.apiUrl}/experiences/${id}/move-up`,
      {},
      {
        observe: 'response',
      }
    );
  }

  moveDownDisplayOrder(id: string): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.patch<ApiResponse<string>>(
      `${this.apiUrl}/experiences/${id}/move-down`,
      {},
      {
        observe: 'response',
      }
    );
  }

  deleteExperience(id: string): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/experiences/${id}`, {
      observe: 'response',
    });
  }
}
