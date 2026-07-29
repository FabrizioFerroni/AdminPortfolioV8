import { ZardAlertDialogService } from '@/shared/components/alert-dialog';
import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { ZardButtonComponent } from '@/shared/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/card-custom';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardPaginationImports } from '@/shared/components/pagination';
import { ZardSelectImports } from '@/shared/components/select';
import { LayoutService } from '@/shared/services/layout';
import { UtilsService } from '@/shared/services/utils-service';
import { Rutas } from '@/shared/utils';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Injector,
  signal,
  untracked,
  OnInit,
  effect,
  AfterViewInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCode,
  lucideEye,
  lucideFolderKanban,
  lucideGitPullRequest,
  lucideGitPullRequestDraft,
  lucideGlobe,
  lucideHouse,
  lucideImages,
  lucideLock,
  lucidePencil,
  lucidePlus,
  lucideSearch,
  lucideServer,
  lucideTrash2,
  lucideUser,
  lucideUsersRound,
} from '@ng-icons/lucide';
import { Store } from '@ngrx/store';
import {
  errorProject,
  loadingProject,
  paginationMeta,
  ProjectsActions,
  selectProjects,
  selectProjectsStats,
  selectProjectsStatsLoading,
} from '../store';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime, distinctUntilChanged, filter, skip } from 'rxjs';
import { Pagination } from '@/shared/interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardTableImports } from '@/shared/components/table';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ZardTooltipImports } from '@/shared/components/tooltip';
import { selectSetting, SettingActions } from '../../settings/store';
import { SettingList } from '../../settings/interfaces';

