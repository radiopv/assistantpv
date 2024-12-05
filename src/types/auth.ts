export interface Sponsor {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  facebook_url: string | null;
  city: string | null;
  role: 'admin' | 'assistant' | 'sponsor' | 'visitor';
  photo_url: string | null;
  is_anonymous: boolean;
  show_name_publicly: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}