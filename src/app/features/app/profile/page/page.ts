import { selectAuthUser, selectUserFullName } from '@/features/auth/store';
import { ZardAlertComponent } from '@/shared/components/alert';
import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { ZardButtonComponent } from '@/shared/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/card-custom';
import { ZardFormImports } from '@/shared/components/form';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardTooltipImports } from '@/shared/components/tooltip';
import { LayoutService } from '@/shared/services/layout';
import { UtilsService } from '@/shared/services/utils-service';
import { Rutas } from '@/shared/utils';
import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LucideEye, LucideEyeOff } from '@lucide/angular';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCamera, lucideLoader2, lucideSave } from '@ng-icons/lucide';
import { Store } from '@ngrx/store';
import { UpdatePasswordDto } from '../interfaces';
import {
  selectUserError,
  selectUserLoading,
  selectUserPasswordFormError,
  selectUserPasswordFormLoading,
  selectUserProfileFormError,
  selectUserProfileFormLoading,
  UserActions,
} from '../store';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Actions, ofType } from '@ngrx/effects';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';

@Component({
  selector: 'app-profile',
  imports: [
    NgIcon,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    FormsModule,
    ReactiveFormsModule,
    ZardAvatarComponent,
    ZardTooltipImports,
    ZardInputDirective,
    ZardButtonComponent,
    ZardFormImports,
    ZardAlertComponent,
    ZardBreadcrumbImports,
    ZardSkeletonComponent,
    LucideEye,
    LucideEyeOff,
  ],
  templateUrl: './page.html',
  styleUrl: './page.css',
  viewProviders: [
    provideIcons({
      lucideCamera,
      lucideSave,
      lucideLoader2,
    }),
  ],
})
export class Profile implements OnInit, AfterViewInit, OnDestroy {
  //#region injecciones
  private readonly layout = inject(LayoutService);
  private readonly utilsService = inject(UtilsService);
  private readonly store = inject(Store);
  private readonly injector = inject(Injector);
  private destroyRef = inject(DestroyRef);
  private actions$ = inject(Actions);
  //#endregion

  //#region variables
  readonly homeRoute = `/${Rutas.DASHBOARD}`;

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  avatarPreview = signal<string | null>(null); // blob URL, solo para <img> nativo
  private selectedAvatarFile: File | null = null;

  // z-avatar solo recibe URLs reales del servidor
  avatarSrc = computed(() => this.user()?.avatar ?? '');

  form = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    lastname: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    email: new FormControl<string>(
      { value: '', disabled: true },
      { nonNullable: true, validators: Validators.required }
    ),
  });

  formPassword = new FormGroup({
    currentPassword: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    newPassword: new FormControl<string>(
      { value: '', disabled: true },
      { nonNullable: true, validators: Validators.required }
    ),
    confirmPassword: new FormControl<string>(
      { value: '', disabled: true },
      { nonNullable: true, validators: Validators.required }
    ),
  });

  //#endregion

  //#region imports reducers
  user = this.store.selectSignal(selectAuthUser);
  fullName = this.store.selectSignal(selectUserFullName);
  readonly isLoadingProfile$ = toSignal(this.store.select(selectUserProfileFormLoading), {
    initialValue: false,
  });
  readonly isLoadingPassword$ = toSignal(this.store.select(selectUserPasswordFormLoading), {
    initialValue: false,
  });
  readonly error = this.store.selectSignal(selectUserError);
  readonly errorProfile = this.store.selectSignal(selectUserProfileFormError);
  readonly errorPassword = this.store.selectSignal(selectUserPasswordFormError);
  readonly isLoadingUser$ = toSignal(this.store.select(selectUserLoading), {
    initialValue: true, // true por defecto para evitar flash del form vacío
  });
  //#endregion

  //#region Ciclo de vida angular
  ngOnInit() {
    this.formPassword.controls.currentPassword.valueChanges.subscribe(value => {
      if (value) {
        this.formPassword.controls.newPassword.enable();
        this.formPassword.controls.confirmPassword.enable();
      } else {
        this.formPassword.controls.newPassword.disable();
        this.formPassword.controls.confirmPassword.disable();
      }
    });

    this.actions$
      .pipe(ofType(UserActions.updatePasswordSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.formPassword.reset();
      });
  }

  ngAfterViewInit(): void {
    if (this.user()) {
      this.form.patchValue(this.user()!);
    }
  }

  ngOnDestroy(): void {
    const preview = this.avatarPreview();
    if (preview) URL.revokeObjectURL(preview);
  }
  //#endregion

  //#region Getter y errores
  get nameControl() {
    return this.form.get('name')!;
  }

  getNameError(): string {
    if (this.nameControl.hasError('required') && this.nameControl.touched) {
      return 'El nombre es requerido.';
    }
    return '';
  }

  get lastnameControl() {
    return this.form.get('lastname')!;
  }

  getLastnameError(): string {
    if (this.lastnameControl.hasError('required') && this.lastnameControl.touched) {
      return 'El apellido es requerido.';
    }
    return '';
  }

  get emailControl() {
    return this.form.get('email')!;
  }

  getEmailError(): string {
    if (this.emailControl.hasError('required') && this.emailControl.touched) {
      return 'El correo electrónico es requerido.';
    } else if (this.emailControl.hasError('email') && this.emailControl.touched) {
      return 'Porfavor ingresa un correo valido.';
    }

    return '';
  }

  get currentPasswordControl() {
    return this.formPassword.get('currentPassword')!;
  }

  getCurrentPasswordError(): string {
    if (
      this.currentPasswordControl.hasError('required') &&
      this.currentPasswordControl.touched &&
      !this.isPasswordStrong(this.currentPasswordControl.value!)
    ) {
      return 'La contraseña debe tener al menos 8 caracteres y contener al menos 1 letra minúscula, 1 letra mayúscula, 1 número y 1 símbolo especial..';
    }
    return '';
  }

  get newPasswordControl() {
    return this.formPassword.get('newPassword')!;
  }

  getNewPasswordError(): string {
    if (
      this.newPasswordControl.hasError('required') &&
      this.newPasswordControl.touched &&
      !this.isPasswordStrong(this.newPasswordControl.value!)
    ) {
      return 'La contraseña debe tener al menos 8 caracteres y contener al menos 1 letra minúscula, 1 letra mayúscula, 1 número y 1 símbolo especial..';
    }
    return '';
  }

  get confirmPasswordControl() {
    return this.formPassword.get('confirmPassword')!;
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
  getInitialsWithFullName(fullname: string): string {
    const fullNameSplit = fullname.split(' ');
    const name = fullNameSplit[0];
    const lastname = fullNameSplit[1];

    return `${name[0]}${lastname[0]}`.toUpperCase();
  }

  onAvatarChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedAvatarFile = file;

    // Revocar el blob anterior para no leakear memoria
    const prev = this.avatarPreview();
    if (prev) URL.revokeObjectURL(prev);

    this.avatarPreview.set(URL.createObjectURL(file));
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.getRawValue();

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('lastname', data.lastname);
    formData.append('email', data.email);

    if (this.selectedAvatarFile) {
      formData.append('file', this.selectedAvatarFile);
    }

    this.store.dispatch(UserActions.updateProfile({ data: formData }));
  }

  handleSubmitPassword(): void {
    if (this.formPassword.invalid) {
      this.formPassword.markAllAsTouched();
      return;
    }

    const data: UpdatePasswordDto = this.formPassword.getRawValue();

    this.store.dispatch(UserActions.updatePassword({ data }));
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
}
