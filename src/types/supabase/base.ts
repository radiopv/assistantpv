import { Json } from "../json";
import { Profile, ProfileInsert, ProfileUpdate } from "./tables/profiles";
import { Sponsorship, SponsorshipRequest } from "./tables/sponsorships";
import { UnifiedMediaBrowser } from "./views/unified-media-browser";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      sponsorships: {
        Row: Sponsorship;
        Insert: Omit<Sponsorship, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Sponsorship, 'id'>>;
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
      sponsorship_requests: {
        Row: SponsorshipRequest;
        Insert: Omit<SponsorshipRequest, 'id' | 'created_at' | 'updated_at' | 'status'>;
        Update: Partial<Omit<SponsorshipRequest, 'id'>>;
        Relationships: [];
      };
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
          url: string
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
          },
        ]
      }
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
          updated_at?: string
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
          },
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
          },
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
          },
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
          },
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
      children: {
        Row: {
          age: number
          birth_date: string
          city: string | null
          created_at: string | null
          description: string | null
          comments: string | null
          story: string | null
          end_date: string | null
          gender: string
          id: string
          is_sponsored: boolean | null
          location_id: number | null
          name: string
          needs: Json | null
          photo_url: string | null
          sponsor_email: string | null
          sponsor_facebook_url: string | null
          sponsor_id: number | null
          sponsor_name: string | null
          sponsor_phone: string | null
          sponsorship_id: number | null
          sponsorship_status: string | null
          sponsorships: string | null
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          age: number
          birth_date: string
          city?: string | null
          created_at?: string | null
          description?: string | null
          comments?: string | null
          story?: string | null
          end_date?: string
          gender: string
          id?: string
          is_sponsored?: boolean | null
          location_id?: number | null
          name: string
          needs?: Json | null
          photo_url?: string | null
          sponsor_email?: string | null
          sponsor_facebook_url?: string | null
          sponsor_id?: number | null
          sponsor_name?: string | null
          sponsor_phone?: string | null
          sponsorship_id?: number | null
          sponsorship_status?: string | null
          sponsorships?: string | null
          start_date?: string
          status: string
          updated_at?: string | null
        }
        Update: {
          age?: number
          birth_date?: string
          city?: string | null
          created_at?: string | null
          description?: string | null
          comments?: string | null
          story?: string | null
          end_date?: string | null
          gender?: string
          id?: string
          is_sponsored?: boolean | null
          location_id?: number | null
          name?: string
          needs?: Json | null
          photo_url?: string | null
          sponsor_email?: string | null
          sponsor_facebook_url?: string | null
          sponsor_id?: number | null
          sponsor_name?: string | null
          sponsor_phone?: string | null
          sponsorship_id?: number | null
          sponsorship_status?: string | null
          sponsorships?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "children_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "donation_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "donation_items_with_categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "donation_items_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_items_backup: {
        Row: {
          category_id: string | null
          created_at: string | null
          donation_id: string | null
          id: string | null
          quantity: number | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          donation_id?: string | null
          id?: string | null
          quantity?: number
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          donation_id?: string | null
          id?: string | null
          quantity?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      donation_locations: {
        Row: {
          address: string | null
          contact_info: Json | null
          created_at: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_info?: Json | null
          created_at?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_info?: Json | null
          created_at?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    };
    Views: {
      unified_media_browser: {
        Row: UnifiedMediaBrowser;
      };
      donation_items_with_categories: {
        Row: {
          category_id: string | null;
          category_name: string | null;
          description: string | null;
          donation_id: string | null;
          id: string | null;
          quantity: number | null;
        };
      };
      donation_statistics: {
        Row: {
          completed_donations: number | null
          pending_donations: number | null
          success_rate: number | null
          total_donations: number | null
          total_people_helped: number | null
        }
      }
      donation_videos_with_details: {
        Row: {
          id: string
          url: string
          title: string | null
          description: string | null
          thumbnail_url: string | null
          created_at: string | null
        }
      }
      statistics_summary: {
        Row: {
          children_stats: Json | null
          donation_stats: Json | null
          refresh_timestamp: string | null
          sponsor_stats: Json | null
        }
      }
    };
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
      auto_fix_links: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_and_award_badges: {
        Args: {
          sponsor_uuid: string
        }
        Returns: undefined
      }
      check_link: {
        Args: {
          link_id: string
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
      create_album_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_chat_room: {
        Args: {
          p_name: string
          p_type: string
          p_participants: string[]
        }
        Returns: string
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
      create_storage_bucket: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      exec_sql: {
        Args: {
          sql: string
        }
        Returns: undefined
      }
      fix_album_permissions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      fix_storage_permissions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_active_display_options: {
        Args: {
          category_filter?: string
        }
        Returns: {
          id: string
          name: string
          category: string
          display_order: number
        }[]
      }
      get_assistant_performance_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          assistant_name: string
          donations_count: number
          people_helped: number
          success_rate: number
        }[]
      }
      get_assistant_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_category_donation_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
          quantity: number
        }[]
      }
      get_city_donation_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          city: string
          donations: number
          people_helped: number
        }[]
      }
      get_current_statistics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_dashboard_statistics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_default_privacy_settings: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_daily_donation_trends: {
        Args: Record<PropertyKey, never>
        Returns: {
          day: number
          donations: number
        }[]
      }
      get_featured_donation_videos: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          url: string
          title: string
          description: string
          thumbnail_url: string
          created_at: string
        }[]
      }
      get_monthly_donation_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          month: string
          donations: number
        }[]
      }
      get_monthly_donation_trends: {
        Args: {
          months_back?: number
        }
        Returns: {
          month: string
          donations: number
          people_helped: number
          success_rate: number
        }[]
      }
      get_monthly_statistics: {
        Args: {
          start_date: string
          end_date: string
        }
        Returns: Json
      }
      get_sponsorship_conversion_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_top_sponsorship_cities: {
        Args: Record<PropertyKey, never>
        Returns: {
          city: string
          active_sponsorships: number
        }[]
      }
      get_unread_messages_count: {
        Args: {
          user_uuid: string
        }
        Returns: number
      }
      get_urgent_needs_by_city: {
        Args: Record<PropertyKey, never>
        Returns: {
          city: string
          urgent_needs_count: number
          total_needs: number
          urgent_needs_ratio: number
        }[]
      }
      get_user_engagement_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
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
      mark_message_as_read: {
        Args: {
          message_uuid: string
          user_uuid: string
        }
        Returns: undefined
      }
      process_birthday_reminders: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_email_queue: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_scheduled_tasks: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_sponsorship_end_dates: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_statistics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reject_sponsorship_request: {
        Args: {
          request_id: string
          admin_id: string
          rejection_reason?: string
        }
        Returns: undefined
      }
      retry_failed_emails: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      send_message: {
        Args: {
          p_recipient_id: string
          p_subject: string
          p_content: string
          p_sender_role?: string
          p_parent_id?: string
        }
        Returns: string
      }
      send_message_notification: {
        Args: {
          p_recipient_id: string
          p_sender_name: string
          p_subject: string
        }
        Returns: string
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
      send_notification_email: {
        Args: {
          p_recipient_id: string
          p_type: string
          p_title: string
          p_content: string
          p_link?: string
        }
        Returns: string
      }
      setup_album_media: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      setup_album_policies: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      setup_storage_bucket: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      setup_storage_policies: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      terminate_sponsorship: {
        Args: {
          p_performed_by: string
          p_sponsorship_id: string
          p_termination_date: string
          p_termination_reason: string
          p_termination_comment: string
        }
        Returns: undefined
      }
      update_sponsor_points: {
        Args: {
          sponsor_uuid: string
        }
        Returns: undefined
      }
      update_sponsor_role: {
        Args: {
          sponsor_id: string
          new_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: undefined
      }
      validate_assistant_login: {
        Args: {
          p_email: string
          p_password: string
        }
        Returns: {
          valid: boolean
          sponsor_id: string
        }[]
      }
    };
    Enums: {
      user_role: "admin" | "assistant" | "sponsor" | "visitor";
    };
  };
}
