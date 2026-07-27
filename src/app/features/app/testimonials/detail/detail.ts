import { Component, OnInit, signal } from '@angular/core';
import { TestimonialList } from '../interface';
import { injectDialogData } from '@/shared/components/dialog';

interface iDetailData {
  testimonial: TestimonialList;
}

@Component({
  imports: [],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class DetailTestimonialDialog implements OnInit {
  //#region Inyecciones
  private zData = injectDialogData<iDetailData>();
  //#endregion

  //#region variables
  testimonio = signal<TestimonialList | null>(null);
  //#endregion

  //#region Inicializacion ciclo vida
  ngOnInit(): void {
    this.testimonio.set(this.zData.testimonial);
  }
  //#endregion
}
