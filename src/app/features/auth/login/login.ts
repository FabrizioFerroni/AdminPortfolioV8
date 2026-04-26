import { ZardAlertComponent } from '@/shared/components/alert';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCheckboxComponent } from '@/shared/components/checkbox';
import { ZardFormImports } from '@/shared/components/form';
import { ZardInputDirective } from '@/shared/components/input';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideBriefcase,
  LucideEye,
  LucideEyeOff,
  LucideLoader,
  LucideLoader2,
  LucideLock,
  LucideLogIn,
  LucideMail,
} from '@lucide/angular';

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
  isError: boolean = false;
  error: string = 'test';
  showPassword: boolean = false;
  isLoading: boolean = false;
  year: number = new Date().getFullYear();
  submitted = false;
  //#endregion

  //#region Forms
  validationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rememberMe: new FormControl(false, []),
  });
  //#endregion

  //#region Inicializacion
  ngOnInit(): void {}
  //#endregion

  //#region getterandvalidations
  get emailControl() {
    return this.validationForm.get('email')!;
  }

  get passwordControl() {
    return this.validationForm.get('password')!;
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
    if (this.passwordControl.hasError('required') && this.passwordControl.touched) {
      return 'La contraseña es requerida.';
    }
    return '';
  }
  //#endregion

  //#region Functions
  async handleSubmit(): Promise<void> {
    this.submitted = !this.submitted;

    if (this.validationForm.invalid) {
      this.validationForm.markAllAsTouched();
      this.isError = true;
      this.error = 'Tienes que completar todos los campos';
      this.submitted = false;

      setTimeout(() => {
        this.isError = false;
      }, 5000);

      return;
    }

    await this.sendLogin();
  }

  private sendLogin(): Promise<void> {
    console.log('Form submitted:', this.validationForm.getRawValue());
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
  //#endregion

  //#region Dispose
  resetForm(): void {
    this.validationForm.reset();
    this.submitted = false;
  }
  //#endregion
}
