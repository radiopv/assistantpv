import { Database } from "../base";

export interface Profile {
  id: string;
  role: string;
  updated_at: string | null;
}

export interface ProfileInsert {
  id: string;
  role?: string;
  updated_at?: string | null;
}

export interface ProfileUpdate {
  id?: string;
  role?: string;
  updated_at?: string | null;
}