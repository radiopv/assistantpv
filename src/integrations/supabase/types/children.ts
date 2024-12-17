import { Json } from "./json";

export interface Child {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
  city: string;
  photo_url: string;
  description: string;
  story: string;
  comments: string;
  is_sponsored: boolean;
  needs: Json[];
  age: number;
  photo_validated: boolean;
  sponsor_id?: number;
  sponsor_name?: string;
  sponsor_email?: string;
  sponsor_phone?: string;
  sponsor_facebook_url?: string;
  status: string;
}

export interface Children {
  Row: Child;
  Insert: Omit<Child, 'id'>;
  Update: Partial<Child>;
}