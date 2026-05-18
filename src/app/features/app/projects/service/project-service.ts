import { construirQueryParams } from '@/shared/functions/construirQueryParams';
import { PaginacionQuery } from '@/shared/interfaces';
import { ApiResponse } from '@/shared/response';
import { BaseHttpService } from '@/shared/services';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectCount, ProjectData, ProjectImageList, ProjectList } from '../interfaces';

@Injectable()
export class ProjectService extends BaseHttpService {
  obtenerTodos(paginado: PaginacionQuery): Observable<HttpResponse<ApiResponse<ProjectData>>> {
    const params = construirQueryParams(paginado);
    return this.http.get<ApiResponse<ProjectData>>(`${this.apiUrl}/projects/admin`, {
      params,
      observe: 'response',
    });
  }

  obtenerPorId(id: string): Observable<HttpResponse<ApiResponse<ProjectList | null>>> {
    return this.http.get<ApiResponse<ProjectList | null>>(`${this.apiUrl}/projects/p/${id}`, {
      observe: 'response',
    });
  }

  obtenerImagenesPorProjectId(
    projectId: string
  ): Observable<HttpResponse<ApiResponse<ProjectImageList[]>>> {
    return this.http.get<ApiResponse<ProjectImageList[]>>(
      `${this.apiUrl}/images/admin/${projectId}`,
      {
        observe: 'response',
      }
    );
  }

  getStats(): Observable<HttpResponse<ApiResponse<ProjectCount>>> {
    return this.http.get<ApiResponse<ProjectCount>>(`${this.apiUrl}/projects/stats`, {
      observe: 'response',
    });
  }

  postProject(data: FormData): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/projects`, data, {
      observe: 'response',
    });
  }

  postProjectImage(data: FormData): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/images`, data, {
      observe: 'response',
    });
  }

  updateProject(id: string, data: FormData): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.patch<ApiResponse<string>>(`${this.apiUrl}/projects/${id}`, data, {
      observe: 'response',
    });
  }

  deleteProject(id: string): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/projects/${id}`, {
      observe: 'response',
    });
  }

  deleteProjectImage(id: string): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/images/${id}`, {
      observe: 'response',
    });
  }

  deleteAllProjectImage(projectId: string): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/images/all/${projectId}`, {
      observe: 'response',
    });
  }
}
