import { mergeClasses } from '@/shared/utils';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'f-card-header',
  imports: [],
  styleUrl: './card-header.css',
  templateUrl: './card-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CardHeader {
  cId = input<string | undefined>(undefined);
  cClass = input<string>();
  cStyle = input<string | undefined>(undefined);

  GetClasses() {
    const baseClasses = 'flex flex-col space-y-1.5 p-6';
    return mergeClasses(baseClasses, this.cClass());
  }
}
