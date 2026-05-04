import { ZardInputDirective } from '@/shared/components/input';
import { Z_SHEET_DATA } from '@/shared/components/sheet';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

interface iSheetData {
  subject: string;
  message: string;
}

@Component({
  selector: 'app-form-mail',
  imports: [FormsModule, ReactiveFormsModule, ZardInputDirective],
  templateUrl: './form-mail.html',
  styleUrl: './form-mail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'fFormMail',
})
export class FormMailComponent implements AfterViewInit {
  private zData: iSheetData = inject(Z_SHEET_DATA);

  form = new FormGroup({
    subject: new FormControl(''),
    message: new FormControl(''),
  });

  ngAfterViewInit(): void {
    if (this.zData) {
      this.form.patchValue(this.zData);
    }
  }
}
