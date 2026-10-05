import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideFileStack,
  lucideFileText,
  lucideArchive,
  lucideUpload,
  lucideX,
} from '@ng-icons/lucide';
import { Store } from '@ngrx/store';
import {
  errorGetOldsCVS,
  getOldsCVSData,
  isLoadingGetOldsCVS,
  statusCodeGetOldsCVS,
  UserActions,
} from '../store';
import { toSignal } from '@angular/core/rxjs-interop';
import { FileSizePipe } from '@/shared/pipes';
import { DatePipe } from '@angular/common';
import { stripPdfExtension } from '@/shared/functions';

@Component({
  imports: [NgIcon, FileSizePipe, DatePipe],
  templateUrl: './old-cv-dialog.html',
  styleUrl: './old-cv-dialog.css',
  viewProviders: [
    provideIcons({
      lucideX,
      lucideUpload,
      lucideFileText,
      lucideFileStack,
      lucideCalendar,
      lucideArchive,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OldCVDialog implements OnInit {
  //#region Inyecciones
  private readonly store = inject(Store);
  //#endregion

  //#region variables
  cvs = this.store.selectSignal(getOldsCVSData);
  readonly cvItems = computed(() =>
    (this.cvs() ?? []).map(cv => ({
      ...cv,
      downloadName: stripPdfExtension(cv.downloadName),
    }))
  );
  readonly isLoadingGetOldsCVSBack = toSignal(this.store.select(isLoadingGetOldsCVS), {
    initialValue: false,
  });
  readonly errorGetOldsCVSBack = this.store.selectSignal(errorGetOldsCVS);
  readonly statusCodeGetOldsCVSBack = this.store.selectSignal(statusCodeGetOldsCVS);
  //#endregion

  //#region inicializacion
  ngOnInit() {
    this.store.dispatch(UserActions.getOldsCV());
  }
  //#endregion

  //#region getters
  get skeletonOldsCvsItems() {
    return Array(5);
  }
  //#endregion
}
