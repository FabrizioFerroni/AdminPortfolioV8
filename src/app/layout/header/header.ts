import { ZardDarkModeComponent } from '@/shared/components/dark-mode';
import { ZardDividerComponent } from '@/shared/components/divider';
import { LayoutImports } from '@/shared/components/layout';
import { Rutas } from '@/shared/utils';
import { Component, inject, model } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePanelLeftClose, lucidePanelLeftOpen } from '@ng-icons/lucide';
import { filter, map } from 'rxjs';

interface TitleItem {
  label: string;
  href: string;
}

@Component({
  selector: 'app-header',
  imports: [LayoutImports, NgIcon, ZardDarkModeComponent, ZardDividerComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
  viewProviders: [
    provideIcons({
      lucidePanelLeftClose,
      lucidePanelLeftOpen,
    }),
  ],
})
export class Header {
  readonly sidebarCollapsed = model(false);
  readonly router = inject(Router);

  mainTitleItems: TitleItem[] = [
    {
      label: 'Tablero',
      href: `/${Rutas.DASHBOARD}`,
    },
    {
      label: 'Proyectos',
      href: `/${Rutas.PROJECTS}`,
    },
    {
      label: 'Agregar Proyecto',
      href: `/${Rutas.PROJECTS}/${Rutas.NEW_ROUTES_O}`,
    },
    {
      label: 'Editar Proyecto',
      href: `/${Rutas.PROJECTS}/${Rutas.UPDATE_ROUTES}/:id`,
    },
    {
      label: 'Experiencias Laborales',
      href: `/${Rutas.EXPERIENCES}`,
    },
    {
      label: 'Agregar experiencia',
      href: `/${Rutas.EXPERIENCES}/${Rutas.NEW_ROUTES}`,
    },
    {
      label: 'Editar experiencia',
      href: `/${Rutas.EXPERIENCES}/${Rutas.UPDATE_ROUTES}/:id`,
    },
    {
      label: 'Subscriptores',
      href: `/${Rutas.SUBSCRIBERS}`,
    },
    {
      label: 'Contactos',
      href: `/${Rutas.CONTACTS}`,
    },
    {
      label: 'Auditorias',
      href: `/${Rutas.AUDITS}`,
    },
    {
      label: 'Perfil',
      href: `/${Rutas.PROFILE}`,
    },
    {
      label: 'Configuraciones',
      href: `/${Rutas.SETTINGS}`,
    },
  ];

  titlePage = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        const currentUrl = this.router.url;
        return (
          this.mainTitleItems.find(item => this.matchRoute(item.href, currentUrl))?.label ??
          'Tablero'
        );
      })
    ),
    {
      initialValue:
        this.mainTitleItems.find(item => this.matchRoute(item.href, this.router.url))?.label ??
        'Tablero',
    }
  );

  private matchRoute(itemHref: string, currentUrl: string): boolean {
    if (itemHref === currentUrl) return true;

    const pattern = itemHref.replace(/:([^/]+)/g, '[^/]+');
    return new RegExp(`^${pattern}$`).test(currentUrl);
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  onCollapsedChange(collapsed: boolean) {
    this.sidebarCollapsed.set(collapsed);
  }
}
