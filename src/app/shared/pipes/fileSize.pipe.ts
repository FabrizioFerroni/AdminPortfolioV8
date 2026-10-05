import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fileSize' })
export class FileSizePipe implements PipeTransform {
  private readonly units = ['B', 'KB', 'MB', 'GB', 'TB'];

  transform(bytes: number | null | undefined, decimals = 1): string {
    if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return '';
    if (bytes === 0) return '0 B';

    const i = Math.min(
      Math.max(Math.floor(Math.log(bytes) / Math.log(1024)), 0),
      this.units.length - 1
    );
    const value = bytes / Math.pow(1024, i);

    return `${value.toFixed(i === 0 ? 0 : decimals)} ${this.units[i]}`;
  }
}
