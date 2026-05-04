import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardButtonComponent } from '@/shared/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/card-custom';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardTableImports } from '@/shared/components/table';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Injector,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCopy,
  lucideDownload,
  lucideEye,
  lucideMail,
  lucideMailPlus,
  lucideMoreVertical,
  lucideSearch,
  lucideTrash2,
  lucideUserCheck,
  lucideUsers,
  lucideUserX,
} from '@ng-icons/lucide';
import { UtilsService } from '@/shared/services/utils-service';
import { Store } from '@ngrx/store';
import {
  selectSubscriberMeta,
  selectSubscribers,
  selectSubscribersError,
  selectSubscribersLoading,
  selectSubscriberStats,
  selectSubscriberStatsLoading,
  SubscribersActions,
} from './store';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { AsyncPipe } from '@angular/common';
import { SubscriberList, SubscribersMeta } from './interfaces';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog';
import { ZardSelectImports } from '@/shared/components/select';
import { ZardPaginationImports } from '@/shared/components/pagination';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, skip } from 'rxjs';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { SubscribersService } from './service/subscribers';
import { ZardTooltipImports } from '@/shared/components/tooltip';
import { ZardSheetImports, ZardSheetService } from '@/shared/components/sheet';
import { FormMailComponent } from './forms/form-mail';
import { FormGroup } from '@angular/forms';
import { LayoutService } from '@/shared/services/layout';

