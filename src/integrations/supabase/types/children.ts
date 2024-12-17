export interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  birth_date: string;
  city: string | null;
  description?: string;
  story?: string;
  photo_url?: string;
  is_sponsored: boolean;
  sponsor_id?: string;
  sponsor_name?: string;
  sponsor_email?: string;
  needs?: any;
  created_at?: string;
  updated_at?: string;
  photo_validated: boolean;
  status: string;
  comments?: string;
}

export interface Children {
  Row: Child;
}