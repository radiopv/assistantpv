import { ChildAssignmentRequestTable } from './tables/child-assignment-requests';
import { SponsorshipRequestTable } from './tables/sponsorship-requests';
import { ChildrenTable } from './tables/children';
import { SponsorsTable } from './tables/sponsors';
import { SponsorshipsTable } from './tables/sponsorships';
import { MessagesTable } from './tables/messages';
import { AlbumMediaTable } from './tables/album-media';
import { TestimonialsTable } from './tables/testimonials';

export interface Database {
  public: {
    Tables: {
      child_assignment_requests: ChildAssignmentRequestTable;
      sponsorship_requests: SponsorshipRequestTable;
      children: ChildrenTable;
      sponsors: SponsorsTable;
      sponsorships: SponsorshipsTable;
      messages: MessagesTable;
      album_media: AlbumMediaTable;
      temoignage: TestimonialsTable;
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          details: Record<string, any> | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          details?: Record<string, any> | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          details?: Record<string, any> | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          id: string;
          role: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          role?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          role?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          recipient_id: string;
          type: string;
          title: string;
          content: string;
          link: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_id: string;
          type: string;
          title: string;
          content: string;
          link?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipient_id?: string;
          type?: string;
          title?: string;
          content?: string;
          link?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey";
            columns: ["recipient_id"];
            isOneToOne: false;
            referencedRelation: "sponsors";
            referencedColumns: ["id"];
          }
        ];
      };
      email_queue: {
        Row: {
          id: string;
          recipient_email: string;
          subject: string;
          content: string;
          status: string;
          attempts: number;
          last_attempt: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_email: string;
          subject: string;
          content: string;
          status?: string;
          attempts?: number;
          last_attempt?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipient_email?: string;
          subject?: string;
          content?: string;
          status?: string;
          attempts?: number;
          last_attempt?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      send_email: {
        Args: {
          recipient: string;
          subject: string;
          content: string;
        };
        Returns: boolean;
      };
      process_email_queue: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
    Enums: {
      request_status: 'pending' | 'approved' | 'rejected';
      notification_type: 'info' | 'success' | 'warning' | 'error';
      email_status: 'pending' | 'sent' | 'failed';
    };
  };
}