@Component({
  selector: 'app-subscribers',
  imports: [
    NgIcon,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    ZardButtonComponent,
    ZardInputDirective,
    ZardTableImports,
    ZardBadgeComponent,
    ZardEmptyComponent,
    ZardSelectImports,
    ZardPaginationImports,
    ZardSkeletonComponent,
    ZardTooltipImports,
    ZardSheetImports,
    AsyncPipe,
  ],
  templateUrl: './subscribers.html',
  styleUrl: './subscribers.css',
  viewProviders: [
    provideIcons({
      lucideDownload,
      lucideUsers,
      lucideUserX,
      lucideUserCheck,
      lucideSearch,
      lucideEye,
      lucideCopy,
      lucideMail,
      lucideMoreVertical,
      lucideTrash2,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Subscribers implements OnInit {
  private readonly alertDialogService = inject(ZardAlertDialogService);
  private readonly utilsService = inject(UtilsService);
  private readonly store = inject(Store);
  private readonly injector = inject(Injector);
  private destroyRef = inject(DestroyRef);
  private readonly subscribersService = inject(SubscribersService);
  private sheetService = inject(ZardSheetService);
  layout = inject(LayoutService);

  isMovile = this.layout.isMobile;
  limit = signal(10);
  selectedValue = signal('10');
  readonly items = ['1', '5', '10', '20', '50', '100'];
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly hasNextPage = signal(false);
  readonly hasPreviousPage = signal(false);
  readonly pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));
  readonly totalItems = signal(0);
  readonly rangeStart = computed(() => (this.currentPage() - 1) * this.limit() + 1);
  readonly rangeEnd = computed(() =>
    Math.min(this.currentPage() * this.limit(), this.totalItems())
  );
  search = signal<string | null>(null);
  totalSub = signal(0);
  activeSub = signal(0);
  inactiveSub = signal(0);
  isExporting = signal(false);

  subscribers$ = this.store.select(selectSubscribers);
  isLoading$ = this.store.select(selectSubscribersLoading);
  isLoadingStats = toSignal(this.store.select(selectSubscriberStatsLoading), {
    initialValue: true,
  });
  error$ = this.store.select(selectSubscribersError);
  pagination$ = this.store.select(selectSubscriberMeta);
  stats$ = this.store.select(selectSubscriberStats);

  ngOnInit() {
    this.initSearch();
    this.initPagination();
    this.store.dispatch(SubscribersActions.getStats());
    this.initStatsSync();

    effect(
      () => {
        const limit = this.limit();
        this.store.dispatch(
          SubscribersActions.getAll({
            paginado: { page: 1, limit, search: untracked(() => this.search()) },
          })
        );
      },
      { injector: this.injector }
    );
  }

  private initPagination(): void {
    this.pagination$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((value: SubscribersMeta | null): value is SubscribersMeta => value !== null)
      )
      .subscribe({
        next: (value: SubscribersMeta) => {
          this.currentPage.set(value.currentPage);
          this.totalPages.set(value.totalPages);
          this.totalItems.set(value.totalItems);
          this.hasNextPage.set(value.hasNextPage);
          this.hasPreviousPage.set(value.hasPreviousPage);
        },
        error: (error: HttpErrorResponse) => {
          console.error(`Error obteniendo la paginación: ${error.message}`);
        },
      });
  }

  private initStatsSync(): void {
    this.stats$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(value => value !== null)
      )
      .subscribe(value => {
        this.totalSub.set(value!.total);
        this.activeSub.set(value!.active);
        this.inactiveSub.set(value!.inactive);
      });
  }

  private initSearch(): void {
    toObservable(this.search, { injector: this.injector })
      .pipe(skip(1), debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(searchValue => {
        this.store.dispatch(
          SubscribersActions.getAll({
            paginado: { page: 1, limit: this.limit(), search: searchValue || null },
          })
        );
      });
  }

  handleExportCSV() {
    this.isExporting.set(true);

    this.subscribersService
      .exportAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ body }) => {
          const subscribers = body!.data.subscribers;

          const headers = ['Nombre', 'Email', 'Fecha', 'Estado'];

          const rows = subscribers.map(sub => [
            sub.name,
            sub.email,
            this.formatDate(sub.subscribed_at),
            sub.status ? 'Activo' : 'Inactivo',
          ]);

          const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');

          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.setAttribute('href', url);
          link.setAttribute('download', 'subscribers.csv');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          this.isExporting.set(false);
        },
        error: () => {
          this.isExporting.set(false);
        },
      });
  }

  formatDate(subscribedAt: Date): string {
    const dateStr = subscribedAt.toLocaleString();
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes] = (timePart ?? '00:00').split(':');

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes)
    );

    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  getStatusVariant(status: SubscriberList['status']): 'default' | 'secondary' {
    switch (status) {
      case true:
        return 'default';
      default:
        return 'secondary';
    }
  }

  getStatusName(status: SubscriberList['status']): 'Activo' | 'Inactivo' {
    switch (status) {
      case true:
        return 'Activo';
      default:
        return 'Inactivo';
    }
  }

  copyPaymentId(id: string): void {
    navigator.clipboard.writeText(id);
    console.log('Payment ID copied:', id);
  }

  handleItemsPerPageChange(value: string | string[]) {
    const parsed = parseInt(Array.isArray(value) ? value[0] : value);
    this.limit.set(parsed);
    this.selectedValue.set(String(parsed));
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.store.dispatch(
      SubscribersActions.getAll({
        paginado: { page, limit: this.limit() },
      })
    );
  }

  goToPrevious() {
    if (this.hasPreviousPage()) {
      const page = this.currentPage() - 1;
      this.currentPage.set(page);
      this.store.dispatch(
        SubscribersActions.getAll({
          paginado: { page, limit: this.limit() },
        })
      );
    }
  }

  goToNext() {
    if (this.hasNextPage()) {
      const page = this.currentPage() + 1;
      this.currentPage.set(page);
      this.store.dispatch(
        SubscribersActions.getAll({
          paginado: { page, limit: this.limit() },
        })
      );
    }
  }

  openSheet(name: string, email: string) {
    this.sheetService.create({
      zTitle: 'Enviar email a subscriptor',
      zDescription: `Envía un correo electrónico a ${name} (${email})`,
      zContent: FormMailComponent,
      zOkText: 'Enviar Email',
      zOkIcon: lucideMailPlus,
      zCancelText: 'Cancelar',
      zOnOk: instance => this.sendMail(instance.form),
    });
  }

  private sendMail({ value }: FormGroup) {
    console.log('Form submitted:', value);
  }

  private deleteSub(email: string) {
    this.store.dispatch(SubscribersActions.delete({ email }));
  }

  onDelete(email: string) {
    this.alertDialogService.confirm({
      zTitle: '¿Estás completamente seguro?',
      zDescription:
        'Esta acción es irreversible. Eliminará permanentemente el subscriptor y borrará los datos de nuestros servidores.',
      zOkDestructive: true,
      zOkText: 'Si, borrar',
      zCancelText: 'No, cancelar',
      zOnOk: () => this.deleteSub(email),
    });
  }
}
