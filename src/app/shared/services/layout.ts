// layout.service.ts
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private breakpointObserver = inject(BreakpointObserver);

  isMobile = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(map(r => r.matches)),
    { initialValue: false }
  );

  private _collapsed = signal(this.isMobile());

  readonly sidebarCollapsed = computed(() => this._collapsed());

  constructor() {
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
