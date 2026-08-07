import { cifrateData } from '@/shared/functions';
import { BaseHttpService, TokenService } from '@/shared/services';
import { inject, Injectable } from '@angular/core';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { LoginResponse, ProfileResponse, RefreshResponse } from '../response';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IChangePassword, IForgotPassword, ILogin, IValidateUser } from '../interfaces';
import { ApiResponse } from '@/shared/response';

@Injectable()
export class AuthService extends BaseHttpService {
  private readonly tokenService = inject(TokenService);

  login(body: ILogin, rememberMe: boolean): Observable<LoginResponse> {
    return from(cifrateData(this.publicKey, body)).pipe(
      switchMap(userEncrypt => {
        const headers = new HttpHeaders().set('basic', userEncrypt);
        return this.http.post<LoginResponse>(`${this.authUrl}/login`, { rememberMe }, { headers });
      })
    );
  }

  verify(body: IValidateUser): Observable<ApiResponse<string>> {
    return from(cifrateData(this.publicKey, body)).pipe(
      switchMap(userEncrypt => {
        const headers = new HttpHeaders().set('basic', userEncrypt);
        return this.http.post<ApiResponse<string>>(
          `${this.authUrl}/verificar/${body.token}`,
          {},
          { headers }
        );
      })
    );
  }

  forgot_password(body: IForgotPassword): Observable<ApiResponse<string>> {
    return from(cifrateData(this.publicKey, body)).pipe(
      switchMap(userEncrypt => {
        const headers = new HttpHeaders().set('basic', userEncrypt);
        return this.http.post<ApiResponse<string>>(`${this.authUrl}/olvide-clave`, {}, { headers });
      })
    );
  }

  change_password(body: IChangePassword): Observable<ApiResponse<string>> {
    return from(cifrateData(this.publicKey, body)).pipe(
      switchMap(userEncrypt => {
        const headers = new HttpHeaders().set('basic', userEncrypt);
        return this.http.post<ApiResponse<string>>(
          `${this.authUrl}/cambiar-clave/${body.token}`,
          {},
          { headers }
        );
      })
    );
  }

  refreshToken(): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(`${this.authUrl}/refresh`, {}).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          const { pathname } = window.location;
          this.tokenService.logOutRefresh(pathname);
        }
        return throwError(() => err);
      })
    );
  }

  logout(): Observable<unknown> {
    return this.http.post(`${this.authUrl}/logout`, {});
  }

  profile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.authUrl}/profile`);
  }
}
