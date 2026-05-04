import { mergeClasses } from '@/shared/utils';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'f-table table[f-table]',
  imports: [],
  styleUrl: './table.css',
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Table {
  cId = input<string>();
  cClass = input<string>();
  cStyle = input<string | undefined>(undefined);

  GetClasses() {
    const baseClasses = 'w-full caption-bottom text-sm';
    return mergeClasses(baseClasses, this.cClass());
  }
}
