import { Z_SHEET_DATA } from '@/shared/components/sheet';
import { Component, inject, OnInit } from '@angular/core';
import { ContactList } from '../interfaces';

interface iSheetData {
  contact: ContactList;
}

@Component({
  selector: 'app-view-mail',
  imports: [],
  templateUrl: './view-mail.html',
  styleUrl: './view-mail.css',
})
export class ViewMailComponent implements OnInit {
  private zData: iSheetData = inject(Z_SHEET_DATA);
  contact: ContactList = {
    id: '',
    name: '',
    email: '',
    subject: '',
    message: '',
    status: '',
    send_at: '',
    received_at: '',
  };

  ngOnInit(): void {
    this.contact = this.zData.contact;
  }
}
