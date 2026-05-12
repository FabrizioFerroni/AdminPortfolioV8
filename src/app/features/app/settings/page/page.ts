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
import { UtilsService } from '@/shared/services/utils-service';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoader2, lucideSave } from '@ng-icons/lucide';
import { Store } from '@ngrx/store';
import { ZardAlertComponent } from '@/shared/components/alert';
import { ZardSwitchComponent } from '@/shared/components/switch';
import {
  errorFormSetting,
  errorSetting,
  loadingFormSetting,
  loadingSetting,
  selectSetting,
  SettingActions,
  statusCodeSetting,
} from '../store';
import { SettingList, UpdateSettingDto } from '../interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { urlValidator } from '@/shared/validators';

@Component({
  selector: 'app-settings',
  imports: [
    NgIcon,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    ZardButtonComponent,
    ZardInputDirective,
    ZardFormImports,
    ZardAlertComponent,
    ZardSwitchComponent,
    ZardSkeletonComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './page.html',
  styleUrl: './page.css',
  viewProviders: [
    provideIcons({
      lucideSave,
      lucideLoader2,
    }),
  ],
})
export class Settings implements OnInit, AfterViewInit {
  //#region injecciones
  private readonly utilsService = inject(UtilsService);
  private readonly store = inject(Store);
  //#endregion

  //#region variables

  form = new FormGroup({
    frontUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, urlValidator()],
    }),
    maintenanceMode: new FormControl<boolean>(
      { value: false, disabled: false },
      { nonNullable: true, validators: Validators.required }
    ),
  });
  //#endregion

  //#region imports reducers
  //TODO: Estos selectors son para el get de settings
  readonly setting$ = this.store.select(selectSetting);
  readonly isLoadingSetting$ = toSignal(this.store.select(loadingSetting), {
    initialValue: false,
  });
  readonly error = this.store.selectSignal(errorSetting);
  readonly statusCode = this.store.selectSignal(statusCodeSetting);

  //TODO: Estos selectors son para el update a setting
  readonly errorFormSettingRed = this.store.selectSignal(errorFormSetting);
  readonly isLoadingFormSetting$ = toSignal(this.store.select(loadingFormSetting), {
    initialValue: true,
  });
  //#endregion

  //#region Ciclo de vida angular
  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit(): void {
    if (this.setting$) {
      this.setting$.subscribe({
        next: (data: SettingList | null) => {
          if (data) {
            this.form.patchValue(data);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
    }
  }
  //#endregion

  //#region Getter y errores
  get frontUrlControl() {
    return this.form.controls.frontUrl;
  }

  getUrlError(): string {
    if (this.frontUrlControl.hasError('required') && this.frontUrlControl.touched) {
      return 'La url del front es obligatoria.';
    }
    if (this.frontUrlControl.hasError('url'))
      return 'Ingresá una URL válida (ej: https://miportfolio.com)';
    return '';
  }

  get maintenanceModeControl() {
    return this.form.controls.maintenanceMode;
  }

  getMaintanceModeError(): string {
    if (this.maintenanceModeControl.hasError('required') && this.maintenanceModeControl.touched) {
      return 'El modo de mantenimiento es requerido.';
    }
    return '';
  }
  //#endregion

  //#region funciones
  getData() {
    this.store.dispatch(SettingActions.getSetting());
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data: UpdateSettingDto = this.form.getRawValue();

    this.store.dispatch(SettingActions.updateSetting({ data }));
  }
  //#endregion
}
