import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDialogRef } from '@/shared/components/dialog';
import { ZardFormImports } from '@/shared/components/form';
import { ZardInputDirective } from '@/shared/components/input';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileText, lucideUpload, lucideX } from '@ng-icons/lucide';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CVForm } from '../interfaces/cv.interface';
import { UserActions } from '../store';
import { take } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ZardInputDirective,
    ZardFormImports,
    ZardButtonComponent,
    NgIcon,
  ],
  templateUrl: './cv-dialog.html',
  styleUrl: './cv-dialog.css',
  viewProviders: [
    provideIcons({
      lucideX,
      lucideUpload,
      lucideFileText,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CVDialog {
  //#region Inyecciones
  private readonly store = inject(Store);
  private readonly dialogRef = inject(ZardDialogRef);
  private readonly actions$ = inject(Actions);
  private sanitizer = inject(DomSanitizer);
  //#endregion

  //#region variables
  selectedCoverFile: File | null = null;
  cvPreviewUrl = signal<SafeResourceUrl | null>(null);
  private objectUrl: string | null = null;
  private readonly PDF_VIEWER_PARAMS = '#toolbar=0&navpanes=0&scrollbar=0&view=FitH';
  readonly canPreviewPdf = typeof navigator === 'undefined' || (navigator.pdfViewerEnabled ?? true);

  form: FormGroup<CVForm> = new FormGroup<CVForm>({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });
  //#endregion

  //#region inicializacion
  constructor() {
    inject(DestroyRef).onDestroy(() => this.revokePreview());
  }
  //#endregion

  //#region Getters y setters
  get nameControl() {
    return this.form.get('name');
  }

  getNameError() {
    if (this.nameControl?.hasError('required') && this.nameControl?.touched) {
      return 'El nombre de descarga del cv es obligatoria.';
    }

    return '';
  }
  //#endregion

  //#region functions
  handleCVUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    this.revokePreview(); // libera la URL anterior antes de crear otra
    this.selectedCoverFile = file;
    this.objectUrl = URL.createObjectURL(file);
    this.cvPreviewUrl.set(
      this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl + this.PDF_VIEWER_PARAMS)
    );
  }

  removeCV() {
    this.revokePreview();
    this.selectedCoverFile = null;
    this.cvPreviewUrl.set(null);
  }

  private revokePreview() {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  handleSubmitCV(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const fd = new FormData();
    const rawValue = this.form.getRawValue();

    if (this.selectedCoverFile) {
      fd.append('file', this.selectedCoverFile);
    }

    fd.append('name', rawValue.name);

    this.store.dispatch(UserActions.uploadCV({ data: fd }));

    this.actions$
      .pipe(ofType(UserActions.uploadCVSuccess), take(1))
      .subscribe(() => this.dialogRef.close());
  }
  //#endregion
}
