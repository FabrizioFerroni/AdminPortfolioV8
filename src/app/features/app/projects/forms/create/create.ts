/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZardAlertComponent } from '@/shared/components/alert';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { ZardButtonComponent } from '@/shared/components/button';
import { Card } from '@/shared/components/card-custom';
import { ZardDatePickerComponent } from '@/shared/components/date-picker';
import { ZardFormImports } from '@/shared/components/form';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardTooltipImports } from '@/shared/components/tooltip';
import { Rutas } from '@/shared/utils';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
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
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideFolderKanban,
  lucideGlobe,
  lucideHouse,
  lucideLoader2,
  lucideLock,
  lucidePlus,
  lucideUpload,
  lucideUser,
  lucideUsersRound,
  lucideX,
} from '@ng-icons/lucide';
import { Store } from '@ngrx/store';
import {
  InsertOrUpdateProjectFeatDto,
  InsertOrUpdateProjectTecDto,
  ProjectFormControls,
} from '../../interfaces';
import { errorFormProject, loadingFormProject, ProjectsActions } from '../../store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectSetting, SettingActions } from '@/features/app/settings/store';
import { SettingList } from '@/features/app/settings/interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { map, startWith } from 'rxjs';
import { generateSlug } from '@/shared/functions';
import { ZardTabComponent, ZardTabGroupComponent } from '@/shared/components/tabs';
import { ZardSelectImports } from '@/shared/components/select';
import { CATEGORY_CONFIG, groupTechnologiesByCategory } from '../../utils';
import { MarkdownModule } from 'ngx-markdown';

declare const Prism: any;

