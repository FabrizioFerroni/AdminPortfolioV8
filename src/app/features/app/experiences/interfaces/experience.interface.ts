import { FormControl, FormGroup } from '@angular/forms';

export interface ExperienceList {
  id: string;
  company: string;
  position: string;
  startsDate: Date;
  endsDate?: Date | null;
  currentPosition: boolean;
  description: string;
  displayOrder: number;
  skills: string[];
}

export interface ExperienceCount {
  total: number;
  currentPosition: number;
  skills: number;
}

export interface CreateExperienceDto {
  company: string;
  position: string;
  startsDate: Date | null;
  endsDate?: Date | null;
  currentPosition: boolean;
  description?: string;
  skills?: string[];
}

export interface UpdateExperienceDto {
  company: string;
  position: string;
  startsDate: Date | null;
  endsDate?: Date | null;
  currentPosition: boolean;
  description?: string;
  skills?: string[];
}

export type ExperienceFormGroup = FormGroup<{
  company: FormControl<string>;
  position: FormControl<string>;
  startsDate: FormControl<Date | null>;
  endsDate: FormControl<Date | null>;
  currentPosition: FormControl<boolean>;
  description: FormControl<string>;
  skills: FormControl<string[]>;
}>;