@Component({
  selector: 'app-projects',
  imports: [
    NgIcon,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    ZardInputDirective,
    ZardButtonComponent,
    ZardBreadcrumbImports,
    ZardPaginationImports,
    ZardSelectImports,
    ZardEmptyComponent,
    ZardTableImports,
    ZardBadgeComponent,
    ZardSkeletonComponent,
    ZardTooltipImports,
    RouterLink,
    AsyncPipe,
    DatePipe,
  ],
  templateUrl: './page.html',
  styleUrl: './page.css',
  viewProviders: [
    provideIcons({
      lucidePlus,
      lucideSearch,
      lucidePencil,
      lucideTrash2,
      lucideHouse,
      lucideCode,
      lucideFolderKanban,
      lucideServer,
      lucideImages,
      lucideLock,
      lucideGlobe,
      lucideUser,
      lucideUsersRound,
      lucideEye,
      lucideGitPullRequestDraft,
      lucideGitPullRequest,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Project implements OnInit, AfterViewInit {
  //#region injecciones
  private readonly alertDialogService = inject(ZardAlertDialogService);
  private readonly layout = inject(LayoutService);
  private readonly utilsService = inject(UtilsService);
  private readonly store = inject(Store);
  private readonly injector = inject(Injector);
  private destroyRef = inject(DestroyRef);
  //#endregion

  //#region variables
  limit = signal(10);
  selectedValue = signal('10');
  readonly homeRoute = `/${Rutas.DASHBOARD}`;
  readonly items = ['1', '5', '10', '20', '50', '100'];
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly hasNextPage = signal(false);
  readonly hasPreviousPage = signal(false);
  readonly pages = computed<(number | null)[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const delta = 1;
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    const pages: (number | null)[] = [1];

    if (left > 2) pages.push(null);

    for (let i = left; i <= right; i++) pages.push(i);

    if (right < total - 1) pages.push(null);

    pages.push(total);

    return pages;
  });
  readonly totalItems = signal(0);
  readonly rangeStart = computed(() => (this.currentPage() - 1) * this.limit() + 1);
  readonly rangeEnd = computed(() =>
    Math.min(this.currentPage() * this.limit(), this.totalItems())
  );
  newRoute = `/${Rutas.PROJECTS}/${Rutas.NEW_ROUTES_O}`;
  updateRoute = `/${Rutas.PROJECTS}/${Rutas.UPDATE_ROUTES}`;
  frontUrl = '';

  isMovile = this.layout.isMobile;
  total = signal(0);
  totalFront = signal(0);
  totalBack = signal(0);
  totalImgs = signal(0);
  search = signal<string | null>(null);
  //#endregion

  //#region imports reducers
  readonly projects$ = this.store.select(selectProjects);
  readonly isLoading$ = this.store.select(loadingProject);
  readonly error$ = this.store.select(errorProject);
  readonly pagination$ = this.store.select(paginationMeta);
  readonly isLoadingStats = toSignal(this.store.select(selectProjectsStatsLoading), {
    initialValue: true,
  });
  readonly stats$ = this.store.select(selectProjectsStats);
  readonly setting$ = this.store.select(selectSetting);
  //#endregion

  //#region ciclo de vida de angular
  ngOnInit() {
    this.initSearch();
    this.initPagination();
    this.store.dispatch(ProjectsActions.getStats());
    this.store.dispatch(SettingActions.getSetting());
    this.initStatsSync();

    effect(
      () => {
        const limit = this.limit();
        this.store.dispatch(
          ProjectsActions.getAll({
            paginado: { page: 1, limit, search: untracked(() => this.search()) },
          })
        );
      },
      { injector: this.injector }
    );
  }

  ngAfterViewInit(): void {
    if (this.setting$) {
      this.setting$.subscribe({
        next: (data: SettingList | null) => {
          if (data) {
            this.frontUrl = data.frontUrl;
            this.frontUrl = `${this.frontUrl}/proyecto`;
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
    }
  }
  //#endregion

  //#region getters
  get skeletonStatsItems() {
    return Array(4);
  }

  get skeletonItems() {
    return Array(this.limit());
  }
  //#endregion

  //#region inicializacion de datos
  private initPagination(): void {
    this.pagination$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((value: Pagination | null): value is Pagination => value !== null)
      )
      .subscribe({
        next: (value: Pagination) => {
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
        this.total.set(value.total);
        this.totalFront.set(value.totalFront);
        this.totalBack.set(value.totalBack);
        this.totalImgs.set(value.totalImgs);
      });
  }

  private initSearch(): void {
    combineLatest([toObservable(this.search, { injector: this.injector })])
      .pipe(
        skip(1),
        debounceTime(400),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([searchValue]) => {
        this.store.dispatch(
          ProjectsActions.getAll({
            paginado: {
              page: 1,
              limit: this.limit(),
              search: searchValue || null,
            },
          })
        );
      });
  }
  //#endregion

  //#region paginado
  handleItemsPerPageChange(value: string | string[]) {
    const parsed = parseInt(Array.isArray(value) ? value[0] : value);
    this.limit.set(parsed);
    this.selectedValue.set(String(parsed));
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.store.dispatch(
      ProjectsActions.getAll({
        paginado: { page, limit: this.limit() },
      })
    );
  }

  goToPrevious() {
    if (this.hasPreviousPage()) {
      const page = this.currentPage() - 1;
      this.currentPage.set(page);
      this.store.dispatch(
        ProjectsActions.getAll({
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
        ProjectsActions.getAll({
          paginado: { page, limit: this.limit() },
        })
      );
    }
  }
  //#endregion

  //#region Funciones
  private deleteProject(id: string) {
    this.store.dispatch(ProjectsActions.deleteProject({ id }));
  }

  onDelete(id: string) {
    this.alertDialogService.confirm({
      zTitle: '¿Estás completamente seguro?',
      zDescription:
        'Esta acción es irreversible. Eliminará permanentemente el proyecto y todo lo que has subido a nuestros servidores.',
      zOkDestructive: true,
      zOkText: 'Si, borrar',
      zCancelText: 'No, cancelar',
      zOnOk: () => this.deleteProject(id),
    });
  }
  //#endregion
}
