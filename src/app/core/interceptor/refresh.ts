import { RefreshResponse } from '@/features/auth/response';
import { AuthService } from '@/features/auth/services';
import { RefreshToken, TokenInfo } from '@/shared/interfaces';
import { TokenService } from '@/shared/services';
import { Storage } from '@/shared/utils';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, from, switchMap, take, throwError } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  const { token, source }: TokenInfo = tokenService.getTokenLogin();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401) {
        return throwError(() => err);
      }

      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap(newToken =>
            next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }))
          )
        );
      }

      isRefreshing = true;
      refreshTokenSubject.next(null);
      return authService.refreshToken().pipe(
        switchMap(({ data: { access_token, refresh_token } }: RefreshResponse) => {
          isRefreshing = false;

          const body: RefreshToken = { token: refresh_token };

          if (source === Storage.SESSION_STORAGE) {
            tokenService.setSessionStorage(access_token);
          } else if (source === Storage.LOCAL_STORAGE) {
            tokenService.setLocalStorage(access_token);
          }

          return from(tokenService.setCookieRefresh(body)).pipe(
            switchMap(() => {
              refreshTokenSubject.next(access_token);
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${access_token}` },
              });

              return next(retryReq).pipe(
                catchError(retryErr => {
                  console.log('error reintento:', retryErr.status);
                  return throwError(() => retryErr);
                })
              );
            })
          );
        }),
        catchError(refreshErr => {
          if (isRefreshing) {
            isRefreshing = false;
            refreshTokenSubject.next(null);
            tokenService.logOutRefresh(window.location.pathname);
          }
          return throwError(() => refreshErr);
        })
      );
    })
  );
};
