import { mergeClasses } from '@/shared/utils';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'f-card',
  imports: [],
  styleUrl: './card.css',
  templateUrl: './card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Card {
  cId = input<string>();
  cClass = input<string>();
  cStyle = input<string | undefined>(undefined);

  GetClasses() {
    const baseClasses = 'rounded-lg border bg-card text-card-foreground shadow-sm';
    return mergeClasses(baseClasses, this.cClass());
  }
}
