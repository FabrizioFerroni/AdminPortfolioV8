import { ZardAlertComponent } from '@/shared/components/alert';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCheckboxComponent } from '@/shared/components/checkbox';
import { ZardDatePickerComponent } from '@/shared/components/date-picker';
import { ZardFormImports } from '@/shared/components/form';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardTooltipImports } from '@/shared/components/tooltip';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideHouse, lucideLoader2, lucidePlus, lucideX } from '@ng-icons/lucide';
import { Store } from '@ngrx/store';
import { CreateExperienceDto, ExperienceFormGroup, ExperienceList } from '../../interfaces';
import {
  ExperiencesActions,
  selectExperienceFormError,
  selectExperienceFormLoading,
} from '../../store';
import { Card } from '@/shared/components/card-custom';
import { Rutas } from '@/shared/utils';
import { toSignal } from '@angular/core/rxjs-interop';
import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-createexperience',
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
    RouterLink,
  ],
  templateUrl: './create.html',
  styleUrl: './create.css',
  viewProviders: [
    provideIcons({
      lucidePlus,
      lucideArrowLeft,
      lucideX,
      lucideLoader2,
      lucideHouse,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateExperience {
  //#region Dependencias
  private readonly store = inject(Store);
  //#endregion

  //#region Variables
  readonly baseRoute = `/${Rutas.EXPERIENCES}`;
  readonly homeRoute = `/${Rutas.DASHBOARD}`;
  readonly maxDate = new Date();
  private expType?: ExperienceList;

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
    achievements: new FormControl<string[]>([], { nonNullable: true }),
  });

  errorBack = this.store.selectSignal(selectExperienceFormError);

  skillInput = new FormControl('', { nonNullable: true });
  achievementInput = new FormControl('', { nonNullable: true });

  isLoading$ = toSignal(this.store.select(selectExperienceFormLoading), {
    initialValue: false,
  });
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

  get achievementsControl() {
    return this.form.get('achievements')!;
  }

  getAchievementsError(): string {
    if (this.achievementsControl.hasError('required') && this.achievementsControl.touched) {
      return 'Los logros son requeridas.';
    }

    return '';
  }

  get achievements(): string[] {
    return this.form.controls.achievements.value;
  }
  //#endregion

  //#region Funciones
  addSkill(): void {
    const value = this.skillInput.value.trim();
    if (!value || this.skills.includes(value)) return;

    this.form.controls.skills.setValue([...this.skills, value]);
    this.skillInput.reset();
  }

  removeSkill(skill: string): void {
    this.form.controls.skills.setValue(this.skills.filter(s => s !== skill));
  }

  addAchievement(): void {
    const value = this.achievementInput.value.trim();
    if (!value || this.achievements.includes(value)) return;

    this.form.controls.achievements.setValue([...this.achievements, value]);
    this.achievementInput.reset();
  }

  removeAchievement(achievement: string): void {
    this.form.controls.achievements.setValue(this.achievements.filter(a => a !== achievement));
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

    const data: CreateExperienceDto = this.form.getRawValue();

    this.store.dispatch(ExperiencesActions.createExperience({ data }));
  }
  //#endregion
}
