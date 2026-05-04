import { LayoutImports } from '@/shared/components/layout';
import { ZardMenuImports } from '@/shared/components/menu';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar';
import { Header } from '../header';
import { LayoutService } from '@/shared/services/layout';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Header, LayoutImports, ZardMenuImports],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

  host: { class: 'flex flex-col' }, //h-[100vh]
})
export class MainLayout {
  layout = inject(LayoutService);
  isMovile = this.layout.isMobile;
  year = new Date().getFullYear();

  readonly sidebarCollapsed = this.layout.sidebarCollapsed;

  toggleSidebar() {
    this.layout.toggle();
  }

  onCollapsedChange(collapsed: boolean) {
    this.layout.setCollapsed(collapsed);
  }
}
