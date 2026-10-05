import { ApiResponse } from '@/shared/response';
import { BaseHttpService } from '@/shared/services';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ClearSession, SessionsData, UpdatePasswordDto } from '../interfaces';
import { UserProfile } from '@/features/auth/response';
import { CVResponse } from '../interfaces/cv.interface';

@Injectable()
export class ProfileService extends BaseHttpService {
  getProfile(): Observable<HttpResponse<ApiResponse<UserProfile>>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.apiUrl}/users/profile`, {
      observe: 'response',
    });
  }

  updateProfile(data: FormData): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.patch<ApiResponse<string>>(`${this.apiUrl}/users/profile`, data, {
      observe: 'response',
    });
  }

  updatePassword(data: UpdatePasswordDto): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.patch<ApiResponse<string>>(`${this.apiUrl}/users/password`, data, {
      observe: 'response',
    });
  }

  getSessions(): Observable<HttpResponse<ApiResponse<SessionsData[]>>> {
    return this.http.get<ApiResponse<SessionsData[]>>(`${this.apiUrl}/sessions`, {
      observe: 'response',
    });
  }

  clearSessionByID(sessionId: string): Observable<HttpResponse<ApiResponse<ClearSession>>> {
    return this.http.delete<ApiResponse<ClearSession>>(`${this.apiUrl}/sessions/${sessionId}`, {
      observe: 'response',
    });
  }

  clearAllSessions(): Observable<HttpResponse<ApiResponse<ClearSession>>> {
    return this.http.delete<ApiResponse<ClearSession>>(`${this.apiUrl}/sessions`, {
      observe: 'response',
    });
  }

  downloadCv(): Observable<{ blob: Blob; filename: string }> {
    return this.http
      .get(`${this.apiUrl}/cv/download`, {
        responseType: 'blob',
        observe: 'response',
        headers: {
          'x-api-key': this.apiKey,
        },
      })
      .pipe(
        map(response => ({
          blob: response.body as Blob,
          filename: this.extractFilename(response.headers.get('content-disposition')),
        }))
      );
  }

  getAdminCV(): Observable<HttpResponse<ApiResponse<CVResponse>>> {
    return this.http.get<ApiResponse<CVResponse>>(`${this.apiUrl}/cv/admin/cv`, {
      observe: 'response',
    });
  }

  getAdminOldsCV(): Observable<HttpResponse<ApiResponse<CVResponse[]>>> {
    return this.http.get<ApiResponse<CVResponse[]>>(`${this.apiUrl}/cv/admin/cv/old`, {
      observe: 'response',
    });
  }

  postCV(data: FormData): Observable<HttpResponse<ApiResponse<string>>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/cv/admin/cv`, data, {
      observe: 'response',
    });
  }

  private extractFilename(header: string | null): string {
    const match = header?.match(/filename="?(.+?)"?$/);
    return match?.[1] ?? 'cv.pdf';
  }
}
