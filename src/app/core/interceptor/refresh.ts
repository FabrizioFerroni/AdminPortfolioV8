import { RefreshResponse } from '@/features/auth/response';
import { AuthService } from '@/features/auth/services';
import { RefreshToken, TokenInfo } from '@/shared/interfaces';
import { TokenService } from '@/shared/services';
import { Storage } from '@/shared/utils';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  const { token, source }: TokenInfo = tokenService.getTokenLogin();

  if (!token) {
    const publicReq = req.clone({ withCredentials: false });
    return next(publicReq);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(({ data: { access_token, refresh_token } }: RefreshResponse) => {
            const body: RefreshToken = {
              token: refresh_token,
            };

            if (source === Storage.SESSION_STORAGE) {
              tokenService.setSessionStorage(access_token);
            } else if (source === Storage.LOCAL_STORAGE) {
              tokenService.setLocalStorage(access_token);
            }

            tokenService.setCookieRefresh(body);

            const newAuthReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${access_token}`,
              },
            });

            return next(newAuthReq);
          }),
          catchError(refreshErr => {
            const { pathname } = window.location;

            tokenService.logOutRefresh(pathname);

            return throwError(() => refreshErr);
          })
        );
      } else {
        return throwError(() => err);
      }
    })
  );
};
