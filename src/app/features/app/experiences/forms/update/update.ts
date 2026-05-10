import { ZardAlertComponent } from '@/shared/components/alert';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCheckboxComponent } from '@/shared/components/checkbox';
import { ZardDatePickerComponent } from '@/shared/components/date-picker';
import { ZardFormImports } from '@/shared/components/form';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardTooltipImports } from '@/shared/components/tooltip';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideHouse,
  lucideLoader2,
  lucidePencil,
  lucidePlus,
  lucideX,
} from '@ng-icons/lucide';
import { Store } from '@ngrx/store';
import { ExperienceFormGroup, ExperienceList, UpdateExperienceDto } from '../../interfaces';
import {
  ExperiencesActions,
  selectExperienceErrorStatusCode,
  selectExperienceFormError,
  selectExperienceFormLoading,
  selectExperiencesError,
  selectExperiencesLoading,
  selectSelectedExperience,
} from '../../store';
import { Card } from '@/shared/components/card-custom';
import { Rutas } from '@/shared/utils';
import { toSignal } from '@angular/core/rxjs-interop';
import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { AsyncPipe } from '@angular/common';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-updateexperience',
  imports: [
    NgIcon,
    Card,
    FormsModule,
    ReactiveFormsModule,
    ZardInputDirective,
    ZardDatePickerComponent,
    ZardCheckboxComponent,
    ZardButtonComponent,
    ZardTooltipImports,
    ZardBadgeComponent,
    ZardFormImports,
    ZardAlertComponent,
    ZardBreadcrumbImports,
    ZardSkeletonComponent,
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './update.html',
  styleUrl: './update.css',
  viewProviders: [
    provideIcons({
      lucidePencil,
      lucidePlus,
      lucideArrowLeft,
      lucideX,
      lucideLoader2,
      lucideHouse,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateExperience implements OnInit, AfterViewInit {
  //#region Dependencias
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  //#endregion

  //#region Variables
  id = input.required<string>();
  readonly baseRoute = `/${Rutas.EXPERIENCES}`;
  readonly homeRoute = `/${Rutas.DASHBOARD}`;
  readonly maxDate = new Date();

  form: ExperienceFormGroup = new FormGroup({
    company: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    position: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    startsDate: new FormControl<Date | null>(null, Validators.required),
    endsDate: new FormControl<Date | null>(null),
    currentPosition: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: Validators.required,
    }),
    description: new FormControl<string>('', { nonNullable: true }),
    skills: new FormControl<string[]>([], { nonNullable: true }),
  });

  errorBack = this.store.selectSignal(selectExperienceFormError);

  skillInput = new FormControl('', { nonNullable: true });

  isLoading$ = toSignal(this.store.select(selectExperienceFormLoading), {
    initialValue: false,
  });

  experience$ = this.store.select(selectSelectedExperience);
  isLoadingBack$ = this.store.select(selectExperiencesLoading);
  error$ = this.store.select(selectExperiencesError);
  statusCode$ = this.store.select(selectExperienceErrorStatusCode);

  //#endregion

  //#region Ciclo de vida angular
  ngOnInit(): void {
    this.getData();
    this.experienceNotFound();
  }

  ngAfterViewInit(): void {
    if (this.experience$) {
      this.experience$.subscribe({
        next: (data: ExperienceList | null) => {
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
  get companyControl() {
    return this.form.get('company')!;
  }

  getCompanyError(): string {
    if (this.companyControl.hasError('required') && this.companyControl.touched) {
      return 'La compañia es requerida.';
    }
    return '';
  }

  get positionControl() {
    return this.form.get('position')!;
  }

  getPositionError(): string {
    if (this.positionControl.hasError('required') && this.positionControl.touched) {
      return 'La posición es requerida.';
    }
    return '';
  }

  get currentPositionControl() {
    return this.form.get('currentPosition')!;
  }

  getCurrentPositionError(): string {
    if (this.currentPositionControl.hasError('required') && this.currentPositionControl.touched) {
      return 'La posición actual es requerida.';
    }

    return '';
  }

  get startsDateControl() {
    return this.form.get('startsDate')!;
  }

  getStartsDateError(): string {
    if (this.startsDateControl.hasError('required') && this.startsDateControl.touched) {
      return 'La fecha de inicio es requerida.';
    }

    return '';
  }

  get endsDateControl() {
    return this.form.get('endsDate')!;
  }

  getEndsDateError(): string {
    if (this.endsDateControl.hasError('required') && this.endsDateControl.touched) {
      return 'La fecha de fin es requerida.';
    }

    return '';
  }

  get descriptionControl() {
    return this.form.get('description')!;
  }

  getDescriptionError(): string {
    if (this.descriptionControl.hasError('required') && this.descriptionControl.touched) {
      return 'La descripcion es requerida.';
    }

    return '';
  }

  get skillsControl() {
    return this.form.get('skills')!;
  }

  getSkillsError(): string {
    if (this.skillsControl.hasError('required') && this.skillsControl.touched) {
      return 'Las habilidades son requeridas.';
    }

    return '';
  }

  get skills(): string[] {
    return this.form.controls.skills.value;
  }
  //#endregion

  //#region Funciones
  getData() {
    this.store.dispatch(ExperiencesActions.getById({ id: this.id() }));
  }

  experienceNotFound() {
    this.statusCode$.subscribe({
      next: (res: number | null) => {
        const statusCode = res;

        if (statusCode === 404) {
          toast.error('Upps.. hubo un error', {
            description: 'La experiencia buscada no existe',
            position: 'top-right',
          });

          this.router.navigate([this.baseRoute]);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(`error not found: ${error}`);
      },
    });
  }

  addSkill(): void {
    const value = this.skillInput.value.trim();
    if (!value || this.skills.includes(value)) return;

    this.form.controls.skills.setValue([...this.skills, value]);
    this.skillInput.reset();
  }

  removeSkill(skill: string): void {
    this.form.controls.skills.setValue(this.skills.filter(s => s !== skill));
  }

  onStartDateChange(date: Date | null) {
    this.form.controls.startsDate.setValue(date);
  }

  onEndDateChange(date: Date | null) {
    this.form.controls.endsDate.setValue(date);
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data: UpdateExperienceDto = this.form.getRawValue();

    this.store.dispatch(ExperiencesActions.updateExperience({ id: this.id(), data }));
  }
  //#endregion
}
