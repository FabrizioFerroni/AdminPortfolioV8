import { AuthActions, selectAuthUser, selectUserFullName } from '@/features/auth/store';
import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardBreadcrumbImports } from '@/shared/components/breadcrumb/breadcrumb.imports';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDividerComponent } from '@/shared/components/divider';
import { LayoutImports } from '@/shared/components/layout';
import { ZardMenuImports } from '@/shared/components/menu';
import { ZardTooltipImports } from '@/shared/components/tooltip';
import { LayoutService } from '@/shared/services/layout';
import { mergeClasses, Rutas } from '@/shared/utils';
import { Component, computed, inject, model } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IconName, NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBriefcase,
  lucideChevronsUpDown,
  lucideClipboardList,
  lucideFolderKanban,
  lucideLayoutDashboard,
  lucideLogOut,
  lucideMessageSquare,
  lucideSettings,
  lucideUser,
  lucideUsers,
} from '@ng-icons/lucide';
import { Store } from '@ngrx/store';

interface MenuItem {
  icon: IconName;
  label: string;
  href: string;
  submenu?: { label: string }[];
}

@Component({
  selector: 'app-sidebar',
  imports: [
    LayoutImports,
    ZardButtonComponent,
    NgIcon,
    ZardMenuImports,
    ZardTooltipImports,
    ZardDividerComponent,
    ZardAvatarComponent,
    ZardBreadcrumbImports,
    RouterLink,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  host: {
    style: 'display: contents',
  },
  viewProviders: [
    provideIcons({
      lucideChevronsUpDown,
      lucideUser,
      lucideSettings,
      lucideLogOut,
      lucideLayoutDashboard,
      lucideFolderKanban,
      lucideUsers,
      lucideBriefcase,
      lucideMessageSquare,
      lucideClipboardList,
    }),
  ],
})
export class Sidebar {
  readonly sidebarCollapsed = model(false);
  private readonly store = inject(Store);
  readonly router = inject(Router);
  layout = inject(LayoutService);
  isMovile = this.layout.isMobile;

  user = this.store.selectSignal(selectAuthUser);
  fullName = this.store.selectSignal(selectUserFullName);

  avatarSrc = computed(() => this.user()?.avatar ?? '');

  mainMenuItems: MenuItem[] = [
    {
      label: 'Tablero',
      href: `/${Rutas.DASHBOARD}`,
      icon: 'lucideLayoutDashboard',
    },
    {
      label: 'Proyectos',
      href: `/${Rutas.PROJECTS}`,
      icon: 'lucideFolderKanban',
    },
    {
      label: 'Experiencias Laborales',
      href: `/${Rutas.EXPERIENCES}`,
      icon: 'lucideBriefcase',
    },
    {
      label: 'Subscriptores',
      href: `/${Rutas.SUBSCRIBERS}`,
      icon: 'lucideUsers',
    },
    {
      label: 'Contactos',
      href: `/${Rutas.CONTACTS}`,
      icon: 'lucideMessageSquare',
    },
    {
      label: 'Auditorias',
      href: `/${Rutas.AUDITS}`,
      icon: 'lucideClipboardList',
    },
  ];

  toggleSidebar() {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  onCollapsedChange(collapsed: boolean) {
    this.sidebarCollapsed.set(collapsed);
  }

  setClassLink(href: string): string {
    const baseClass =
      'transition-colors py-3 h-auto rounded-lg  hover:text-foreground aria-expanded:bg-transparent aria-expanded:text-foreground'; // hover:bg-yellow-600 dark:hover:bg-yellow-600';

    const activeClass =
      this.router.url === href
        ? 'bg-sidebar-accent active:sidebar-accent focus:bg-sidebar-accent hover:bg-sidebar-accent dark:bg-sidebar-accent dark:active:bg-sidebar-accent dark:focus:bg-sidebar-accent dark:hover:bg-sidebar-accent'
        : '';
    const collapsedClass =
      this.sidebarCollapsed() && this.isMovile() ? 'justify-center' : 'justify-start';
    return mergeClasses(baseClass, activeClass, collapsedClass);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