@Component({
  selector: 'app-createproject',
  imports: [
    NgIcon,
    Card,
    FormsModule,
    ReactiveFormsModule,
    ZardInputDirective,
    ZardDatePickerComponent,
    ZardButtonComponent,
    ZardTooltipImports,
    ZardBadgeComponent,
    ZardFormImports,
    ZardAlertComponent,
    ZardBreadcrumbImports,
    ZardTabComponent,
    ZardTabGroupComponent,
    ZardSelectImports,
    RouterLink,
    MarkdownModule,
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
      lucideFolderKanban,
      lucideGlobe,
      lucideUser,
      lucideUsersRound,
      lucideLock,
      lucideUpload,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProject implements OnInit, AfterViewInit {
  //#region Dependencias
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  //#endregion

  //#region Variables
  readonly baseRoute = `/${Rutas.PROJECTS}`;
  readonly homeRoute = `/${Rutas.DASHBOARD}`;
  readonly maxDate = new Date();
  readonly frontUrl = signal<string>('');
  coverImage = signal<string | null>(null);
  selectedCoverFile: File | null = null;

  form: FormGroup<ProjectFormControls> = new FormGroup<ProjectFormControls>({
    title: new FormControl('', { nonNullable: true, validators: Validators.required }),
    summary: new FormControl('', { nonNullable: true, validators: Validators.required }),
    description: new FormControl(null, { nonNullable: true, validators: Validators.required }),
    publishedDate: new FormControl<Date | null>(new Date(), { validators: Validators.required }),
    urlGithub: new FormControl('', { nonNullable: true }),
    urlProyect: new FormControl('', { nonNullable: true }),
    visibility: new FormControl('public', { nonNullable: true, validators: Validators.required }),
    type: new FormControl('personal', { nonNullable: true, validators: Validators.required }),
    features: new FormControl<InsertOrUpdateProjectFeatDto[]>([], { nonNullable: true }),
    technologies: new FormControl<InsertOrUpdateProjectTecDto[]>([], { nonNullable: true }),
  });

  featureInput = new FormControl('', { nonNullable: true });
  technologieInput = new FormControl('', { nonNullable: true });
  technologieCategoryInput = new FormControl('', { nonNullable: true });
  selectedValue = signal<string>('');
  private readonly techInputValue = toSignal(this.technologieInput.valueChanges, {
    initialValue: this.technologieInput.value,
  });
  private readonly featInputValue = toSignal(this.featureInput.valueChanges, {
    initialValue: this.featureInput.value,
  });

  protected readonly isAddDisabled = computed(
    () => !this.techInputValue()?.trim() || !this.selectedValue()
  );

  protected readonly isAddFeatDisabled = computed(() => !this.featInputValue()?.trim());

  private readonly technologiesSignal = toSignal(
    this.form.controls.technologies.valueChanges.pipe(
      startWith(this.form.controls.technologies.value)
    ),
    { initialValue: this.form.controls.technologies.value }
  );

  readonly slug = toSignal(
    this.form.get('title')!.valueChanges.pipe(map((value: string) => generateSlug(value ?? ''))),
    { initialValue: '' }
  );

  errorBack = this.store.selectSignal(errorFormProject);

  isLoading$ = toSignal(this.store.select(loadingFormProject), {
    initialValue: false,
  });

  readonly setting$ = this.store.select(selectSetting);

  protected readonly categoryConfig = CATEGORY_CONFIG;
  protected readonly groupedTechnologies = groupTechnologiesByCategory(this.technologiesSignal);
  //#endregion

  //#region ciclo de vida de angular
  ngOnInit(): void {
    this.store.dispatch(SettingActions.getSetting());
    this.form.controls.visibility.valueChanges.subscribe(value => {
      const urlControls = [this.form.controls.urlGithub, this.form.controls.urlProyect];

      if (value === 'public') {
        urlControls.forEach(c => c.enable());
      } else {
        urlControls.forEach(c => {
          c.disable();
          c.setValue('');
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.setting$) {
      this.setting$.subscribe({
        next: (data: SettingList | null) => {
          if (data) {
            this.frontUrl.set(`${data.frontUrl}/proyecto`);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
    }
  }
  //#endregion

  //#region Getters y setters
  get titleControl() {
    return this.form.get('title');
  }

  getTitleError() {
    if (this.titleControl?.hasError('required') && this.titleControl?.touched) {
      return 'El titulo del proyecto es obligatorio.';
    }

    return '';
  }

  get summaryControl() {
    return this.form.get('summary');
  }

  getSummaryError() {
    if (this.summaryControl?.hasError('required') && this.summaryControl.touched) {
      return 'El resumen del proyecto es obligatorio';
    }

    return '';
  }

  get descriptionControl() {
    return this.form.get('description');
  }

  getResumeError(): string {
    if (this.descriptionControl?.hasError('required') && this.descriptionControl.touched) {
      return 'La descripción del proyecto es obligatoria.';
    }
    return '';
  }

  get visibilityControl() {
    return this.form.get('visibility');
  }

  getVisibilityError() {
    if (this.visibilityControl?.hasError('required') && this.visibilityControl.touched) {
      return 'La visibilidad del proyecto es obligatoria';
    }

    return '';
  }

  get typeControl() {
    return this.form.get('type');
  }

  getTypeError() {
    if (this.typeControl?.hasError('required') && this.typeControl.touched) {
      return 'El tipo del proyecto es obligatoria';
    }

    return '';
  }

  get publishedDateControl() {
    return this.form.get('publishedDate');
  }

  getPublishedDateError() {
    if (this.publishedDateControl?.hasError('required') && this.publishedDateControl.touched) {
      return 'La fecha del proyecto es obligatoria';
    }

    return '';
  }

  get urlGithubControl() {
    return this.form.get('urlGithub');
  }

  getGithubUrlError() {
    if (this.urlGithubControl?.hasError('required') && this.urlGithubControl.touched) {
      return 'La url del repositorio del proyecto es obligatoria';
    }

    return '';
  }

  get urlProyectControl() {
    return this.form.get('urlProyect');
  }

  getUrlProyectoError() {
    if (this.urlProyectControl?.hasError('required') && this.urlProyectControl.touched) {
      return 'La url del proyecto es obligatoria';
    }

    return '';
  }

  get featuresControl() {
    return this.form.get('features')!;
  }

  getFeatureError(): string {
    if (this.featuresControl.hasError('required') && this.featuresControl.touched) {
      return 'Las caracteristicas son requeridas.';
    }

    return '';
  }

  get features(): InsertOrUpdateProjectFeatDto[] {
    return this.form.controls.features.value;
  }

  get technologiesControl() {
    return this.form.get('technologies')!;
  }

  getTechnologiesError(): string {
    if (this.technologiesControl.hasError('required') && this.technologiesControl.touched) {
      return 'Las caracteristicas son requeridas.';
    }

    return '';
  }

  get technologies(): InsertOrUpdateProjectTecDto[] {
    return this.form.controls.technologies.value;
  }
  //#endregion

  //#region Funciones
  onPublishedDateChange(date: Date | null) {
    this.form.controls.publishedDate.setValue(date);
  }

  removeCoverImage() {
    this.coverImage.set('');
    this.selectedCoverFile = null;
  }

  handleCoverImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedCoverFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.coverImage.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  addFeature(): void {
    const description = this.featureInput.value.trim();
    if (!description || this.features.some(f => f.description === description)) return;

    const newFeature: InsertOrUpdateProjectFeatDto = {
      description,
      displayOrder: this.features.length + 1,
    };

    this.form.controls.features.setValue([...this.features, newFeature]);
    this.featureInput.reset();
  }

  removeFeature(feature: InsertOrUpdateProjectFeatDto): void {
    const updated = this.features
      .filter(f => f.description !== feature.description)
      .map((f, i) => ({ ...f, displayOrder: i + 1 }));

    this.form.controls.features.setValue(updated);
  }

  addTechnologie(): void {
    const name = this.technologieInput.value.trim();
    const category = this.selectedValue();

    if (!name || !category) return;
    if (this.technologies.some(t => t.name === name && t.category === category)) return;

    const newTech: InsertOrUpdateProjectTecDto = { name, category };
    this.form.controls.technologies.setValue([...this.technologies, newTech]);

    this.technologieInput.reset();
    this.selectedValue.set('');
  }

  removeTechnologie(technologie: InsertOrUpdateProjectTecDto): void {
    this.form.controls.technologies.setValue(
      this.technologies.filter(
        t => !(t.name === technologie.name && t.category === technologie.category)
      )
    );
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue();

    const dataParaBack = {
      ...rawValue,
      publishedDate: rawValue.publishedDate?.toISOString().split('T')[0],
    };

    const date = rawValue.publishedDate;
    let formattedDate = null;

    if (date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      formattedDate = `${day}/${month}/${year}`;
    }

    const fd = new FormData();

    fd.append('title', dataParaBack.title);
    fd.append('summary', dataParaBack.summary!);
    fd.append('description', dataParaBack.description!);
    fd.append('publishedDate', formattedDate!);
    fd.append('visibility', dataParaBack.visibility!);
    fd.append('type', dataParaBack.type!);
    fd.append('urlGithub', dataParaBack.urlGithub!);
    fd.append('urlProyect', dataParaBack.urlProyect!);
    fd.append('projectFeatures', JSON.stringify(dataParaBack.features));
    fd.append('projectTechnologies', JSON.stringify(dataParaBack.technologies));

    if (this.selectedCoverFile) {
      fd.append('file', this.selectedCoverFile);
    }

    this.store.dispatch(ProjectsActions.createProject({ data: fd }));
  }

  onMarkdownReady(): void {
    Prism.highlightAll();
  }
  //#endregion
}
