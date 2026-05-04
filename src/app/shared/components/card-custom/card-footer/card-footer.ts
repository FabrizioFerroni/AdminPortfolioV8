import { mergeClasses } from '@/shared/utils';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'f-card-footer',
  imports: [],
  styleUrl: './card-footer.css',
  templateUrl: './card-footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CardFooter {
  cId = input<string | undefined>(undefined);
  cClass = input<string>();
  cStyle = input<string | undefined>(undefined);

  GetClasses() {
    const baseClasses = 'flex items-center p-6 pt-0';
    return mergeClasses(baseClasses, this.cClass());
  }
}
