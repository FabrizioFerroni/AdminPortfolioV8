import { ApiResponse } from '@/shared/response';
import { BaseHttpService } from '@/shared/services';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingList, UpdateSettingDto } from '../interfaces';

@Injectable()
export class SettingsService extends BaseHttpService {
  getSetting(): Observable<HttpResponse<ApiResponse<SettingList>>> {
    return this.http.get<ApiResponse<SettingList>>(`${this.apiUrl}/setting/admin`, {
      observe: 'response',
    });
  }

  updateSetting(data: UpdateSettingDto): Observable<HttpResponse<ApiResponse<SettingList>>> {
    return this.http.patch<ApiResponse<SettingList>>(`${this.apiUrl}/setting`, data, {
      observe: 'response',
    });
  }
}
