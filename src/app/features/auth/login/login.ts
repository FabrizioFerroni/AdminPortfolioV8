import { ZardAlertComponent } from '@/shared/components/alert';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCheckboxComponent } from '@/shared/components/checkbox';
import { ZardFormImports } from '@/shared/components/form';
import { ZardInputDirective } from '@/shared/components/input';
import { StrongPasswordRegx } from '@/shared/functions';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideBriefcase,
  LucideEye,
  LucideEyeOff,
  LucideLoader2,
  LucideLock,
  LucideLogIn,
  LucideMail,
} from '@lucide/angular';
import { ILogin } from '../interfaces';
import { Store } from '@ngrx/store';
import { AuthActions, selectAuthError, selectIsLoading } from '../store';

@Component({
  selector: 'app-login',
  imports: [
    LucideBriefcase,
    LucideMail,
    LucideLock,
    LucideEye,
    LucideEyeOff,
    LucideLogIn,
    LucideLoader2,
    CommonModule,
    ZardAlertComponent,
    ReactiveFormsModule,
    ZardInputDirective,
    ZardButtonComponent,
    ZardCheckboxComponent,
    ZardFormImports,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export default class Login implements OnInit {
  //#region Variables
  showPassword = false;
  year: number = new Date().getFullYear();
  rememberSelect = signal(false);

  //#region dependencias
  private readonly store = inject(Store);
  //#endregion

  isLoading = this.store.selectSignal(selectIsLoading);
  authError = this.store.selectSignal(selectAuthError);
  //#endregion

  //#region Forms
  validationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(StrongPasswordRegx),
    ]),
    rememberMe: new FormControl(false),
  });
  //#endregion

  //#region Inicializacion
  ngOnInit() {
    this.rememberControl?.valueChanges.subscribe(value => {
      this.rememberSelect.set(!!value);
    });
  }
  //#endregion

  //#region getterandvalidations
  get emailControl() {
    return this.validationForm.get('email')!;
  }

  get passwordControl() {
    return this.validationForm.get('password')!;
  }

  get rememberControl() {
    return this.validationForm.get('rememberMe');
  }

  getEmailError(): string {
    if (this.emailControl.hasError('required') && this.emailControl.touched) {
      return 'El email es requerido.';
    } else if (this.emailControl.hasError('email') && this.emailControl.touched) {
      return 'Porfavor ingresa un correo valido.';
    }
    return '';
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
  //#endregion

  //#region Functions
  handleSubmit(): void {
    if (this.validationForm.invalid) {
      this.validationForm.markAllAsTouched();
      return;
    }

    const body: ILogin = {
      email: this.emailControl.value!,
      password: this.passwordControl.value!,
    };

    this.store.dispatch(
      AuthActions.login({
        body,
        rememberMe: this.rememberSelect(),
      })
    );
  }

  isPasswordStrong(value: string): boolean {
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecialCharacter = /[!@#$%^&*]/.test(value);
    const hasMinimumLength = value.length >= 8;

    return hasUppercase && hasLowercase && hasDigit && hasSpecialCharacter && hasMinimumLength;
  }
  //#endregion

  //#region Dispose
  resetForm(): void {
    this.validationForm.reset();
  }
  //#endregion
}
