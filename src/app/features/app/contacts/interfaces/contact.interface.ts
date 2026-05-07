export interface ContactList {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  send_at: string;
  received_at: string;
}

export interface ContactCount {
  total: number;
  unread: number;
  read: number;
  repplied: number;
}

export interface UpdateStatusContact {
  status: string;
}
