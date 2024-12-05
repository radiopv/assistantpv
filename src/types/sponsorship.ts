export interface SponsoredChild {
  id: string;
  name: string;
  photo_url: string | null;
  city: string;
  age: number;
  status: string;
}

export interface Sponsorship {
  id: string;
  sponsor_id: string;
  child_id: string;
  status: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: string;
  name: string;
  photo_url: string | null;
  city: string | null;
  birth_date: string;
  status: string;
}