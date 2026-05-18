import { ZardAlertComponent } from '@/shared/components/alert';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { ZardButtonComponent } from '@/shared/components/button';
import { Card } from '@/shared/components/card-custom';
import { ZardDatePickerComponent } from '@/shared/components/date-picker';
import { ZardFormImports } from '@/shared/components/form';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ZardTooltipImports } from '@/shared/components/tooltip';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
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
  lucidePencil,
  lucidePlus,
  lucideTrash2,
  lucideUpload,
  lucideUser,
  lucideUsersRound,
  lucideX,
} from '@ng-icons/lucide';
import { Store } from '@ngrx/store';
import {
  DeleteProjectTechFeat,
  InsertOrUpdateProjectFeatDto,
  InsertOrUpdateProjectTecDto,
  ProjectFormControls,
  ProjectImageList,
  ProjectList,
} from '../../interfaces';
import { Rutas } from '@/shared/utils';
import {
  errorFormProject,
  errorProject,
  imageLoadingProject,
  imagesSelectedProject,
  loadingFormProject,
  loadingProject,
  ProjectsActions,
  selectProject,
  statusCodeProject,
} from '../../store';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { ZardTabComponent, ZardTabGroupComponent } from '@/shared/components/tabs';
import { map, startWith } from 'rxjs';
import { generateSlug } from '@/shared/functions';
import { selectSetting, SettingActions } from '@/features/app/settings/store';
import { CATEGORY_CONFIG, groupTechnologiesByCategory } from '../../utils';
import { SettingList } from '@/features/app/settings/interfaces';
import { ZardSelectImports } from '@/shared/components/select';

@Component({
  selector: 'app-updateproject',
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
    ZardSkeletonComponent,
    ZardTabComponent,
    ZardTabGroupComponent,
    ZardSelectImports,
    ZardTooltipImports,
    RouterLink,
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
      lucideFolderKanban,
      lucideUpload,
      lucideTrash2,
      lucideGlobe,
      lucideLock,
      lucideUser,
      lucideUsersRound,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProject implements OnInit, AfterViewInit {
  //#region Dependencias
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  //#endregion

  //#region Variables
  id = input.required<string>();
  title = signal('');
  altText = signal('');
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
  protected readonly isAddTechDisabled = computed(
    () => !this.techInputValue()?.trim() || !this.selectedValue()
  );

  protected readonly isAddFeatDisabled = computed(() => !this.featInputValue()?.trim());
  deleteDataFT: DeleteProjectTechFeat[] = [];

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

  project$ = this.store.select(selectProject);
  galleryImages = toSignal(this.store.select(imagesSelectedProject), {
    initialValue: [] as ProjectImageList[],
  });
  projectLoading = toSignal(this.store.select(loadingProject), {
    initialValue: false,
  });
  isLoadingBack$ = this.store.select(loadingProject);
  isLoadingImagesBack = toSignal(this.store.select(imageLoadingProject), { initialValue: false });
  error$ = this.store.select(errorProject);
  statusCode$ = this.store.select(statusCodeProject);

  readonly setting$ = this.store.select(selectSetting);

  protected readonly categoryConfig = CATEGORY_CONFIG;
  protected readonly groupedTechnologies = groupTechnologiesByCategory(this.technologiesSignal);

  //#endregion

  //#region Ciclo de vida angular
  ngOnInit(): void {
    this.getData();
    this.getDataImg();
    this.projectNotFound();
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
    if (this.project$) {
      this.project$.subscribe({
        next: (data: ProjectList | null) => {
          if (data) {
            this.title.set(data.title);
            this.form.patchValue(data);
            this.coverImage.set(data.imageFullUrl);
            this.form.controls.technologies.setValue(
              data.technologies.map(tech => ({
                id: tech.id,
                name: tech.name,
                category: tech.category.toLowerCase(),
              }))
            );
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
    }

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
  get skeletonImagesItems() {
    return Array(3);
  }

  getData() {
    this.store.dispatch(ProjectsActions.getById({ id: this.id() }));
  }

  getDataImg() {
    this.store.dispatch(ProjectsActions.getImagesByProjectId({ projectId: this.id() }));
  }

  projectNotFound() {
    this.statusCode$.subscribe({
      next: (res: number | null) => {
        const statusCode = res;

        if (statusCode === 404) {
          toast.error('Upps.. hubo un error', {
            description: 'El projecto buscado no existe',
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

  handleGalleryImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const fd = new FormData();

    fd.append('file', file);
    fd.append('projectId', this.id());
    fd.append('projectName', this.title());
    fd.append('altText', `${this.title()} ${this.id()}`);
    fd.append('displayOrder', `${this.galleryImages()!.length + 1}`);

    this.store.dispatch(ProjectsActions.createProjectImage({ data: fd }));
  }

  removeGalleryImage(id: string): void {
    this.store.dispatch(ProjectsActions.deleteProjectImage({ id, projectId: this.id() }));
  }

  removeAllGalleryImages(): void {
    this.store.dispatch(ProjectsActions.deleteProjectImageAll({ projectId: this.id() }));
  }

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

  removeFeature(feature: InsertOrUpdateProjectFeatDto, id: string): void {
    const updated = this.features
      .filter(f => f.description !== feature.description)
      .map((f, i) => ({ ...f, displayOrder: i + 1 }));

    this.form.controls.features.setValue(updated);

    this.deleteDataFT.push({
      id,
      module: 1,
    });
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

  removeTechnologie(technologie: InsertOrUpdateProjectTecDto, id: string): void {
    this.form.controls.technologies.setValue(
      this.technologies.filter(
        t => !(t.name === technologie.name && t.category === technologie.category)
      )
    );

    this.deleteDataFT.push({
      id,
      module: 2,
    });

    console.log('delete data', this.deleteDataFT);
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue();

    const rawDate = rawValue.publishedDate;
    let formattedDate: string | null = null;

    if (rawDate) {
      const date = rawDate instanceof Date ? rawDate : new Date(rawDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      formattedDate = `${day}/${month}/${year}`;
    }

    const fd = new FormData();

    fd.append('title', rawValue.title);
    fd.append('summary', rawValue.summary!);
    fd.append('description', rawValue.description!);
    fd.append('publishedDate', formattedDate!);
    fd.append('visibility', rawValue.visibility!);
    fd.append('type', rawValue.type!);
    fd.append('urlGithub', rawValue.urlGithub!);
    fd.append('urlProyect', rawValue.urlProyect!);
    fd.append('deleteDataFT', JSON.stringify(this.deleteDataFT));
    fd.append('projectFeatures', JSON.stringify(rawValue.features));
    fd.append('projectTechnologies', JSON.stringify(rawValue.technologies));

    if (this.selectedCoverFile) {
      fd.append('file', this.selectedCoverFile);
    }

    this.store.dispatch(ProjectsActions.updateProject({ id: this.id(), data: fd }));
  }
  //#endregion
}
