import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // deja que required lo maneje

    try {
      const url = new URL(control.value);
      const isValid = url.protocol === 'http:' || url.protocol === 'https:';
      return isValid ? null : { url: true };
    } catch {
      return { url: true };
    }
  };
}
