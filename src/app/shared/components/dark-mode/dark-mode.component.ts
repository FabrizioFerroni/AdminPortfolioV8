import { EDarkModes, ZardDarkMode } from '@/shared/services';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
  ViewEncapsulation,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMonitor, lucideMoon, lucideSun } from '@ng-icons/lucide';
import { ZardButtonComponent } from '../button';
import { ClassValue } from 'clsx';
import { mergeClasses } from '@/shared/utils';
import {
  ZardTooltipImports,
  ZardTooltipPositionVariants,
  ZardTooltipTriggers,
  ZardTooltipType,
} from '../tooltip';

@Component({
  selector: 'z-dark-mode',
  imports: [ZardButtonComponent, NgIcon, ZardTooltipImports],
  viewProviders: [provideIcons({ lucideMoon, lucideSun, lucideMonitor })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      z-button
      zType="ghost"
      zSize="sm"
      (click)="toggleTheme()"
      [class]="classes()"
      [zTooltip]="tDescription()"
      [zPosition]="tPosition()"
      [zTrigger]="pTrigger()"
      [zShowDelay]="pShowDelay()"
      [zHideDelay]="pHideDelay()">
      <ng-icon [name]="themeIcon()" class="size-4.5" />
      <span class="sr-only">Toggle theme</span>
    </button>
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardDarkModeComponent {
  readonly class = input<ClassValue>('');
  readonly tDescription = input<ZardTooltipType>(null);
  readonly tPosition = input<ZardTooltipPositionVariants>('top');
  readonly pTrigger = input<ZardTooltipTriggers>('hover');
  readonly pShowDelay = input(150, { transform: numberAttribute });
  readonly pHideDelay = input(100, { transform: numberAttribute });

  private readonly darkModeService = inject(ZardDarkMode);
  protected readonly classes = computed(() => mergeClasses('', this.class()));

  protected readonly themeIcon = computed(() => {
    const icons: Record<EDarkModes, string> = {
      [EDarkModes.LIGHT]: 'lucideSun',
      [EDarkModes.DARK]: 'lucideMoon',
      [EDarkModes.SYSTEM]: 'lucideMonitor',
    };
    return icons[this.darkModeService.currentTheme()];
  });

  protected toggleTheme(): void {
    const next: Record<EDarkModes, EDarkModes> = {
      [EDarkModes.SYSTEM]: EDarkModes.LIGHT,
      [EDarkModes.LIGHT]: EDarkModes.DARK,
      [EDarkModes.DARK]: EDarkModes.SYSTEM,
    };
    this.darkModeService.toggleTheme(next[this.darkModeService.currentTheme()]);
  }
}
