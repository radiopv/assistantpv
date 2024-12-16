import { ChildAssignmentRequestTable } from './child-assignment-requests';

export interface Database {
  public: {
    Tables: {
      child_assignment_requests: ChildAssignmentRequestTable;
      children: {
        Row: {
          id: string;
          name: string;
          age: number;
          photo_url: string | null;
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
          age: number;
          photo_url?: string | null;
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
          age?: number;
          photo_url?: string | null;
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
          photo_url?: string | null;
          is_active?: boolean;
          is_anonymous?: boolean;
          role: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
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
      child_assignment_requests: {
        Row: {
          id: string;
          child_id: string;
          requester_email: string;
          name: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          requester_email: string;
          name: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          child_id?: string;
          requester_email?: string;
          name?: string;
          status?: 'pending' | 'approved' | 'rejected';
          updated_at?: string;
        };
      };
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
    };
  };
}
