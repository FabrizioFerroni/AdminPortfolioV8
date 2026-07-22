import { injectDialogData, ZardDialogRef } from '@/shared/components/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ProjectsActions } from '../../../store';
import { Store } from '@ngrx/store';
import { ZardFormImports } from '@/shared/components/form';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardButtonComponent } from '@/shared/components/button';
import { AltTextForm } from '../../../interfaces';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUpload, lucideX } from '@ng-icons/lucide';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs';

interface iImageData {
  projectId: string;
  title: string;
  imageLength: number;
}

@Component({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ZardInputDirective,
    ZardFormImports,
    ZardButtonComponent,
    NgIcon,
  ],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
  viewProviders: [
    provideIcons({
      lucideX,
      lucideUpload,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageDialog implements OnInit {
  //#region Inyecciones
  private zData = injectDialogData<iImageData>();
  private readonly store = inject(Store);
  private readonly dialogRef = inject(ZardDialogRef);
  private readonly actions$ = inject(Actions);
  //#endregion

  //#region variables
  projectId: WritableSignal<string> = signal<string>('');
  title: WritableSignal<string> = signal<string>('');
  imageLength: WritableSignal<number> = signal<number>(0);
  coverImage = signal<string | null>(null);
  selectedCoverFile: File | null = null;

  form: FormGroup<AltTextForm> = new FormGroup<AltTextForm>({
    altText: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });
  //#endregion

  //#region inicializacion
  ngOnInit(): void {
    this.projectId.set(this.zData.projectId);
    this.title.set(this.zData.title);
    this.imageLength.set(this.zData.imageLength);
  }
  //#endregion

  //#region Getters y setters
  get altTextControl() {
    return this.form.get('altText');
  }

  getAltTextError() {
    if (this.altTextControl?.hasError('required') && this.altTextControl?.touched) {
      return 'El alt text de la imagen es obligatoria.';
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

  handleSubmitImages(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const fd = new FormData();
    const rawValue = this.form.getRawValue();

    if (this.selectedCoverFile) {
      fd.append('file', this.selectedCoverFile);
    }
    fd.append('projectId', this.projectId());
    fd.append('projectName', this.title());
    fd.append('altText', rawValue.altText);
    fd.append('displayOrder', `${this.imageLength()! + 1}`);

    this.store.dispatch(ProjectsActions.createProjectImage({ data: fd }));

    this.actions$
      .pipe(ofType(ProjectsActions.createProjectImageSuccess), take(1))
      .subscribe(() => this.dialogRef.close());
  }
  //#endregion
}
