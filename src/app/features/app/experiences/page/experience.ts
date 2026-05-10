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
import {
  ExperiencesActions,
  selectExperienceMeta,
  selectExperiences,
  selectExperiencesError,
  selectExperiencesLoading,
  selectExperiencestats,
  selectExperiencestatsLoading,
} from '../store';
import { Store } from '@ngrx/store';
import { UtilsService } from '@/shared/services/utils-service';
import { LayoutService } from '@/shared/services/layout';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Pagination } from '@/shared/interfaces';
import { combineLatest, debounceTime, distinctUntilChanged, filter, skip } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ZardButtonComponent } from '@/shared/components/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDown,
  lucideArrowUp,
  lucideArrowUpDown,
  lucideBadge,
  lucideBriefcase,
  lucideHouse,
  lucidePencil,
  lucidePlus,
  lucideSearch,
  lucideTrash2,
  lucideX,
} from '@ng-icons/lucide';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/card-custom';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardTableImports } from '@/shared/components/table';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardTooltipImports } from '@/shared/components/tooltip';
import { ZardPaginationImports } from '@/shared/components/pagination';
import { ZardSelectImports } from '@/shared/components/select';
import { RouterLink } from '@angular/router';
import { Rutas } from '@/shared/utils';
import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';

@Component({
  selector: 'app-experience',
  imports: [
    NgIcon,
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardContent,
    ZardSkeletonComponent,
    ZardButtonComponent,
    ZardInputDirective,
    ZardEmptyComponent,
    ZardTableImports,
    ZardBadgeComponent,
    ZardTooltipImports,
    ZardPaginationImports,
    ZardSelectImports,
    ZardBreadcrumbImports,
    RouterLink,
    AsyncPipe,
    DatePipe,
  ],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
  viewProviders: [
    provideIcons({
      lucidePlus,
      lucideBriefcase,
      lucideBadge,
      lucideArrowUpDown,
      lucideSearch,
      lucidePencil,
      lucideArrowUp,
      lucideArrowDown,
      lucideTrash2,
      lucideX,
      lucideHouse,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience implements OnInit {
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
  newRoute = `/${Rutas.EXPERIENCES}/${Rutas.NEW_ROUTES}`;
  updateRoute = `/${Rutas.EXPERIENCES}/${Rutas.UPDATE_ROUTES}`;

  isMovile = this.layout.isMobile;
  total = signal(0);
  currentPosition = signal(0);
  skills = signal(0);
  search = signal<string | null>(null);
  //#endregion

  //#region imports reducers
  readonly experiences$ = this.store.select(selectExperiences);
  readonly isLoading$ = this.store.select(selectExperiencesLoading);
  readonly error$ = this.store.select(selectExperiencesError);
  readonly pagination$ = this.store.select(selectExperienceMeta);
  readonly isLoadingStats = toSignal(this.store.select(selectExperiencestatsLoading), {
    initialValue: true,
  });
  readonly stats$ = this.store.select(selectExperiencestats);
  //#endregion

  //#region ciclo de vida de angular
  ngOnInit() {
    this.initSearch();
    this.initPagination();
    this.store.dispatch(ExperiencesActions.getStats());
    this.initStatsSync();

    effect(
      () => {
        const limit = this.limit();
        this.store.dispatch(
          ExperiencesActions.getAll({
            paginado: { page: 1, limit, search: untracked(() => this.search()) },
          })
        );
      },
      { injector: this.injector }
    );
  }
  //#endregion

  //#region getters
  get skeletonStatsItems() {
    return Array(3);
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
        this.currentPosition.set(value.currentPosition);
        this.skills.set(value.skills);
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
          ExperiencesActions.getAll({
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
      ExperiencesActions.getAll({
        paginado: { page, limit: this.limit() },
      })
    );
  }

  goToPrevious() {
    if (this.hasPreviousPage()) {
      const page = this.currentPage() - 1;
      this.currentPage.set(page);
      this.store.dispatch(
        ExperiencesActions.getAll({
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
        ExperiencesActions.getAll({
          paginado: { page, limit: this.limit() },
        })
      );
    }
  }
  //#endregion

  //#region actions
  moveUpDisplay(id: string) {
    this.store.dispatch(ExperiencesActions.moveUpExperience({ id }));
  }

  moveDownDisplay(id: string) {
    this.store.dispatch(ExperiencesActions.moveDownExperience({ id }));
  }

  private deleteExperience(id: string) {
    this.store.dispatch(ExperiencesActions.deleteExperience({ id }));
  }

  onDelete(id: string) {
    this.alertDialogService.confirm({
      zTitle: '¿Estás completamente seguro?',
      zDescription:
        'Esta acción es irreversible. Eliminará permanentemente la experiencia y borrará los datos de nuestros servidores.',
      zOkDestructive: true,
      zOkText: 'Si, borrar',
      zCancelText: 'No, cancelar',
      zOnOk: () => this.deleteExperience(id),
    });
  }
  //#endregion
}
