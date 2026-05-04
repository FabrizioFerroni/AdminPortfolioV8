import { mergeClasses } from '@/shared/utils';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'f-table-head th[f-table-head]',
  imports: [],
  styleUrl: './table-head.css',
  templateUrl: './table-head.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableHead {
  cId = input<string>();
  cClass = input<string>();
  cStyle = input<string | undefined>(undefined);

  GetClasses() {
    const baseClasses =
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0';
    return mergeClasses(baseClasses, this.cClass());
  }
}
