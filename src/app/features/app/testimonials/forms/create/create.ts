import { ZardAlertComponent } from '@/shared/components/alert';
import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { Card } from '@/shared/components/card-custom';
import { Rutas } from '@/shared/utils';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideContainer,
  lucideHouse,
  lucideLoader2,
  lucideMonitor,
  lucideMonitorSmartphone,
  lucidePlus,
  lucideServer,
  lucideTabletSmartphone,
  lucideUpload,
  lucideUserStar,
  lucideX,
} from '@ng-icons/lucide';
import { Store } from '@ngrx/store';
import { TestimonialFormControls } from '../../interface';
import { selectFormError, selectIsLoadingForm, TestimonialsActions } from '../../store';
import { toSignal } from '@angular/core/rxjs-interop';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardTooltipImports } from '@/shared/components/tooltip';
import { ZardFormImports } from '@/shared/components/form';
import { ZardSelectImports } from '@/shared/components/select';
import { ZardSwitchComponent } from '@/shared/components/switch';
import { RouterLink } from '@angular/router';
import { ProjectsActions, selectProjectSelect } from '@/features/app/projects/store';
import { ProjectGroup } from '@/features/app/projects/interfaces';

@Component({
  imports: [
    NgIcon,
    Card,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    ZardInputDirective,
    ZardBreadcrumbImports,
    ZardAlertComponent,
    ZardButtonComponent,
    ZardTooltipImports,
    ZardFormImports,
    ZardSelectImports,
    ZardSwitchComponent,
  ],
  styleUrl: './create.css',
  templateUrl: './create.html',
  viewProviders: [
    provideIcons({
      lucideUserStar,
      lucidePlus,
      lucideHouse,
      lucideLoader2,
      lucideX,
      lucideUpload,
      lucideMonitor,
      lucideServer,
      lucideMonitorSmartphone,
      lucideTabletSmartphone,
      lucideContainer,
    }),
  ],
})
export class CreateTestimonial implements OnInit {
  //#region Dependencias
  private readonly store = inject(Store);
  //#endregion

  //#region Variables
  readonly baseRoute = `/${Rutas.TESTIMONIALS}`;
  readonly homeRoute = `/${Rutas.DASHBOARD}`;
  coverImage = signal<string | null>(null);
  selectedCoverFile: File | null = null;

  form: FormGroup<TestimonialFormControls> = new FormGroup<TestimonialFormControls>({
    fullname: new FormControl('', { nonNullable: true, validators: Validators.required }),
    position: new FormControl('', { nonNullable: true, validators: Validators.required }),
    empresa: new FormControl('', { nonNullable: true, validators: Validators.required }),
    comment: new FormControl('', { nonNullable: true, validators: Validators.required }),
    projectId: new FormControl('', { nonNullable: true }),
    visible: new FormControl<boolean>(
      { value: false, disabled: false },
      { nonNullable: true, validators: Validators.required }
    ),
  });
  selectedValue = signal<string>('');
  //#endregion

  //#region inicializacion ciclo de vida
  ngOnInit() {
    this.store.dispatch(ProjectsActions.getProjectSelect());
  }
  //#endregion

  //#region redux
  errorBack = this.store.selectSignal(selectFormError);

  projects = toSignal(this.store.select(selectProjectSelect), {
    initialValue: [],
  });

  groupedProjects = computed<ProjectGroup[]>(() => {
    const groups = new Map<string, ProjectGroup>();

    for (const item of this.projects()) {
      if (!groups.has(item.category)) {
        groups.set(item.category, { category: item.category, items: [] });
      }
      groups.get(item.category)!.items.push(item);
    }

    return Array.from(groups.values());
  });

  isLoading$ = toSignal(this.store.select(selectIsLoadingForm), {
    initialValue: false,
  });
  //#endregion

  //#region Getters y setters
  get fullnameControl() {
    return this.form.get('fullname');
  }

  getFullnameError() {
    if (this.fullnameControl?.hasError('required') && this.fullnameControl?.touched) {
      return 'El nombre del cliente es obligatorio.';
    }

    return '';
  }

  get positionControl() {
    return this.form.get('position');
  }

  getPositionError() {
    if (this.positionControl?.hasError('required') && this.positionControl.touched) {
      return 'La posición del cliente es obligatorio';
    }

    return '';
  }

  get empresaControl() {
    return this.form.get('empresa');
  }

  getEmpresaError(): string {
    if (this.empresaControl?.hasError('required') && this.empresaControl.touched) {
      return 'La empresa del cliente es obligatoria.';
    }
    return '';
  }

  get commentControl() {
    return this.form.get('comment');
  }

  getCommentError() {
    if (this.commentControl?.hasError('required') && this.commentControl.touched) {
      return 'El comentario del cliente es obligatoria';
    }

    return '';
  }

  get proyectoControl() {
    return this.form.get('proyectoId');
  }

  getProyectoError() {
    if (this.proyectoControl?.hasError('required') && this.proyectoControl.touched) {
      return 'El proyecto del cliente es obligatoria';
    }

    return '';
  }

  get visibleControl() {
    return this.form.controls.visible;
  }

  getVisibleModeError(): string {
    if (this.visibleControl.hasError('required') && this.visibleControl.touched) {
      return 'El modo de mantenimiento es requerido.';
    }
    return '';
  }
  //#endregion

  //#region funciones
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

  iconCategory(category: string): string {
    switch (category) {
      case 'frontend':
        return 'lucideMonitor';
      case 'backend':
        return 'lucideServer';
      case 'fullstack':
        return 'lucideMonitorSmartphone';
      case 'mobile':
        return 'lucideTabletSmartphone';
      case 'devops':
        return 'lucideContainer';
      default:
        return '';
    }
  }

  capitalizeCategory(category: string): string {
    switch (category) {
      case 'frontend':
        return 'Frontend';
      case 'backend':
        return 'Backend';
      case 'fullstack':
        return 'FullStack';
      case 'mobile':
        return 'Mobile';
      case 'devops':
        return 'DevOps';
      default:
        return '';
    }
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.selectedCoverFile) {
      return;
    }

    const rawValue = this.form.getRawValue();

    const fd = new FormData();
    fd.append('fullname', rawValue.fullname);
    fd.append('position', rawValue.position);
    fd.append('empresa', rawValue.empresa);
    fd.append('comment', rawValue.comment);
    fd.append('visible', rawValue.visible.toString());
    fd.append('projectId', rawValue.projectId);

    if (this.selectedCoverFile) {
      fd.append('file', this.selectedCoverFile);
    }

    this.store.dispatch(TestimonialsActions.createTestimonial({ data: fd }));
  }
  //#endregion
}
