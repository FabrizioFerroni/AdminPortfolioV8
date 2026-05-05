import { ZardButtonComponent } from '@/shared/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/card-custom';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardSelectImports } from '@/shared/components/select';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ZardTableImports } from '@/shared/components/table';
import { LayoutService } from '@/shared/services/layout';
import { UtilsService } from '@/shared/services/utils-service';
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
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideClipboardList,
  lucideDownload,
  lucideLogIn,
  lucidePlus,
  lucideRefreshCw,
  lucideSearch,
  lucideTrash,
} from '@ng-icons/lucide';
import { Store } from '@ngrx/store';
import {
  AuditsLogsActions,
  selectAuditLogMeta,
  selectAuditLogsError,
  selectAuditLogsLoading,
  selectAuditLogstats,
  selectAuditLogstatsLoading,
  selectAuditsLogs,
} from '../store';
import { combineLatest, debounceTime, distinctUntilChanged, filter, skip } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SubscribersMeta } from '../../subscribers/interfaces';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { AsyncPipe } from '@angular/common';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { AuditLogsList } from '../interfaces';
import { ZardPaginationImports } from '@/shared/components/pagination';
import { AuditLogsService } from '../service/audit-log-service';

@Component({
  selector: 'app-audit-logs',
  imports: [
    NgIcon,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    ZardButtonComponent,
    ZardSkeletonComponent,
    ZardInputDirective,
    ZardSelectImports,
    ZardTableImports,
    ZardEmptyComponent,
    ZardBadgeComponent,
    ZardPaginationImports,
    AsyncPipe,
  ],
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.css',
  viewProviders: [
    provideIcons({
      lucideDownload,
      lucideLogIn,
      lucidePlus,
      lucideRefreshCw,
      lucideTrash,
      lucideSearch,
      lucideClipboardList,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogs implements OnInit {
  layout = inject(LayoutService);
  private readonly utilsService = inject(UtilsService);
  private readonly auditLogsService = inject(AuditLogsService);
  private readonly store = inject(Store);
  private readonly injector = inject(Injector);
  private destroyRef = inject(DestroyRef);

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

  isMovile = this.layout.isMobile;
  isExporting = signal(false);
  search = signal<string | null>(null);
  selectedValueActions = signal('all');
  selectedValueTime = signal('all');

  audits$ = this.store.select(selectAuditsLogs);
  isLoading$ = this.store.select(selectAuditLogsLoading);
  isLoadingStats = toSignal(this.store.select(selectAuditLogstatsLoading), {
    initialValue: true,
  });
  error$ = this.store.select(selectAuditLogsError);
  pagination$ = this.store.select(selectAuditLogMeta);
  stats$ = this.store.select(selectAuditLogstats);

  totalLogin = signal(0);
  totalCreated = signal(0);
  totalUpdated = signal(0);
  totalDeleted = signal(0);

  ngOnInit() {
    this.initSearch();
    this.initPagination();
    this.store.dispatch(AuditsLogsActions.getStats());
    this.initStatsSync();

    effect(
      () => {
        const limit = this.limit();
        this.store.dispatch(
          AuditsLogsActions.getAll({
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
        this.totalLogin.set(value.login);
        this.totalCreated.set(value.created);
        this.totalUpdated.set(value.updated);
        this.totalDeleted.set(value.deleted);
      });
  }

  private initSearch(): void {
    combineLatest([
      toObservable(this.search, { injector: this.injector }),
      toObservable(this.selectedValueActions, { injector: this.injector }),
      toObservable(this.selectedValueTime, { injector: this.injector }),
    ])
      .pipe(
        skip(1),
        debounceTime(400),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([searchValue, actions, time]) => {
        this.store.dispatch(
          AuditsLogsActions.getAll({
            paginado: {
              page: 1,
              limit: this.limit(),
              search: searchValue || null,
              actions: actions === 'all' ? null : actions,
              time: time === 'all' ? null : time,
            },
          })
        );
      });
  }

  handleExportCSV() {
    this.isExporting.set(true);

    this.auditLogsService
      .exportAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ body }) => {
          const audits = body!.data.audits;

          const headers = ['Accion', 'Usuario', 'Modulo', 'Detalle', 'Fecha', 'IP'];

          const rows = audits.map(aud => [
            aud.action,
            aud.user,
            aud.module,
            aud.details,
            aud.date,
            aud.ip,
          ]);

          const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');

          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.setAttribute('href', url);
          link.setAttribute('download', 'audits.csv');
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
    return;
  }

  getActionVariant(
    action: AuditLogsList['action']
  ): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (action) {
      case 'Create':
        return 'default';
      case 'Update':
        return 'secondary';
      case 'Delete':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  getActionName(action: AuditLogsList['action']): string {
    switch (action) {
      case 'Create':
        return 'Creo';
      case 'Update':
        return 'Actualizo';
      case 'Delete':
        return 'Elimino';
      default:
        return 'Inicio sesión';
    }
  }

  handleItemsPerPageChange(value: string | string[]) {
    const parsed = parseInt(Array.isArray(value) ? value[0] : value);
    this.limit.set(parsed);
    this.selectedValue.set(String(parsed));
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.store.dispatch(
      AuditsLogsActions.getAll({
        paginado: { page, limit: this.limit() },
      })
    );
  }

  goToPrevious() {
    if (this.hasPreviousPage()) {
      const page = this.currentPage() - 1;
      this.currentPage.set(page);
      this.store.dispatch(
        AuditsLogsActions.getAll({
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
        AuditsLogsActions.getAll({
          paginado: { page, limit: this.limit() },
        })
      );
    }
  }
}
