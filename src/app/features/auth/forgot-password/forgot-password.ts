import { ZardAlertComponent } from '@/shared/components/alert';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardFormImports } from '@/shared/components/form';
import { ZardInputDirective } from '@/shared/components/input';
import { Rutas } from '@/shared/utils';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideBriefcase, LucideKey, LucideLoader2, LucideMail } from '@lucide/angular';
import { Store } from '@ngrx/store';
import { IForgotPassword } from '../interfaces';
import { AuthActions, errorForgot, isLoadingForgot, messageForgot } from '../store';
import { provideIcons } from '@ng-icons/core';
import { lucideCircleCheck } from '@ng-icons/lucide';

@Component({
  selector: 'app-forgot-password',
  imports: [
    LucideBriefcase,
    LucideMail,
    LucideKey,
    LucideLoader2,
    CommonModule,
    ZardAlertComponent,
    ReactiveFormsModule,
    ZardInputDirective,
    ZardButtonComponent,
    ZardFormImports,
    RouterLink,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideCircleCheck })],
})
export class ForgotPassword {
  //#region Variables
  year: number = new Date().getFullYear();
  login = Rutas.HOME;

  //#region dependencias
  private readonly store = inject(Store);
  //#endregion

  isLoading = this.store.selectSignal(isLoadingForgot);
  authForgotError = this.store.selectSignal(errorForgot);
  authForgotMessage = this.store.selectSignal(messageForgot);

  //#endregion

  //#region inicializacion de dependencias
  constructor() {
    effect(() => {
      if (this.authForgotMessage()) {
        this.resetForm();
      }
    });
  }
  //#endregion

  //#region Forms
  validationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  //#endregion

  //#region getterandvalidations
  get emailControl() {
    return this.validationForm.get('email')!;
  }

  getEmailError(): string {
    if (this.emailControl.hasError('required') && this.emailControl.touched) {
      return 'El email es requerido.';
    } else if (this.emailControl.hasError('email') && this.emailControl.touched) {
      return 'Porfavor ingresa un correo valido.';
    }
    return '';
  }
  //#endregion

  //#region Functions
  handleSubmit(): void {
    if (this.validationForm.invalid) {
      this.validationForm.markAllAsTouched();
      return;
    }

    const body: IForgotPassword = {
      email: this.emailControl.value!,
    };

    this.store.dispatch(
      AuthActions.forgotPassword({
        body,
      })
    );
  }
  //#endregion

  //#region Dispose
  resetForm(): void {
    this.validationForm.reset();
  }
  //#endregion
}
