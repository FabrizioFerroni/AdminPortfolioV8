import { ApiResponse } from '@/shared/response';
import { BaseHttpService } from '@/shared/services';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdatePasswordDto } from '../interfaces';
import { UserProfile } from '@/features/auth/response';

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
}
