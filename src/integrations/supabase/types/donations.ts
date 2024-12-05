import { Json } from './common';

export interface DonationItem {
  id: string;
  donation_id: string | null;
  category_id: string | null;
  quantity: number;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
  aid_category?: AidCategory;
}

export interface AidCategory {
  id: string;
  name: string;
  description: string | null;
  icon_name: string | null;
  display_order: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Donation {
  id: string;
  assistant_name: string;
  city: string;
  comments: string | null;
  created_at: string | null;
  donation_date: string;
  people_helped: number;
  photos: string[] | null;
  status: string | null;
  updated_at: string | null;
  items?: DonationItem[];
}

export interface DonationWithDetails extends Donation {
  items: (DonationItem & {
    aid_category: AidCategory;
  })[];
}