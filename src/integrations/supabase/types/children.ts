import { Json } from './json';

export interface Child {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
  city: string | null;
  photo_url: string | null;
  photo_validated: boolean;
  description: string | null;
  story: string | null;
  is_sponsored: boolean;
  sponsor_id: string | null;
  sponsor_name: string | null;
  sponsor_email: string | null;
  created_at: string;
  updated_at: string | null;
  needs: Json | null;
  age: number;
}

export interface ChildTable {
  Row: Child;
  Insert: Omit<Child, 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<Child>;
}

// Re-export for backward compatibility
export type Children = {
  Row: Child;
}