import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ZardToastComponent } from './shared/components/toast';
import { ZardDarkMode } from './shared/services';
import { Store } from '@ngrx/store';
import { AuthActions } from './features/auth/store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ZardToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly darkModeService = inject(ZardDarkMode);
  readonly themeActual = this.darkModeService.currentTheme();
  protected readonly title = signal('Admin Portfolio');
  private readonly store = inject(Store);

  constructor() {
    this.store.dispatch(AuthActions.init());
  }
}
