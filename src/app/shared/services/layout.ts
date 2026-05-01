// layout.service.ts
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  /*private breakpointObserver = inject(BreakpointObserver);

  private isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(map(r => r.matches)),
    { initialValue: false }
  );

  // Estado manual del usuario (toggle)
  private _collapsed = signal(false);

  // Si es mobile, siempre collapsed. Si no, respeta el toggle manual
  readonly sidebarCollapsed = computed(() => this.isMobile() || this._collapsed());

  toggle() {
    this._collapsed.update(v => !v);
  }

  setCollapsed(value: boolean) {
    this._collapsed.set(value);
  }*/

  private breakpointObserver = inject(BreakpointObserver);

  isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(map(r => r.matches)),
    { initialValue: false }
  );

  // Se inicializa según el dispositivo actual
  private _collapsed = signal(this.isMobile());

  readonly sidebarCollapsed = computed(() => this._collapsed());

  constructor() {
    // Cuando cambia el tamaño de pantalla, resetea el estado
    effect(() => {
      this._collapsed.set(this.isMobile());
    });
  }

  toggle() {
    this._collapsed.update(v => !v);
  }

  setCollapsed(value: boolean) {
    this._collapsed.set(value);
  }
}
