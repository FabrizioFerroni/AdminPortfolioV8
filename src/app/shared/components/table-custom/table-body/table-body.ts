import { mergeClasses } from '@/shared/utils';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'f-table-body tbody[f-table-body]',
  imports: [],
  styleUrl: './table-body.css',
  templateUrl: './table-body.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableBody {
  cId = input<string>();
  cClass = input<string>();
  cStyle = input<string | undefined>(undefined);

  GetClasses() {
    const baseClasses = '[&_tr:last-child]:border-0';
    return mergeClasses(baseClasses, this.cClass());
  }
}
