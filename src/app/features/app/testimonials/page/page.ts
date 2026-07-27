import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/card-custom';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { LayoutService } from '@/shared/services/layout';
import {
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
  lucideEye,
  lucideHouse,
  lucidePencil,
  lucidePlus,
  lucideSearch,
  lucideTrash2,
  lucideUserCheck,
  lucideUserStar,
  lucideUserX,
} from '@ng-icons/lucide';
import { Store } from '@ngrx/store';
import {
  selectError,
  selectIsLoading,
  selectIsLoadingStats,
  selectMeta,
  selectStats,
  selectTestimonials,
  TestimonialsActions,
} from '../store';
import { TestimonialList, TestimonialMeta } from '../interface';
import { debounceTime, distinctUntilChanged, filter, skip } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardTableImports } from '@/shared/components/table';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardSelectImports } from '@/shared/components/select';
import { ZardPaginationImports } from '@/shared/components/pagination';
import { ZardTooltipImports } from '@/shared/components/tooltip';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Rutas } from '@/shared/utils';
import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { ZardDialogService } from '@/shared/components/dialog';
import { DetailTestimonialDialog } from '../detail';

@Component({
  imports: [
    CardContent,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    NgIcon,
    AsyncPipe,
    RouterLink,
    ZardSkeletonComponent,
    ZardButtonComponent,
    ZardInputDirective,
    ZardTableImports,
    ZardBadgeComponent,
    ZardEmptyComponent,
    ZardSelectImports,
    ZardPaginationImports,
    ZardTooltipImports,
    ZardBreadcrumbImports,
  ],
  styleUrl: './page.css',
  templateUrl: './page.html',
  viewProviders: [
    provideIcons({
      lucideUserStar,
      lucideUserCheck,
      lucideUserX,
      lucideSearch,
      lucidePlus,
      lucidePencil,
      lucideTrash2,
      lucideHouse,
      lucideEye,
    }),
  ],
})
export class Testimonials implements OnInit {
  //#region inyeccion
  private readonly alertDialogService = inject(ZardAlertDialogService);
  private readonly store = inject(Store);
  private readonly injector = inject(Injector);
  private destroyRef = inject(DestroyRef);
  readonly layout = inject(LayoutService);
  private readonly dialogService = inject(ZardDialogService);
  //#endregion

  //#region variables
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
  readonly homeRoute = `/${Rutas.DASHBOARD}`;
  readonly newRoute = `/${Rutas.TESTIMONIALS}/${Rutas.NEW_ROUTES_O}`;
  readonly updateRoute = `/${Rutas.TESTIMONIALS}/${Rutas.UPDATE_ROUTES}`;
  search = signal<string | null>(null);
  totalTestimonial = signal(0);
  activeTestimonial = signal(0);
  inactiveTestimonial = signal(0);

  testimonials$ = this.store.select(selectTestimonials);
  isLoading$ = this.store.select(selectIsLoading);
  isLoadingStats = toSignal(this.store.select(selectIsLoadingStats), {
    initialValue: true,
  });
  error$ = this.store.select(selectError);
  pagination$ = this.store.select(selectMeta);
  stats$ = this.store.select(selectStats);
  //#endregion

  //#region inicializacion ciclo de vida
  ngOnInit() {
    this.initSearch();
    this.initPagination();
    this.store.dispatch(TestimonialsActions.getTestimonialsStats());
    this.initStatsSync();

    effect(
      () => {
        const limit = this.limit();
        this.store.dispatch(
          TestimonialsActions.getAllTestimonials({
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

  //#region Funciones Principales
  private initPagination(): void {
    this.pagination$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((value: TestimonialMeta | null): value is TestimonialMeta => value !== null)
      )
      .subscribe({
        next: (value: TestimonialMeta) => {
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
        this.totalTestimonial.set(value!.total);
        this.activeTestimonial.set(value!.active);
        this.inactiveTestimonial.set(value!.inactive);
      });
  }

  private initSearch(): void {
    toObservable(this.search, { injector: this.injector })
      .pipe(skip(1), debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(searchValue => {
        this.store.dispatch(
          TestimonialsActions.getAllTestimonials({
            paginado: { page: 1, limit: this.limit(), search: searchValue || null },
          })
        );
      });
  }
  //#endregion

  //#region Funciones secundarias
  getStatusVariant(visible: TestimonialList['visible']): 'default' | 'secondary' {
    switch (visible) {
      case true:
        return 'default';
      default:
        return 'secondary';
    }
  }

  getStatusName(visible: TestimonialList['visible']): 'Activo' | 'Inactivo' {
    switch (visible) {
      case true:
        return 'Activo';
      default:
        return 'Inactivo';
    }
  }
  //#endregion

  //#region Paginacion
  handleItemsPerPageChange(value: string | string[]) {
    const parsed = parseInt(Array.isArray(value) ? value[0] : value);
    this.limit.set(parsed);
    this.selectedValue.set(String(parsed));
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.store.dispatch(
      TestimonialsActions.getAllTestimonials({
        paginado: { page, limit: this.limit() },
      })
    );
  }

  goToPrevious() {
    if (this.hasPreviousPage()) {
      const page = this.currentPage() - 1;
      this.currentPage.set(page);
      this.store.dispatch(
        TestimonialsActions.getAllTestimonials({
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
        TestimonialsActions.getAllTestimonials({
          paginado: { page, limit: this.limit() },
        })
      );
    }
  }
  //#endregion

  //#region VerDetalle
  onViewDetail(test: TestimonialList): void {
    this.dialogService.create({
      zTitle: 'Ver detalle del testimonio',
      zContent: DetailTestimonialDialog,
      zData: {
        testimonial: test,
      },
      zHideFooter: true,
      zWidth: '500px',
    });
  }
  //#endregion

  //#region DeleteTestimonial
  private deleteSub(id: string) {
    this.store.dispatch(TestimonialsActions.deleteTestimonial({ id }));
  }

  onDelete(id: string) {
    this.alertDialogService.confirm({
      zTitle: '¿Estás completamente seguro?',
      zDescription:
        'Esta acción es irreversible. Eliminará permanentemente el testimonio y borrará los datos de nuestros servidores.',
      zOkDestructive: true,
      zOkText: 'Si, borrar',
      zCancelText: 'No, cancelar',
      zOnOk: () => this.deleteSub(id),
    });
  }
  //#endregion
}
