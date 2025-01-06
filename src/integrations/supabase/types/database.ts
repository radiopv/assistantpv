import { Tasks } from './tasks';
import { Children } from './children';
import { Json } from './json';

export type Database = {
  public: {
    Tables: {
      aid_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      album_media: {
        Row: {
          child_id: string | null
          created_at: string | null
          description: string | null
          featured_until: string | null
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          is_public: boolean | null
          title: string | null
          type: string
          updated_at: string | null
          url: string
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          featured_until?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_public?: boolean | null
          title?: string | null
          type: string
          updated_at?: string | null
          url?: string
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          featured_until?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_public?: boolean | null
          title?: string | null
          type?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "album_media_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: Tasks;
      children: Children;
      badges: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          points: number | null
          requirements: Json | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          points?: number | null
          requirements?: Json | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          points?: number | null
          requirements?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      birthday_reminders: {
        Row: {
          child_id: string | null
          created_at: string | null
          days_before: number[] | null
          email: string | null
          email_enabled: boolean | null
          id: string
          phone: string | null
          sms_enabled: boolean | null
          sponsor_id: string | null
          updated_at: string | null
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          days_before?: number[] | null
          email?: string | null
          email_enabled?: boolean | null
          id?: string
          phone?: string | null
          sms_enabled?: boolean | null
          sponsor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          days_before?: number[] | null
          email?: string | null
          email_enabled?: boolean | null
          id?: string
          phone?: string | null
          sms_enabled?: boolean | null
          sponsor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "birthday_reminders_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "birthday_reminders_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          encryption_key: string | null
          id: string
          is_encrypted: boolean | null
          room_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          encryption_key?: string | null
          id?: string
          is_encrypted?: boolean | null
          room_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          encryption_key?: string | null
          id?: string
          is_encrypted?: boolean | null
          room_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_room_participants: {
        Row: {
          joined_at: string | null
          role: string | null
          room_id: string
          sponsor_id: string
        }
        Insert: {
          joined_at?: string | null
          role?: string | null
          room_id: string
          sponsor_id: string
        }
        Update: {
          joined_at?: string | null
          role?: string | null
          room_id?: string
          sponsor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_room_participants_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_rooms_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          }
        ]
      }
      child_display_options: {
        Row: {
          category: string
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      donation_items: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          donation_id: string | null
          id: string
          quantity: number
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          donation_id?: string | null
          id?: string
          quantity: number
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          donation_id?: string | null
          id?: string
          quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "aid_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_items_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          }
        ]
      }
      donations: {
        Row: {
          assistant_name: string
          city: string
          comments: string | null
          created_at: string | null
          donation_date: string
          id: string
          people_helped: number
          photos: string[] | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assistant_name: string
          city: string
          comments?: string | null
          created_at?: string | null
          donation_date: string;
          id?: string;
          people_helped: number;
          photos?: string[] | null;
          status?: string | null;
          updated_at?: string | null;
        }
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
        }
        Relationships: []
      }
      donors: {
        Row: {
          created_at: string | null
          donation_id: string | null
          id: string
          is_anonymous: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          donation_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          donation_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donors_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          }
        ]
      }
      locations: {
        Row: {
          child_count: number | null
          city_name: string
          created_at: string | null
          id: number
          latitude: number
          longitude: number
          sponsored_count: number | null
          updated_at: string | null
        }
        Insert: {
          child_count?: number | null
          city_name: string
          created_at?: string | null
          id?: number
          latitude: number;
          longitude: number;
          sponsored_count?: number | null
          updated_at?: string | null
        }
        Update: {
          child_count?: number | null
          city_name?: string;
          created_at?: string | null
          id?: number;
          latitude?: number;
          longitude?: number;
          sponsored_count?: number | null;
          updated_at?: string | null;
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_type: string | null
          created_at: string | null
          id: string
          is_archived: boolean | null
          is_read: boolean | null
          is_starred: boolean | null
          parent_id: string | null
          recipient_id: string | null
          sender_id: string | null
          sender_role: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          content: string
          conversation_type?: string | null
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          is_starred?: boolean | null
          parent_id?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          sender_role?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          conversation_type?: string | null
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          is_starred?: boolean | null
          parent_id?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          sender_role?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          recipient_id: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          recipient_id?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          recipient_id?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          }
        ]
      }
      permissions: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          current_level_id: string | null
          email: string | null
          facebook_url: string | null
          force_password_change: boolean | null
          id: string
          is_active: boolean | null
          is_anonymous: boolean | null
          last_login: string | null
          name: string
          password_hash: string | null
          permissions: Json | null
          phone: string | null
          photo_url: string | null
          privacy_settings: Json | null
          role: string | null
          show_name_publicly: boolean | null
          total_points: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          current_level_id?: string | null
          email?: string | null
          facebook_url?: string | null
          force_password_change?: boolean | null
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean | null
          last_login?: string | null
          name: string
          password_hash?: string | null
          permissions?: Json | null
          phone?: string | null
          photo_url?: string | null
          privacy_settings?: Json | null
          role?: string | null
          show_name_publicly?: boolean | null
          total_points?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          current_level_id?: string | null
          email?: string | null
          facebook_url?: string | null
          force_password_change?: boolean | null
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean | null
          last_login?: string | null
          name?: string
          password_hash?: string | null
          permissions?: Json | null
          phone?: string | null
          photo_url?: string | null
          privacy_settings?: Json | null
          role?: string | null
          show_name_publicly?: boolean | null
          total_points?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsors_current_level_id_fkey"
            columns: ["current_level_id"]
            isOneToOne: false
            referencedRelation: "sponsor_levels"
            referencedColumns: ["id"]
          }
        ]
      }
      sponsorships: {
        Row: {
          auto_terminate_job_id: string | null
          child_id: string | null
          comments: string | null
          created_at: string | null
          end_date: string | null
          id: string
          is_anonymous: boolean | null
          sponsor_id: string | null
          sponsorships: string | null
          start_date: string
          status: string
          termination_comment: string | null
          termination_date: string | null
          termination_reason: string | null
          updated_at: string | null
        }
        Insert: {
          auto_terminate_job_id?: string | null
          child_id?: string | null
          comments?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_anonymous?: boolean | null
          sponsor_id?: string | null
          sponsorships?: string | null
          start_date: string
          status: string
          termination_comment?: string | null
          termination_date?: string | null
          termination_reason?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_terminate_job_id?: string | null
          child_id?: string | null
          comments?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_anonymous?: boolean | null
          sponsor_id?: string | null
          sponsorships?: string | null
          start_date?: string
          status?: string
          termination_comment?: string | null
          termination_date?: string | null
          termination_reason?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsorships_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsorships_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      donation_items_with_categories: {
        Row: {
          category_id: string | null
          category_name: string | null
          description: string | null
          donation_id: string | null
          id: string
          quantity: number | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_items_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          }
        ]
      }
      donation_statistics: {
        Row: {
          completed_donations: number | null
          pending_donations: number | null
          success_rate: number | null
          total_donations: number | null
          total_people_helped: number | null
        }
        Relationships: []
      }
      donation_videos_with_details: {
        Row: {
          assistant_name: string | null
          city: string | null
          created_at: string | null
          description: string | null
          donation_date: string | null
          donation_id: string | null
          id: string | null
          is_featured: boolean | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_videos_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          }
        ]
      }
      statistics_summary: {
        Row: {
          children_stats: Json | null
          donation_stats: Json | null
          refresh_timestamp: string | null
          sponsor_stats: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_assistant: {
        Args: {
          input_user_id: string
        }
        Returns: undefined
      }
      approve_sponsorship_request: {
        Args: {
          request_id: string
          admin_id: string
        }
        Returns: undefined
      }
      check_permission: {
        Args: {
          user_id: string
          required_permission: string
        }
        Returns: boolean
      }
      create_notification: {
        Args: {
          p_recipient_id: string
          p_type: string
          p_title: string
          p_content: string
          p_link?: string
        }
        Returns: string
      }
      get_user_permissions: {
        Args: {
          user_role: string
        }
        Returns: Json
      }
      has_permission: {
        Args: {
          user_id: string
          required_permission: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      send_notification: {
        Args: {
          p_recipient_id: string
          p_type: string
          p_title: string
          p_content: string
          p_link?: string
        }
        Returns: string
      }
    }
    Enums: {
      user_role: "admin" | "assistant" | "sponsor" | "visitor"
    }
    CompositeTypes: {
      email_template: {
        subject: string | null
        html: string | null
      }
    }
  }
}
