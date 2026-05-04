import { mergeClasses } from '@/shared/utils';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'f-card-title',
  imports: [],
  styleUrl: './card-title.css',
  templateUrl: './card-title.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CardTitle {
  cId = input<string | undefined>(undefined);
  cClass = input<string>();
  cStyle = input<string | undefined>(undefined);

  GetClasses() {
    const baseClasses = 'text-2xl font-semibold leading-none tracking-tight';
    return mergeClasses(baseClasses, this.cClass());
  }
}
