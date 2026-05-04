import { mergeClasses } from '@/shared/utils';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'f-card-description',
  imports: [],
  styleUrl: './card-description.css',
  templateUrl: './card-description.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CardDescription {
  cId = input<string | undefined>(undefined);
  cClass = input<string>();
  cStyle = input<string | undefined>(undefined);

  GetClasses() {
    const baseClasses = 'text-sm text-muted-foreground';
    return mergeClasses(baseClasses, this.cClass());
  }
}
