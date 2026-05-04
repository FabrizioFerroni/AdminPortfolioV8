import { mergeClasses } from '@/shared/utils';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'f-table-caption',
  imports: [],
  styleUrl: './table-caption.css',
  templateUrl: './table-caption.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableCaption {
  cId = input<string>();
  cClass = input<string>();
  cStyle = input<string | undefined>(undefined);

  GetClasses() {
    const baseClasses = 'mt-4 text-sm text-muted-foreground';
    return mergeClasses(baseClasses, this.cClass());
  }
}
