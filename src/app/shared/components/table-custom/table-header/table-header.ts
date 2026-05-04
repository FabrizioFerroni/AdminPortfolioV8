import { mergeClasses } from '@/shared/utils';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'f-table-header thead[f-table-header]',
  imports: [],
  styleUrl: './table-header.css',
  templateUrl: './table-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableHeader {
  cId = input<string>();
  cClass = input<string>();
  cStyle = input<string | undefined>(undefined);

  GetClasses() {
    const baseClasses = '[&_tr]:border-b';
    return mergeClasses(baseClasses, this.cClass());
  }
}
