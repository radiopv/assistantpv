import { ChildAssignmentRequestTable } from './tables/child-assignment-requests';
import { Children } from './children';
import { Sponsor } from './sponsor';
import { Json } from './json';

export interface Database {
  public: {
    Tables: {
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
        Update: Partial<{
          id: string;
          child_id: string;
          requester_email: string;
          name: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        }>;
        Relationships: [
          {
            foreignKeyName: "child_assignment_requests_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          }
        ];
      };
      children: Children;
      sponsors: Sponsor;
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
        Relationships: [
          {
            foreignKeyName: "sponsorship_requests_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          }
        ];
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
          rating?: number;
          is_approved?: boolean;
          is_featured?: boolean;
          sponsor_id?: string;
          child_id?: string;
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
    };
  };
}