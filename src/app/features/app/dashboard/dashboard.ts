import { selectAuthUser } from '@/features/auth/store';
import { ZardSegmentedComponent } from '@/shared/components/segmented';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-dashboard',
  imports: [ZardSegmentedComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly store = inject(Store);
  user = this.store.selectSignal(selectAuthUser);

  options = [
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
    { value: 'year', label: 'Año' },
  ];

  onSelectionChange(value: string) {
    console.log('Selected:', value);
  }
}
