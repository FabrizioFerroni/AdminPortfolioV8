import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDialogRef } from '@/shared/components/dialog';
import { Rutas } from '@/shared/utils';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLogIn, lucideX } from '@ng-icons/lucide';

@Component({
  imports: [ZardButtonComponent, NgIcon],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
  viewProviders: [
    provideIcons({
      lucideX,
      lucideLogIn,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogClave {
  //#region Dependencias
  private readonly router = inject(Router);
  private readonly dialogRef = inject(ZardDialogRef);
  //#endregion

  //#region Function
  goToLogin(): void {
    this.dialogRef.close();
    this.router.navigate([`/${Rutas.HOME}`]);
  }
  //#endregion
}
