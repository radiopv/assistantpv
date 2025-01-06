import { ChildAssignmentRequestTable } from './child-assignment-requests';
import { SponsorshipRequestTable } from './sponsorship-requests';
import { Json } from './json';

export interface Database {
  public: {
    Tables: {
      child_assignment_requests: ChildAssignmentRequestTable;
      sponsorship_requests: SponsorshipRequestTable;
      children: {
        Row: {
          id: string;
          name: string;
          gender: string;
          birth_date: string;
          city: string;
          photo_url: string | null;
          description: string;
          story: string;
          is_sponsored: boolean;
          sponsor_id: string | null;
          sponsor_name: string | null;
          sponsor_email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          gender: string;
          birth_date: string;
          city: string;
          photo_url?: string | null;
          description: string;
          story: string;
          is_sponsored?: boolean;
          sponsor_id?: string | null;
          sponsor_name?: string | null;
          sponsor_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          gender?: string;
          birth_date?: string;
          city?: string;
          photo_url?: string | null;
          description?: string;
          story?: string;
          is_sponsored?: boolean;
          sponsor_id?: string | null;
          sponsor_name?: string | null;
          sponsor_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sponsors: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          city: string | null;
          photo_url: string | null;
          is_active: boolean;
          is_anonymous: boolean;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          city?: string | null;
          photo_url?: string | null;
          is_active?: boolean;
          is_anonymous?: boolean;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          city?: string | null;
          photo_url?: string | null;
          is_active?: boolean;
          is_anonymous?: boolean;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      sponsorships: {
        Row: {
          id: string;
          sponsor_id: string;
          child_id: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sponsor_id: string;
          child_id: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sponsor_id?: string;
          child_id?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          subject: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_id: string;
          subject: string;
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_id?: string;
          subject?: string;
          content?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      album_media: {
        Row: {
          id: string;
          child_id: string;
          url: string;
          type: 'image' | 'video';
          description: string | null;
          is_approved: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          url: string;
          type: 'image' | 'video';
          description?: string | null;
          is_approved?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          child_id?: string;
          url?: string;
          type?: 'image' | 'video';
          description?: string | null;
          is_approved?: boolean | null;
          created_at?: string;
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
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
