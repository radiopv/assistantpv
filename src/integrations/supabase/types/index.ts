import { Json } from './common';
import { Children } from './children';
import { SponsorshipTables } from './sponsorship';
import { Database as HomepageDatabase } from './homepage';

export type Database = HomepageDatabase & {
  public: {
    Tables: {
      children: Children;
      sponsorship_requests: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          full_name: string;
          email: string;
          phone: string;
          city: string;
          facebook_url: string;
          motivation: string;
          terms_accepted: boolean;
          is_long_term: boolean;
          is_one_time: boolean;
          status: string;
          child_id: string;
        };
        Insert: {
          created_at?: string;
          updated_at?: string;
          full_name: string;
          email: string;
          phone: string;
          city: string;
          facebook_url: string;
          motivation: string;
          terms_accepted: boolean;
          is_long_term: boolean;
          is_one_time: boolean;
          status?: string;
          child_id: string;
        };
        Update: {
          id: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          city?: string;
          facebook_url?: string;
          motivation?: string;
          terms_accepted?: boolean;
          is_long_term?: boolean;
          is_one_time?: boolean;
          status?: string;
          child_id?: string;
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
      sponsorships: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          sponsor_id: string;
          child_id: string;
          start_date: string;
          end_date: string;
          status: string;
          is_anonymous: boolean;
          comments: string;
          termination_reason: string;
          termination_date: string;
          auto_terminate_job_id: string;
        };
        Insert: {
          created_at?: string;
          updated_at?: string;
          sponsor_id: string;
          child_id: string;
          start_date: string;
          end_date: string;
          status: string;
          is_anonymous: boolean;
          comments: string;
          termination_reason?: string;
          termination_date?: string;
          auto_terminate_job_id?: string;
        };
        Update: {
          id: string;
          created_at?: string;
          updated_at?: string;
          sponsor_id?: string;
          child_id?: string;
          start_date?: string;
          end_date?: string;
          status?: string;
          is_anonymous?: boolean;
          comments?: string;
          termination_reason?: string;
          termination_date?: string;
          auto_terminate_job_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sponsorships_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sponsorships_sponsor_id_fkey";
            columns: ["sponsor_id"];
            isOneToOne: false;
            referencedRelation: "sponsors";
            referencedColumns: ["id"];
          }
        ];
      };
      aid_categories: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      album_media: {
        Row: {
          child_id: string | null;
          created_at: string | null;
          description: string | null;
          featured_until: string | null;
          id: string;
          is_approved: boolean | null;
          is_featured: boolean | null;
          is_public: boolean | null;
          title: string | null;
          type: string;
          updated_at: string | null;
          url: string;
        };
        Insert: {
          child_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          featured_until?: string | null;
          id?: string;
          is_approved?: boolean | null;
          is_featured?: boolean | null;
          is_public?: boolean | null;
          title?: string | null;
          type: string;
          updated_at?: string | null;
          url?: string;
        };
        Update: {
          child_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          featured_until?: string | null;
          id?: string;
          is_approved?: boolean | null;
          is_featured?: boolean | null;
          is_public?: boolean | null;
          title?: string | null;
          type?: string;
          updated_at?: string | null;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "album_media_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          }
        ];
      };
      badges: {
        Row: {
          category: string | null;
          created_at: string | null;
          description: string | null;
          icon: string | null;
          id: string;
          name: string;
          points: number | null;
          requirements: Json | null;
          updated_at: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
          points?: number | null;
          requirements?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
          points?: number | null;
          requirements?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      birthday_reminders: {
        Row: {
          child_id: string | null;
          created_at: string | null;
          days_before: number[] | null;
          email: string | null;
          email_enabled: boolean | null;
          id: string;
          phone: string | null;
          sms_enabled: boolean | null;
          sponsor_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          child_id?: string | null;
          created_at?: string | null;
          days_before?: number[] | null;
          email?: string | null;
          email_enabled?: boolean | null;
          id?: string;
          phone?: string | null;
          sms_enabled?: boolean | null;
          sponsor_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          child_id?: string | null;
          created_at?: string | null;
          days_before?: number[] | null;
          email?: string | null;
          email_enabled?: boolean | null;
          id?: string;
          phone?: string | null;
          sms_enabled?: boolean | null;
          sponsor_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "birthday_reminders_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "birthday_reminders_sponsor_id_fkey";
            columns: ["sponsor_id"];
            isOneToOne: false;
            referencedRelation: "sponsors";
            referencedColumns: ["id"];
          }
        ];
      };
      chat_messages: {
        Row: {
          content: string;
          created_at: string | null;
          encryption_key: string | null;
          id: string;
          is_encrypted: boolean | null;
          room_id: string | null;
          sender_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          encryption_key?: string | null;
          id?: string;
          is_encrypted?: boolean | null;
          room_id?: string | null;
          sender_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          encryption_key?: string | null;
          id?: string;
          is_encrypted?: boolean | null;
          room_id?: string | null;
          sender_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "chat_rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "sponsors";
            referencedColumns: ["id"];
          }
        ];
      };
      chat_room_participants: {
        Row: {
          joined_at: string | null;
          role: string | null;
          room_id: string;
          sponsor_id: string;
        };
        Insert: {
          joined_at?: string | null;
          role?: string | null;
          room_id: string;
          sponsor_id: string;
        };
        Update: {
          joined_at?: string | null;
          role?: string | null;
          room_id?: string;
          sponsor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_room_participants_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "chat_rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_room_participants_sponsor_id_fkey";
            columns: ["sponsor_id"];
            isOneToOne: false;
            referencedRelation: "sponsors";
            referencedColumns: ["id"];
          }
        ];
      };
      chat_rooms: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          type: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          type?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          type?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chat_rooms_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "sponsors";
            referencedColumns: ["id"];
          }
        ];
      };
      donations: {
        Row: {
          assistant_name: string;
          city: string;
          comments: string | null;
          created_at: string | null;
          donation_date: string;
          id: string;
          people_helped: number;
          photos: string[] | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          assistant_name: string;
          city: string;
          comments?: string | null;
          created_at?: string | null;
          donation_date: string;
          id?: string;
          people_helped: number;
          photos?: string[] | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          assistant_name?: string;
          city?: string;
          comments?: string | null;
          created_at?: string | null;
          donation_date?: string;
          id?: string;
          people_helped?: number;
          photos?: string[] | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      donors: {
        Row: {
          created_at: string | null;
          donation_id: string | null;
          id: string;
          is_anonymous: boolean | null;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          donation_id?: string | null;
          id?: string;
          is_anonymous?: boolean | null;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          donation_id?: string | null;
          id?: string;
          is_anonymous?: boolean | null;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "donors_donation_id_fkey";
            columns: ["donation_id"];
            isOneToOne: false;
            referencedRelation: "donations";
            referencedColumns: ["id"];
          }
        ];
      };
      sponsors: {
        Row: {
          address: string | null;
          city: string | null;
          created_at: string | null;
          current_level_id: string | null;
          email: string | null;
          facebook_url: string | null;
          force_password_change: boolean | null;
          id: string;
          is_active: boolean | null;
          is_anonymous: boolean | null;
          last_login: string | null;
          name: string;
          password_hash: string | null;
          permissions: Json | null;
          phone: string | null;
          photo_url: string | null;
          privacy_settings: Json | null;
          role: string | null;
          show_name_publicly: boolean | null;
          total_points: number | null;
          updated_at: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          created_at?: string | null;
          current_level_id?: string | null;
          email?: string | null;
          facebook_url?: string | null;
          force_password_change?: boolean | null;
          id?: string;
          is_active?: boolean | null;
          is_anonymous?: boolean | null;
          last_login?: string | null;
          name: string;
          password_hash?: string | null;
          permissions?: Json | null;
          phone?: string | null;
          photo_url?: string | null;
          privacy_settings?: Json | null;
          role?: string | null;
          show_name_publicly?: boolean | null;
          total_points?: number | null;
          updated_at?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          created_at?: string | null;
          current_level_id?: string | null;
          email?: string | null;
          facebook_url?: string | null;
          force_password_change?: boolean | null;
          id?: string;
          is_active?: boolean | null;
          is_anonymous?: boolean | null;
          last_login?: string | null;
          name?: string;
          password_hash?: string | null;
          permissions?: Json | null;
          phone?: string | null;
          photo_url?: string | null;
          privacy_settings?: Json | null;
          role?: string | null;
          show_name_publicly?: boolean | null;
          total_points?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sponsors_current_level_id_fkey";
            columns: ["current_level_id"];
            isOneToOne: false;
            referencedRelation: "sponsor_levels";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [];
      };
      statistics_summary: {
        Row: {
          children_stats: Json | null;
          donation_stats: Json | null;
          refresh_timestamp: string | null;
          sponsor_stats: Json | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      approve_sponsorship_request: {
        Args: {
          request_id: string;
          admin_id: string;
        };
        Returns: undefined;
      };
      reject_sponsorship_request: {
        Args: {
          request_id: string;
          admin_id: string;
          rejection_reason?: string;
        };
        Returns: undefined;
      };
      terminate_sponsorship: {
        Args: {
          p_performed_by: string;
          p_sponsorship_id: string;
          p_termination_date: string;
          p_termination_reason: string;
          p_termination_comment: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      user_role: "admin" | "assistant" | "sponsor" | "visitor";
    };
    CompositeTypes: {
      email_template: {
        subject: string | null;
        html: string | null;
      };
    };
  };
};