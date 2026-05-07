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
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ContactService } from '../service/contact-service';
import { Store } from '@ngrx/store';
import { ZardButtonComponent } from '@/shared/components/button';
import {
  lucideDownload,
  lucideEye,
  lucideMail,
  lucideMailCheck,
  lucideMailOpen,
  lucideMailWarning,
  lucideMessageSquare,
  lucideSearch,
  lucideTrash2,
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
import { ZardTableImports } from '@/shared/components/table';
import {
  ContactsActions,
  selectContactMeta,
  selectContacts,
  selectContactsError,
  selectContactsLoading,
  selectContactstats,
  selectContactstatsLoading,
} from '../store';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Pagination } from '@/shared/interfaces';
import { combineLatest, debounceTime, distinctUntilChanged, filter, skip } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { ZardTooltipImports } from '@/shared/components/tooltip';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ContactList, UpdateStatusContact } from '../interfaces';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardPaginationImports } from '@/shared/components/pagination';
import { ZardSelectImports } from '@/shared/components/select';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog';
import { ZardSheetService } from '@/shared/components/sheet';
import { ViewMailComponent } from '../forms/view-mail';

@Component({
  selector: 'app-contacts',
  imports: [
    NgIcon,
    Card,
    CardContent,
    CardHeader,
    CardDescription,
    CardTitle,
    ZardButtonComponent,
    ZardInputDirective,
    ZardSkeletonComponent,
    ZardTableImports,
    ZardTooltipImports,
    ZardBadgeComponent,
    ZardEmptyComponent,
    ZardPaginationImports,
    ZardSelectImports,
    AsyncPipe,
  ],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
  viewProviders: [
    provideIcons({
      lucideDownload,
      lucideMessageSquare,
      lucideMailWarning,
      lucideMailOpen,
      lucideMailCheck,
      lucideSearch,
      lucideEye,
      lucideMail,
      lucideTrash2,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contacts implements OnInit {
  private readonly alertDialogService = inject(ZardAlertDialogService);
  private sheetService = inject(ZardSheetService);
  private readonly layout = inject(LayoutService);
  private readonly utilsService = inject(UtilsService);
  private readonly contactsService = inject(ContactService);
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
  total = signal(4);
  totalUnread = signal(2);
  totalRead = signal(1);
  totalRepplied = signal(1);
  search = signal<string | null>(null);

  contacts$ = this.store.select(selectContacts);
  isLoading$ = this.store.select(selectContactsLoading);
  error$ = this.store.select(selectContactsError);
  pagination$ = this.store.select(selectContactMeta);
  isLoadingStats = toSignal(this.store.select(selectContactstatsLoading), {
    initialValue: true,
  });
  stats$ = this.store.select(selectContactstats);

  ngOnInit() {
    this.initSearch();
    this.initPagination();
    this.store.dispatch(ContactsActions.getStats());
    this.initStatsSync();

    effect(
      () => {
        const limit = this.limit();
        this.store.dispatch(
          ContactsActions.getAll({
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
        this.totalRead.set(value.read);
        this.totalUnread.set(value.unread);
        this.totalRepplied.set(value.repplied);
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
          ContactsActions.getAll({
            paginado: {
              page: 1,
              limit: this.limit(),
              search: searchValue || null,
            },
          })
        );
      });
  }

  getStatusVariant(status: ContactList['status']): 'default' | 'secondary' | 'outline' {
    switch (status) {
      case 'read':
        return 'outline';
      case 'repplied':
        return 'secondary';
      default:
        return 'default';
    }
  }

  getStatusName(status: ContactList['status']): string {
    switch (status) {
      case 'read':
        return 'Leido';
      case 'repplied':
        return 'Respondido';
      default:
        return 'Sin Leer';
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
      ContactsActions.getAll({
        paginado: { page, limit: this.limit() },
      })
    );
  }

  goToPrevious() {
    if (this.hasPreviousPage()) {
      const page = this.currentPage() - 1;
      this.currentPage.set(page);
      this.store.dispatch(
        ContactsActions.getAll({
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
        ContactsActions.getAll({
          paginado: { page, limit: this.limit() },
        })
      );
    }
  }

  readMessage(contact: ContactList) {
    if (contact.status == 'unread') {
      this.markAsReadContact(contact.id);
    }

    this.sheetService.create({
      zTitle: contact.subject,
      zDescription: `De: ${contact.name} (${contact.email})`,
      zContent: ViewMailComponent,
      zData: { contact },
      zOkText: 'Marcar como respondido',
      zOkIcon: lucideMailCheck,
      zOkDisabled: contact.status === 'repplied',
      zCancelText: 'Cancelar',
      zOnOk: () => this.onRepplied(contact.id, contact.status),
    });
  }

  private markAsReadContact(id: string) {
    const statusUpdated: UpdateStatusContact = {
      status: 'read',
    };

    this.store.dispatch(ContactsActions.updateStatus({ id, data: statusUpdated }));
  }

  private markReppliedContacto(id: string) {
    const statusUpdated: UpdateStatusContact = {
      status: 'repplied',
    };

    this.store.dispatch(ContactsActions.updateStatus({ id, data: statusUpdated }));
  }

  private deleteContacto(id: string) {
    console.log(`Id eliminado: ${id}`);
    this.store.dispatch(ContactsActions.delete({ id }));
  }

  onRepplied(id: string, status: string) {
    if (status == 'repplied') {
      return;
    }

    this.alertDialogService.confirm({
      zTitle: '¿Estás completamente seguro?',
      zDescription: 'Quieres marcar como respondido este contacto?',
      zOkDestructive: false,
      zOkText: 'Si, marcar como respondido',
      zCancelText: 'No, cancelar',
      zOnOk: () => this.markReppliedContacto(id),
    });
  }

  onDelete(id: string, status: string) {
    if (status == 'repplied') {
      return;
    }

    this.alertDialogService.confirm({
      zTitle: '¿Estás completamente seguro?',
      zDescription:
        'Esta acción es irreversible. Eliminará permanentemente el contacto y borrará los datos de nuestros servidores.',
      zOkDestructive: true,
      zOkText: 'Si, borrar',
      zCancelText: 'No, cancelar',
      zOnOk: () => this.deleteContacto(id),
    });
  }
}
