import { ChildAssignmentRequestTable } from './tables/child-assignment-requests';
import { Children } from './children';
import { Sponsor } from './sponsor';
import { Json } from './json';

export interface Database {
  public: {
    Tables: {
      child_assignment_requests: ChildAssignmentRequestTable;
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
    Views: {
      donation_statistics: {
        Row: {
          completed_donations: number | null;
          pending_donations: number | null;
          success_rate: number | null;
          total_donations: number | null;
          total_people_helped: number | null;
        };
      };
      statistics_summary: {
        Row: {
          children_stats: Json | null;
          donation_stats: Json | null;
          refresh_timestamp: string | null;
          sponsor_stats: Json | null;
        };
      };
    };
    Functions: {
      approve_sponsorship_request: {
        Args: {
          request_id: string;
          admin_id: string;
        };
        Returns: void;
      };
      reject_sponsorship_request: {
        Args: {
          request_id: string;
          admin_id: string;
          rejection_reason?: string;
        };
        Returns: void;
      };
      create_notification: {
        Args: {
          p_recipient_id: string;
          p_type: string;
          p_title: string;
          p_content: string;
          p_link?: string;
        };
        Returns: string;
      };
      send_notification: {
        Args: {
          p_recipient_id: string;
          p_type: string;
          p_title: string;
          p_content: string;
          p_link?: string;
        };
        Returns: string;
      };
      check_permission: {
        Args: {
          user_id: string;
          required_permission: string;
        };
        Returns: boolean;
      };
      is_admin: {
        Args: {
          user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: "admin" | "assistant" | "sponsor" | "visitor";
    };
  };
}
