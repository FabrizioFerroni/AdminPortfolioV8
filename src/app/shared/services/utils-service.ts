import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private readonly titleService: Title = inject(Title);

  nameApp: string = environment.name;

  setTitle(title?: string) {
    this.titleService.setTitle(`${title !== '' ? title + ' | ' + this.nameApp : this.nameApp}`);
  }
}
