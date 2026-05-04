export interface SubscriberList {
  id: string;
  name: string;
  email: string;
  subscribed_at: Date;
  source: string;
  status: boolean;
}

export interface SubscriberCount {
  total: number;
  active: number;
  inactive: number;
}
