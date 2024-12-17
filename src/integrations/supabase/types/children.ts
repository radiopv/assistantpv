import { Json } from './json';

export interface Child {
  id: string;
  name: string;
  age: number;
  birth_date: string;
  gender: string;
  city: string | null;
  photo_url: string | null;
  description: string | null;
  story: string | null;
  comments: string | null;
  is_sponsored: boolean | null;
  needs: Json[] | null;
  photo_validated: boolean;
  sponsor_id?: number | null;
  sponsor_name?: string | null;
  sponsor_email?: string | null;
  sponsor_phone?: string | null;
  sponsor_facebook_url?: string | null;
  status: string;
  created_at: string;
  updated_at: string | null;
}

export interface ChildTable {
  Row: Child;
  Insert: Omit<Child, 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<Child>;
}