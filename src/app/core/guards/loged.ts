import { TokenService } from '@/shared/services';
import { Rutas } from '@/shared/utils';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const logedGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  if (!tokenService.isLogged()) {
    router.navigate([`/${Rutas.HOME}`]);
    return false;
  }
  return true;
};
