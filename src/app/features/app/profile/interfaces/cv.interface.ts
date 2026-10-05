import { FormControl } from '@angular/forms';

export interface CVCUPDto {
  name: string;
}

export interface CVResponse {
  id: string;
  downloadName: string;
  mimeType: string;
  sizeBytes: number;
  downloadCount: number;
  isActive: boolean;
  createdAt: Date;
}

export interface CVForm {
  name: FormControl<string>;
}
