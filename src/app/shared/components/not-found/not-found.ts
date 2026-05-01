import { Component } from '@angular/core';
import { ZardButtonComponent } from '../button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideHome } from '@ng-icons/lucide';
import { Rutas } from '@/shared/utils';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, ZardButtonComponent, NgIcon],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
  viewProviders: [
    provideIcons({
      lucideHome,
      lucideArrowLeft,
    }),
  ],
})
export class NotFoundComponent {
  dashboardUrl = `/${Rutas.DASHBOARD}`;
  volverAtras() {
    window.history.back();
  }
}
