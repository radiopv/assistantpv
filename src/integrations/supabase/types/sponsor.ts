import { Json } from './json';

export interface Sponsor {
  Row: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    city: string | null;
    address: string | null;
    facebook_url: string | null;
    is_active: boolean | null;
    is_anonymous: boolean | null;
    role: string | null;
    photo_url: string | null;
    show_name_publicly: boolean | null;
    created_at: string | null;
    updated_at: string | null;
    current_level_id: string | null;
    total_points: number | null;
    permissions: Json | null;
    privacy_settings: Json | null;
  };
  Insert: {
    id?: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    city?: string | null;
    address?: string | null;
    facebook_url?: string | null;
    is_active?: boolean | null;
    is_anonymous?: boolean | null;
    role?: string | null;
    photo_url?: string | null;
    show_name_publicly?: boolean | null;
    created_at?: string | null;
    updated_at?: string | null;
    current_level_id?: string | null;
    total_points?: number | null;
    permissions?: Json | null;
    privacy_settings?: Json | null;
  };
  Update: {
    id?: string;
    name?: string;
    email?: string | null;
    phone?: string | null;
    city?: string | null;
    address?: string | null;
    facebook_url?: string | null;
    is_active?: boolean | null;
    is_anonymous?: boolean | null;
    role?: string | null;
    photo_url?: string | null;
    show_name_publicly?: boolean | null;
    created_at?: string | null;
    updated_at?: string | null;
    current_level_id?: string | null;
    total_points?: number | null;
    permissions?: Json | null;
    privacy_settings?: Json | null;
  };
}