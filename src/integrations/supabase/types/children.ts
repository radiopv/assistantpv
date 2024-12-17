export interface Child {
  id: string;
  name: string;
  age: number;
  birth_date: string;
  gender: string;
  city: string;
  description: string;
  photo_url: string | null;
  is_sponsored: boolean;
  sponsor_id: string | null;
  created_at: string;
  updated_at: string | null;
  photo_validated: boolean;
}
