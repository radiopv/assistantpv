import { Json } from "./json";

export interface Child {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
  city: string | null;
  photo_url: string | null;
  description: string | null;
  story: string | null;
  comments: string | null;
  is_sponsored: boolean | null;
  needs: Json[] | null;
  age: number;
  photo_validated: boolean;
  sponsor_id?: number | null;
  sponsor_name?: string | null;
  sponsor_email?: string | null;
  sponsor_phone?: string | null;
  sponsor_facebook_url?: string | null;
  status: string;
}

export interface Children {
  Row: Child;
  Insert: Omit<Child, 'id'>;
  Update: Partial<Child>;
}