import { ChildAssignmentRequestTable } from './tables/child-assignment-requests';
import { Children } from './children';
import { Sponsor } from './sponsor';

export interface Database {
  public: {
    Tables: {
      child_assignment_requests: ChildAssignmentRequestTable;
      children: Children;
      sponsors: Sponsor;
      album_media: {
        Row: {
          id: string;
          child_id: string;
          url: string;
          is_approved: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          url: string;
          is_approved?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          child_id?: string;
          url?: string;
          is_approved?: boolean | null;
          updated_at?: string;
        };
      };
      temoignage: {
        Row: {
          id: string;
          content: string;
          author: string;
          rating: number;
          is_approved: boolean;
          is_featured: boolean;
          sponsor_id: string;
          child_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          author: string;
          rating: number;
          is_approved?: boolean;
          is_featured?: boolean;
          sponsor_id: string;
          child_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          author?: string;
          rating?: number;
          is_approved?: boolean;
          is_featured?: boolean;
          sponsor_id?: string;
          child_id?: string;
          updated_at?: string;
        };
      };
      sponsorships: {
        Row: {
          id: string;
          sponsor_id: string;
          child_id: string;
          start_date: string;
          end_date: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sponsor_id: string;
          child_id: string;
          start_date: string;
          end_date?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sponsor_id?: string;
          child_id?: string;
          start_date?: string;
          end_date?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      sponsors: {
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
      };
      sponsorship_requests: {
        Row: {
          id: string;
          sponsor_id: string;
          child_id: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
          full_name: string;
          email: string;
          phone?: string;
          city?: string;
          motivation?: string;
          is_long_term: boolean;
          facebook_url?: string;
        };
        Insert: {
          id?: string;
          sponsor_id: string;
          child_id: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
          full_name: string;
          email: string;
          phone?: string;
          city?: string;
          motivation?: string;
          is_long_term?: boolean;
          facebook_url?: string;
        };
        Update: {
          id?: string;
          sponsor_id?: string;
          child_id?: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          city?: string;
          motivation?: string;
          is_long_term?: boolean;
          facebook_url?: string;
        };
      };
    };
  };
}
