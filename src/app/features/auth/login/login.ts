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
import { AuthService } from '../services';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '@/shared/services';
import { Rutas } from '@/shared/utils';
import { catchError, EMPTY } from 'rxjs';
import { RefreshToken } from '@/shared/interfaces';
import { LoginResponse } from '../response';
import { toast } from 'ngx-sonner';

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
  providers: [AuthService],
})
export default class Login implements OnInit {
  //#region Variables
  // isError = false;
  // error = '';
  // submitted = false;
  isError = signal(false);
  error = signal('');
  submitted = signal(false);
  showPassword = false;
  isLoading = false;
  year: number = new Date().getFullYear();
  rememberSelect = signal(false);
  homeRoute = Rutas.HOME;

  //#region dependencias
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  private readonly route = inject(ActivatedRoute);
  //#endregion
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
  async handleSubmit(): Promise<void> {
    if (this.validationForm.invalid) {
      this.validationForm.markAllAsTouched();
      this.isError.set(true);
      this.error.set('Tienes que completar todos los campos');
      this.submitted.set(false);

      setTimeout(() => {
        this.isError.set(false);
      }, 5000);

      return;
    }

    this.sendLogin();
  }

  private sendLogin() {
    const body: ILogin = {
      email: this.emailControl.value!,
      password: this.passwordControl.value!,
    };
    this.submitted.set(true);

    this.authService
      .login(body)
      .pipe(
        catchError(error => {
          switch (error.statusCode) {
            case 400:
              this.isError.set(true);
              this.error.set('El email o contraseña no son válidos.');

              setTimeout(() => {
                this.isError.set(false);
              }, 5000);
              break;
            case 404:
              this.isError.set(true);
              this.error.set('Usuario no encontrado...');

              setTimeout(() => {
                this.isError.set(false);
              }, 5000);
              break;
            default:
              this.isError.set(true);
              this.error.set('Hubo un error inesperado. Intente nuevamente.');

              setTimeout(() => {
                this.isError.set(false);
              }, 5000);
              break;
          }
          this.submitted.set(false);
          return EMPTY;
        })
      )
      .subscribe({
        next: (response: LoginResponse) => {
          const {
            statusCode,
            data: { user, access_token, refresh_token },
          } = response;
          if (statusCode !== 200) return;

          const bodyRT: RefreshToken = { token: refresh_token };

          if (this.rememberSelect()) {
            this.tokenService.setUserLS(user);
            this.tokenService.setLocalStorage(access_token);
          } else {
            this.tokenService.setUserSS(user);
            this.tokenService.setSessionStorage(access_token);
          }

          this.tokenService.setCookieRefresh(bodyRT);

          this.submitted.set(false);
          const { fragment } = this.route.snapshot;
          const redirectUrl = fragment ? fragment.split('=')[1] : `/${Rutas.DASHBOARD}`;

          toast.success('Exito', {
            description: `${user.name} te has logueado correctamente!`,
            position: 'top-right',
          });

          this.router.navigate([redirectUrl]);
        },
      });
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
    this.submitted.set(false);
  }
  //#endregion
}
