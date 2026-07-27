import { FormControl } from '@angular/forms';

export interface TestimonialList {
  id: string;
  comment: string;
  fullname: string;
  position: string;
  empresa: string;
  visible: boolean;
  imageFullUrl: string;
  imageUrl: string;
  project: ProjectTestimonialSummaryDto;
}

export interface ProjectTestimonialSummaryDto {
  id: string;
  title: string;
  summary: string;
  slug: string;
}

export interface TestimonialCount {
  total: number;
  active: number;
  inactive: number;
}

export interface CreateOrUpdateTestimonial {
  comment: string;
  fullname: string;
  position: string;
  empresa: string;
  visible: boolean;
  projectId: string;
}

export interface TestimonialFormControls {
  comment: FormControl<string>;
  fullname: FormControl<string>;
  position: FormControl<string>;
  empresa: FormControl<string>;
  visible: FormControl<boolean>;
  projectId: FormControl<string>;
}
