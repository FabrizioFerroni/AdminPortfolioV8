import { mergeClasses } from '@/shared/utils';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'f-table-footer',
  imports: [],
  styleUrl: './table-footer.css',
  templateUrl: './table-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableFooter {
  cId = input<string>();
  cClass = input<string>();
  cStyle = input<string | undefined>(undefined);

  GetClasses() {
    const baseClasses = 'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0';
    return mergeClasses(baseClasses, this.cClass());
  }
}
