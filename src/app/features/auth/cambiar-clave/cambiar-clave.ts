import { ZardAlertComponent } from '@/shared/components/alert';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardFormImports } from '@/shared/components/form';
import { ZardInputDirective } from '@/shared/components/input';
import { StrongPasswordRegx } from '@/shared/functions';
import { JwtToken } from '@/shared/interfaces';
import { JwtService } from '@/shared/services';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideBriefcase, LucideEye, LucideKey, LucideLoader2, LucideLock } from '@lucide/angular';
import { provideIcons } from '@ng-icons/core';
import { lucideCircleCheck } from '@ng-icons/lucide';
import { Store } from '@ngrx/store';
import { IChangePassword } from '../interfaces';
import {
  AuthActions,
  errorChangePassword,
  isLoadingChangePassword,
  resultChangePassword,
} from '../store';
import { ZardDialogService } from '@/shared/components/dialog';
import { DialogClave } from './dialog/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-clave',
  imports: [
    LucideBriefcase,
    LucideEye,
    LucideKey,
    LucideLock,
    LucideLoader2,
    CommonModule,
    ZardAlertComponent,
    ReactiveFormsModule,
    ZardInputDirective,
    ZardButtonComponent,
    ZardFormImports,
  ],
  templateUrl: './cambiar-clave.html',
  styleUrl: './cambiar-clave.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideCircleCheck })],
})
export class CambiarClave implements OnInit {
  //#region Dependencias
  private readonly store = inject(Store);
  private readonly jwtService = inject(JwtService);
  private readonly dialogService = inject(ZardDialogService);
  private readonly router = inject(Router);
  //#endregion

  //#region Variables
  token = input.required<string>();
  showPassword = false;
  showConfirmPassword = false;
  year: number = new Date().getFullYear();
  private jwtToken: JwtToken = {
    email: '',
    id: '',
    iat: 0,
    exp: 0,
  };

  isLoading = this.store.selectSignal(isLoadingChangePassword);
  authRecoverError = this.store.selectSignal(errorChangePassword);
  authRecoverMessage = this.store.selectSignal(resultChangePassword);

  //#endregion

  //#region inicializacion de dependencias
  constructor() {
    effect(() => {
      if (this.authRecoverMessage()) {
        this.resetForm();
        this.openDialogImage();
      }
    });
  }
  //#endregion

  //#region Forms
  validationForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(StrongPasswordRegx),
    ]),
    confirm_password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(StrongPasswordRegx),
    ]),
  });
  //#endregion

  //#region Ciclo de vida angular
  ngOnInit(): void {
    const token = this.token();

    if (!token) {
      this.fail('Enlace inválido o incompleto', 400);
      return;
    }

    try {
      this.jwtToken = this.jwtService.decodeToken(token);
    } catch {
      this.fail('El token es inválido', 400);
      return;
    }

    this.store.dispatch(AuthActions.verifyTokenPassword({ token }));
  }
  //#endregion

  //#region getterandvalidations
  get passwordControl() {
    return this.validationForm.get('password')!;
  }
  get confirmPasswordControl() {
    return this.validationForm.get('confirm_password')!;
  }

  getPasswordError(): string {
    if (
      this.passwordControl.hasError('required') &&
      this.passwordControl.touched &&
      !this.isPasswordStrong(this.passwordControl.value!)
    ) {
      return 'La contraseña debe tener al menos 8 caracteres y contener al menos 1 letra minúscula, 1 letra mayúscula, 1 número y 1 símbolo especial..';
    }
    return '';
  }

  getConfirmPasswordError(): string {
    if (
      this.confirmPasswordControl.hasError('required') &&
      this.confirmPasswordControl.touched &&
      !this.isPasswordStrong(this.confirmPasswordControl.value!)
    ) {
      return 'La contraseña debe tener al menos 8 caracteres y contener al menos 1 letra minúscula, 1 letra mayúscula, 1 número y 1 símbolo especial..';
    }
    return '';
  }
  //#endregion

  //#region funciones
  private fail(error: string, statusCode: number): void {
    this.store.dispatch(AuthActions.verifyTokenPasswordFailure({ error, statusCode }));
  }

  isPasswordStrong(value: string): boolean {
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecialCharacter = /[!@#$%^&*]/.test(value);
    const hasMinimumLength = value.length >= 8;

    return hasUppercase && hasLowercase && hasDigit && hasSpecialCharacter && hasMinimumLength;
  }

  handleSubmit(): void {
    if (this.validationForm.invalid) {
      this.validationForm.markAllAsTouched();
      return;
    }

    const body: IChangePassword = {
      email: this.jwtToken!.email!,
      token: this.token(),
      password: this.passwordControl!.value!,
      confirm_password: this.confirmPasswordControl!.value!,
    };

    this.store.dispatch(
      AuthActions.changePassword({
        body,
      })
    );
  }

  openDialogImage() {
    this.dialogService.create({
      zTitle: '',
      zDescription: '',
      zMaskClosable: false,
      zClosable: false,
      zContent: DialogClave,
      zHideFooter: true,
    });
  }
  //#endregion

  //#region Dispose
  resetForm(): void {
    this.validationForm.reset();
  }
  //#endregion
}
