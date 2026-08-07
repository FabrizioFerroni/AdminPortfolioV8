import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from './base-http-service';
import { Router } from '@angular/router';
import { Rutas, Storage } from '../utils';
import { TokenInfo } from '../interfaces';
import { UserProfile } from '@/features/auth/response';

const TOKEN_KEY = 'token';
const USER_DATA = 'profile';

@Injectable({
  providedIn: 'root',
})
export class TokenService extends BaseHttpService {
  private tokenInfo: TokenInfo = { token: null, source: Storage.NONE };
  private readonly router = inject(Router);

  setUserLS(user: UserProfile): void {
    this.deleteUserLS();
    localStorage.setItem(USER_DATA, JSON.stringify(user));
  }

  getUserLS(): UserProfile | null {
    return JSON.parse(localStorage.getItem(USER_DATA) || 'null') || null;
  }

  deleteUserLS(): void {
    localStorage.removeItem(USER_DATA);
  }

  setLocalStorage(token: string): void {
    this.deleteLocalStorage();
    localStorage.setItem(TOKEN_KEY, token);
  }

  getLocalToken(): string {
    return localStorage.getItem(TOKEN_KEY)!;
  }

  deleteLocalStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  setUserSS(user: UserProfile): void {
    this.deleteUserSS();
    sessionStorage.setItem(USER_DATA, JSON.stringify(user));
  }

  getUserSS(): UserProfile | null {
    return JSON.parse(sessionStorage.getItem(USER_DATA) || 'null') || null;
  }

  deleteUserSS(): void {
    sessionStorage.removeItem(USER_DATA);
  }

  setSessionStorage(token: string): void {
    this.deleteSessionStorage();
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  getSessionToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY) || null;
  }

  deleteSessionStorage(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  isLogged(): boolean {
    if (this.getSessionToken() || this.getLocalToken()) {
      return true;
    }
    return false;
  }

  getTokenLogin(): TokenInfo {
    const sessionToken = this.getSessionToken();
    const localToken = this.getLocalToken();

    if (sessionToken) {
      this.tokenInfo = { token: sessionToken, source: Storage.SESSION_STORAGE };
    } else if (localToken) {
      this.tokenInfo = { token: localToken, source: Storage.LOCAL_STORAGE };
    } else {
      this.tokenInfo = { token: null, source: Storage.NONE };
    }
    return this.tokenInfo;
  }

  logOut(): void {
    this.clearLocalSession();
    this.router.navigateByUrl(`/${Rutas.HOME}`);
  }

  logOutRefresh(url: string): void {
    this.clearLocalSession();
    setTimeout(() => {
      this.router.navigateByUrl(`/${Rutas.HOME}#redirect=${url}`);
    }, 100);
  }

  private clearLocalSession(): void {
    if (this.getSessionToken() && !this.getLocalToken()) {
      this.deleteSessionStorage();
      this.deleteUserSS();
    } else if (this.getLocalToken() && !this.getSessionToken()) {
      this.deleteLocalStorage();
      this.deleteUserLS();
    }
  }
}
