import { selectAuthUser } from '@/features/auth/store';
import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { ZardButtonComponent } from '@/shared/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/card-custom';
import { ZardSegmentedComponent } from '@/shared/components/segmented';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { Rutas } from '@/shared/utils';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideBriefcase,
  lucideEye,
  lucideFolderKanban,
  lucideHouse,
  lucideMessageSquare,
  lucideUsers,
} from '@ng-icons/lucide';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-dashboard',
  imports: [
    NgIcon,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    ZardButtonComponent,
    ZardSegmentedComponent,
    ZardSkeletonComponent,
    ZardBreadcrumbImports,
    RouterLink,
  ],
  templateUrl: './page.html',
  styleUrl: './page.css',
  viewProviders: [
    provideIcons({
      lucideFolderKanban,
      lucideUsers,
      lucideMessageSquare,
      lucideEye,
      lucideHouse,
      lucideArrowRight,
      lucideBriefcase,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly store = inject(Store);

  user = this.store.selectSignal(selectAuthUser);
  totalProjects = signal<number>(0);
  projectRoute = `/${Rutas.PROJECTS}`;
  newProjectRoute = `/${Rutas.PROJECTS}/${Rutas.NEW_ROUTES_O}`;
  newExperienceRoute = `/${Rutas.EXPERIENCES}/${Rutas.NEW_ROUTES}`;
  totalSubscribers = signal<number>(0);
  subscriberRoute = `/${Rutas.SUBSCRIBERS}`;
  totalUnreadMessages = signal<number>(0);
  contactRoute = `/${Rutas.CONTACTS}`;
  totalViewsPortfolio = signal<number>(0);
  auditsRoute = `/${Rutas.AUDITS}`;

  options = [
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
    { value: 'year', label: 'Año' },
  ];

  onSelectionChange(value: string) {
    console.log('Selected:', value);
  }

  //#region getters
  get skeletonStatsItems() {
    return Array(4);
  }
  //#endregion
}
