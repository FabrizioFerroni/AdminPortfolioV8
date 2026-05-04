import { mergeClasses } from '@/shared/utils';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'f-table-cell td[f-table-cell]',
  imports: [],
  styleUrl: './table-cell.css',
  templateUrl: './table-cell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableCell {
  cId = input<string>();
  cClass = input<string>();
  cStyle = input<string | undefined>(undefined);
  colSpan = input<number>();

  GetClasses() {
    //p-4 align-middle [&:has([role=checkbox])]:pr-0
    const baseClasses =
      'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] ';
    return mergeClasses(baseClasses, this.cClass());
  }
}
