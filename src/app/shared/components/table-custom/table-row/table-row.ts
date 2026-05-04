import { mergeClasses } from '@/shared/utils';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'f-table-row tr[f-table-row]',
  imports: [],
  styleUrl: './table-row.css',
  templateUrl: './table-row.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableRow {
  cId = input<string>();
  cClass = input<string>();
  cStyle = input<string | undefined>(undefined);

  GetClasses() {
    const baseClasses =
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted';
    return mergeClasses(baseClasses, this.cClass());
  }
}
