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
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  Injector,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideArrowRight,
  lucideBriefcase,
  lucideEye,
  lucideFolderKanban,
  lucideFolderOpen,
  lucideHome,
  lucideHouse,
  lucideMail,
  lucideMessageSquare,
  lucideTrendingDown,
  lucideTrendingUp,
  lucideUsers,
} from '@ng-icons/lucide';
import { Store } from '@ngrx/store';
import {
  analitycsDashboard,
  auditsDashboard,
  DashboardActions,
  isLoadingAnalitics,
  isLoadingAuditsDashboard,
  isLoadingStatsDashboard,
  isLoadingStatsMonthlyDashboard,
  statsMonthlyDashboard,
  statsPrincipalDashboard,
} from '../store';
import { filter } from 'rxjs';
import { AuditLogsList } from '../../audit-logs/interfaces';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { AnalyticsRange } from '../enum/analitycrange.enum';
import { DecimalPipe } from '@angular/common';

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
    ZardEmptyComponent,
    RouterLink,
    DecimalPipe,
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
      lucideMail,
      lucideFolderOpen,
      lucideHome,
      lucideActivity,
      lucideTrendingUp,
      lucideTrendingDown,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  //#region Variables
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
    { value: AnalyticsRange.WEEK, label: 'Semana' },
    { value: AnalyticsRange.MONTH, label: 'Mes' },
    { value: AnalyticsRange.YEAR, label: 'Año' },
  ];

  skeletonBars = [35, 60, 45, 80, 55, 70, 100];

  range = signal<AnalyticsRange>(AnalyticsRange.WEEK);

  isLoadingStatsDashboard = toSignal(this.store.select(isLoadingStatsDashboard), {
    initialValue: true,
  });
  statsDashboard$ = this.store.select(statsPrincipalDashboard);

  isLoadingStatsMontlyDashboard = toSignal(this.store.select(isLoadingStatsMonthlyDashboard), {
    initialValue: true,
  });
  statsMonthlyDashboard$ = this.store.select(statsMonthlyDashboard);

  isLoadingAnalitycs = toSignal(this.store.select(isLoadingAnalitics), {
    initialValue: true,
  });

  // analitycsData$ = this.store.select(analitycsDashboard);
  analyticsData = toSignal(this.store.select(analitycsDashboard));

  isLoadingAuditsDashboard = toSignal(this.store.select(isLoadingAuditsDashboard), {
    initialValue: true,
  });
  audits$ = this.store.select(auditsDashboard);
  lastFiveAudits = signal<AuditLogsList[]>([]);

  newProjects = signal<number>(0);
  newSubscribers = signal<number>(0);
  newMessages = signal<number>(0);
  newViews = signal<number>(0);
  growthRate = signal<number>(0);

  private readonly iconMap: Record<string, string> = {
    contact: 'lucideMail',
    experience: 'lucideBriefcase',
    project: 'lucideFolderOpen',
    subscriber: 'lucideUsers',
  };

  private readonly colorMap: Record<string, string> = {
    experience: 'bg-purple-500/10 text-purple-500',
    project: 'bg-blue-500/10 text-blue-500',
    subscriber: 'bg-emerald-500/10 text-emerald-500',
    contact: 'bg-amber-500/10 text-amber-500',
  };

  //#endregion

  onSelectionChange(value: string) {
    if (Object.values(AnalyticsRange).includes(value as AnalyticsRange)) {
      this.range.set(value as AnalyticsRange);
    }
  }

  //#region Inicializacion

  constructor() {
    effect(() => {
      this.store.dispatch(
        DashboardActions.getAnalitycs({
          range: this.range(),
        })
      );
    });
  }

  ngOnInit(): void {
    this.store.dispatch(DashboardActions.getStats());
    this.store.dispatch(DashboardActions.getStatsMonthly());
    this.store.dispatch(DashboardActions.getLastFiveAudits());
    this.initStatsSync();
    this.initStatsMonthlySync();
    this.initLastFiveAudits();
  }
  //#endregion

  //#region getters
  get skeletonStatsItems() {
    return Array(4);
  }

  get skeletonStatsMonthlyItems() {
    return Array(3);
  }

  get skeletonAuditsItems() {
    return Array(5);
  }
  //#endregion

  //#region Funciones
  private initStatsSync(): void {
    this.statsDashboard$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(value => value !== null)
      )
      .subscribe(value => {
        this.totalProjects.set(value.totalProjects);
        this.totalSubscribers.set(value.totalSubscribers);
        this.totalUnreadMessages.set(value.totalMessages);
        this.totalViewsPortfolio.set(value.totalViews);
      });
  }

  private initStatsMonthlySync(): void {
    this.statsMonthlyDashboard$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(value => value !== null)
      )
      .subscribe(value => {
        this.newProjects.set(value.newProjects);
        this.newSubscribers.set(value.newSubscribers);
        this.newMessages.set(value.newMessages);
        this.newViews.set(value.newViews);
        this.growthRate.set(value.growthRate);
      });
  }

  private initLastFiveAudits(): void {
    this.audits$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(value => value !== null)
      )
      .subscribe(value => {
        this.lastFiveAudits.set(value);
      });
  }

  getRelativeTime(dateStr: string): string {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes] = timePart.split(':');

    const date = new Date(+year, +month - 1, +day, +hours, +minutes);

    const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);

    const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
      { unit: 'year', seconds: 31536000 },
      { unit: 'month', seconds: 2592000 },
      { unit: 'week', seconds: 604800 },
      { unit: 'day', seconds: 86400 },
      { unit: 'hour', seconds: 3600 },
      { unit: 'minute', seconds: 60 },
      { unit: 'second', seconds: 1 },
    ];

    const formatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

    for (const { unit, seconds } of units) {
      if (diffSeconds >= seconds) {
        return formatter.format(-Math.floor(diffSeconds / seconds), unit);
      }
    }

    return 'ahora mismo';
  }

  getIconForModule(module: string): string {
    return this.iconMap[module.toLowerCase()] ?? 'lucideHome';
  }

  getColorForModule(module: string): string {
    return this.colorMap[module?.toLowerCase()] ?? 'bg-slate-500/10 text-slate-500';
  }

  get aggregatedData() {
    const data = this.analyticsData()?.data;
    if (!data?.length) return [];

    const range = this.range();

    if (range === AnalyticsRange.YEAR) {
      // Agrupar por mes
      const byMonth = new Map<string, number>();
      for (const item of data) {
        const key = item.date.substring(0, 7); // "2026-01"
        byMonth.set(key, (byMonth.get(key) ?? 0) + item.views);
      }
      return Array.from(byMonth.entries()).map(([date, views]) => ({ date, views }));
    }

    if (range === AnalyticsRange.MONTH) {
      // Agrupar por semana
      const byWeek = new Map<string, number>();
      for (const item of data) {
        const d = new Date(item.date);
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        const key = weekStart.toISOString().substring(0, 10);
        byWeek.set(key, (byWeek.get(key) ?? 0) + item.views);
      }
      return Array.from(byWeek.entries()).map(([date, views]) => ({ date, views }));
    }

    // WEEK: sin agrupación
    return data;
  }

  getBarHeight(views: number): number {
    const data = this.aggregatedData;
    if (!data?.length) return 5;
    const maxViews = Math.max(...data.map(d => d.views));
    return Math.max((views / maxViews) * 100, 5);
  }

  getDateLabel(dateStr: string): string {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-AR', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    }).format(date);
  }

  getMidItem() {
    const data = this.aggregatedData;
    if (!data?.length) return null;
    return data[Math.floor(data.length / 2)];
  }
  //#endregion
}
