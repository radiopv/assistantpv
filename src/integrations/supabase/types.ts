export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      aid_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
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
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          is_public: boolean | null
          sponsor_id: string | null
          sponsorship_id: string | null
          title: string | null
          type: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_public?: boolean | null
          sponsor_id?: string | null
          sponsorship_id?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_public?: boolean | null
          sponsor_id?: string | null
          sponsorship_id?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "album_media_new_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "album_media_new_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "album_media_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_album_media_sponsors"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_album_media_sponsorships"
            columns: ["sponsorship_id"]
            isOneToOne: false
            referencedRelation: "sponsorships"
            referencedColumns: ["id"]
          },
        ]
      }
      album_media_backup: {
        Row: {
          badge_id: string | null
          child_id: string | null
          created_at: string | null
          description: string | null
          featured_until: string | null
          id: string | null
          is_approved: boolean | null
          is_featured: boolean | null
          is_public: boolean | null
          sponsor_id: string | null
          title: string | null
          type: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          badge_id?: string | null
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          featured_until?: string | null
          id?: string | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_public?: boolean | null
          sponsor_id?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          badge_id?: string | null
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          featured_until?: string | null
          id?: string | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_public?: boolean | null
          sponsor_id?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      birthday_reminders: {
        Row: {
          child_id: string
          created_at: string | null
          id: string
          reminder_date: string
          reminder_sent: boolean | null
          sponsor_id: string
          updated_at: string | null
        }
        Insert: {
          child_id: string
          created_at?: string | null
          id?: string
          reminder_date: string
          reminder_sent?: boolean | null
          sponsor_id: string
          updated_at?: string | null
        }
        Update: {
          child_id?: string
          created_at?: string | null
          id?: string
          reminder_date?: string
          reminder_sent?: boolean | null
          sponsor_id?: string
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
      child_assignment_requests: {
        Row: {
          child_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          sponsor_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          sponsor_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          sponsor_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "child_assignment_requests_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_assignment_requests_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          age: number | null
          birth_date: string
          city: string | null
          comments: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          gender: string
          id: string
          is_sponsored: boolean | null
          location_id: number | null
          name: string
          needs: Json | null
          photo_url: string | null
          sponsor_email: string | null
          sponsor_id: string | null
          sponsor_name: string | null
          start_date: string | null
          status: string
          story: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          birth_date: string
          city?: string | null
          comments?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          gender: string
          id?: string
          is_sponsored?: boolean | null
          location_id?: number | null
          name: string
          needs?: Json | null
          photo_url?: string | null
          sponsor_email?: string | null
          sponsor_id?: string | null
          sponsor_name?: string | null
          start_date?: string | null
          status?: string
          story?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          birth_date?: string
          city?: string | null
          comments?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          gender?: string
          id?: string
          is_sponsored?: boolean | null
          location_id?: number | null
          name?: string
          needs?: Json | null
          photo_url?: string | null
          sponsor_email?: string | null
          sponsor_id?: string | null
          sponsor_name?: string | null
          start_date?: string | null
          status?: string
          story?: string | null
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
            foreignKeyName: "donation_items_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_donation_items_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "aid_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_photos: {
        Row: {
          created_at: string
          donation_id: string | null
          id: number
          is_featured: boolean | null
          mime_type: string | null
          title: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          donation_id?: string | null
          id?: number
          is_featured?: boolean | null
          mime_type?: string | null
          title?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          donation_id?: string | null
          id?: number
          is_featured?: boolean | null
          mime_type?: string | null
          title?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_donation_id"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_videos: {
        Row: {
          created_at: string | null
          description: string | null
          donation_id: string | null
          id: string
          is_featured: boolean | null
          mime_type: string | null
          thumbnail: string | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          donation_id?: string | null
          id?: string
          is_featured?: boolean | null
          mime_type?: string | null
          thumbnail?: string | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          donation_id?: string | null
          id?: string
          is_featured?: boolean | null
          mime_type?: string | null
          thumbnail?: string | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "donation_videos_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          assistant_name: string
          city: string
          comments: string | null
          created_at: string | null
          donation_date: string
          donation_items: string | null
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
          donation_date: string
          donation_items?: string | null
          id?: string
          people_helped: number
          photos?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assistant_name?: string
          city?: string
          comments?: string | null
          created_at?: string | null
          donation_date?: string
          donation_items?: string | null
          id?: string
          people_helped?: number
          photos?: string[] | null
          status?: string | null
          updated_at?: string | null
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
          },
        ]
      }
      email_queue: {
        Row: {
          attempts: number | null
          content: string
          created_at: string | null
          id: string
          last_attempt: string | null
          notification_id: string | null
          recipient_email: string
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          attempts?: number | null
          content: string
          created_at?: string | null
          id?: string
          last_attempt?: string | null
          notification_id?: string | null
          recipient_email: string
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          attempts?: number | null
          content?: string
          created_at?: string | null
          id?: string
          last_attempt?: string | null
          notification_id?: string | null
          recipient_email?: string
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      faq: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      home_images: {
        Row: {
          created_at: string | null
          id: string
          is_mobile: boolean | null
          position: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_mobile?: boolean | null
          position: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_mobile?: boolean | null
          position?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      homepage_content: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      homepage_modules: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          module_type: string
          name: string
          order_index: number | null
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          module_type: string
          name: string
          order_index?: number | null
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          module_type?: string
          name?: string
          order_index?: number | null
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      homepage_sections: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          order_index: number | null
          section_key: string
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          section_key: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          section_key?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      link_checker: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          is_internal: boolean | null
          last_checked: string | null
          priority: string | null
          redirect_url: string | null
          source_page: string
          status: string | null
          status_code: number | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          is_internal?: boolean | null
          last_checked?: string | null
          priority?: string | null
          redirect_url?: string | null
          source_page: string
          status?: string | null
          status_code?: number | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          is_internal?: boolean | null
          last_checked?: string | null
          priority?: string | null
          redirect_url?: string | null
          source_page?: string
          status?: string | null
          status_code?: number | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          attempt_count: number | null
          created_at: string | null
          email: string
          id: string
          is_locked: boolean | null
          last_attempt: string | null
          updated_at: string | null
        }
        Insert: {
          attempt_count?: number | null
          created_at?: string | null
          email: string
          id?: string
          is_locked?: boolean | null
          last_attempt?: string | null
          updated_at?: string | null
        }
        Update: {
          attempt_count?: number | null
          created_at?: string | null
          email?: string
          id?: string
          is_locked?: boolean | null
          last_attempt?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      media_items: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          original_url: string | null
          source_id: string
          source_table: string
          thumbnail_url: string | null
          type: string
          updated_at: string | null
          url: string
          version: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          original_url?: string | null
          source_id: string
          source_table: string
          thumbnail_url?: string | null
          type: string
          updated_at?: string | null
          url: string
          version?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          original_url?: string | null
          source_id?: string
          source_table?: string
          thumbnail_url?: string | null
          type?: string
          updated_at?: string | null
          url?: string
          version?: number | null
        }
        Relationships: []
      }
      message_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_type: string
          file_url: string
          id: string
          message_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_type: string
          file_url: string
          id?: string
          message_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_archived: boolean | null
          is_read: boolean | null
          message_type: string | null
          recipient_id: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          sender_id: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          message_type?: string | null
          recipient_id?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          sender_id?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          message_type?: string | null
          recipient_id?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          sender_id?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
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
          },
        ]
      }
      need_categories: {
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
          },
        ]
      }
      parrain: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      planned_visits: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          notes: string | null
          purpose: string | null
          sponsor_id: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          notes?: string | null
          purpose?: string | null
          sponsor_id?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          notes?: string | null
          purpose?: string | null
          sponsor_id?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planned_visits_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reminder_preferences: {
        Row: {
          browser_notifications: boolean | null
          created_at: string | null
          default_days_before: number[] | null
          default_email: string | null
          default_email_enabled: boolean | null
          default_phone: string | null
          default_sms_enabled: boolean | null
          id: string
          notification_sound: boolean | null
          sponsor_id: string | null
          updated_at: string | null
        }
        Insert: {
          browser_notifications?: boolean | null
          created_at?: string | null
          default_days_before?: number[] | null
          default_email?: string | null
          default_email_enabled?: boolean | null
          default_phone?: string | null
          default_sms_enabled?: boolean | null
          id?: string
          notification_sound?: boolean | null
          sponsor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          browser_notifications?: boolean | null
          created_at?: string | null
          default_days_before?: number[] | null
          default_email?: string | null
          default_email_enabled?: boolean | null
          default_phone?: string | null
          default_sms_enabled?: boolean | null
          id?: string
          notification_sound?: boolean | null
          sponsor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminder_preferences_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: true
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_visits: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          sponsorship_id: string | null
          status: string | null
          updated_at: string | null
          visit_date: string | null
          visit_end_date: string | null
          visit_start_date: string | null
          wants_donation_pickup: boolean | null
          wants_to_visit_child: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          sponsorship_id?: string | null
          status?: string | null
          updated_at?: string | null
          visit_date?: string | null
          visit_end_date?: string | null
          visit_start_date?: string | null
          wants_donation_pickup?: boolean | null
          wants_to_visit_child?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          sponsorship_id?: string | null
          status?: string | null
          updated_at?: string | null
          visit_date?: string | null
          visit_end_date?: string | null
          visit_start_date?: string | null
          wants_donation_pickup?: boolean | null
          wants_to_visit_child?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_visits_sponsorship_id_fkey"
            columns: ["sponsorship_id"]
            isOneToOne: false
            referencedRelation: "sponsorships"
            referencedColumns: ["id"]
          },
        ]
      }
      site_config: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          site_name: string | null
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          site_name?: string | null
          updated_at?: string | null
          value?: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          site_name?: string | null
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      sponsor_documents: {
        Row: {
          created_at: string | null
          description: string | null
          document_type: string | null
          file_url: string
          id: string
          sponsor_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          document_type?: string | null
          file_url: string
          id?: string
          sponsor_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          document_type?: string | null
          file_url?: string
          id?: string
          sponsor_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_documents_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
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
          is_verified: boolean | null
          last_login: string | null
          name: string | null
          password_hash: string | null
          permissions: Json | null
          phone: string | null
          photo_url: string | null
          privacy_settings: Json | null
          ranking_score: number | null
          role: string | null
          show_name_publicly: boolean | null
          status: string | null
          total_points: number | null
          updated_at: string | null
          visit_end_date: string | null
          visit_start_date: string | null
          wants_donation_pickup: boolean | null
          wants_to_visit_child: boolean | null
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
          is_verified?: boolean | null
          last_login?: string | null
          name?: string | null
          password_hash?: string | null
          permissions?: Json | null
          phone?: string | null
          photo_url?: string | null
          privacy_settings?: Json | null
          ranking_score?: number | null
          role?: string | null
          show_name_publicly?: boolean | null
          status?: string | null
          total_points?: number | null
          updated_at?: string | null
          visit_end_date?: string | null
          visit_start_date?: string | null
          wants_donation_pickup?: boolean | null
          wants_to_visit_child?: boolean | null
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
          is_verified?: boolean | null
          last_login?: string | null
          name?: string | null
          password_hash?: string | null
          permissions?: Json | null
          phone?: string | null
          photo_url?: string | null
          privacy_settings?: Json | null
          ranking_score?: number | null
          role?: string | null
          show_name_publicly?: boolean | null
          status?: string | null
          total_points?: number | null
          updated_at?: string | null
          visit_end_date?: string | null
          visit_start_date?: string | null
          wants_donation_pickup?: boolean | null
          wants_to_visit_child?: boolean | null
        }
        Relationships: []
      }
      sponsors_to_children: {
        Row: {
          child_id: string | null
          created_at: string | null
          id: string
          sponsor_id: string | null
          updated_at: string | null
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          id?: string
          sponsor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          id?: string
          sponsor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsors_to_children_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsors_to_children_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsorship_requests: {
        Row: {
          child_id: string | null
          city: string | null
          created_at: string | null
          email: string
          facebook_url: string | null
          full_name: string
          id: string
          is_account_approved: boolean | null
          is_account_created: boolean | null
          is_long_term: boolean | null
          is_one_time: boolean | null
          motivation: string | null
          password_hash: string | null
          phone: string | null
          sponsor_id: string | null
          status: string | null
          terms_accepted: boolean | null
          updated_at: string | null
        }
        Insert: {
          child_id?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          facebook_url?: string | null
          full_name: string
          id?: string
          is_account_approved?: boolean | null
          is_account_created?: boolean | null
          is_long_term?: boolean | null
          is_one_time?: boolean | null
          motivation?: string | null
          password_hash?: string | null
          phone?: string | null
          sponsor_id?: string | null
          status?: string | null
          terms_accepted?: boolean | null
          updated_at?: string | null
        }
        Update: {
          child_id?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          facebook_url?: string | null
          full_name?: string
          id?: string
          is_account_approved?: boolean | null
          is_account_created?: boolean | null
          is_long_term?: boolean | null
          is_one_time?: boolean | null
          motivation?: string | null
          password_hash?: string | null
          phone?: string | null
          sponsor_id?: string | null
          status?: string | null
          terms_accepted?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsorship_requests_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsorships: {
        Row: {
          child_id: string
          created_at: string | null
          end_date: string | null
          id: string
          sponsor_id: string | null
          start_date: string | null
          status: string
          termination_comment: string | null
          termination_date: string | null
          termination_reason: string | null
          updated_at: string | null
        }
        Insert: {
          child_id: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          sponsor_id?: string | null
          start_date?: string | null
          status?: string
          termination_comment?: string | null
          termination_date?: string | null
          termination_reason?: string | null
          updated_at?: string | null
        }
        Update: {
          child_id?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          sponsor_id?: string | null
          start_date?: string | null
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
          },
        ]
      }
      tasks: {
        Row: {
          child_id: string | null
          created_at: string | null
          description: string | null
          id: number
          is_completed: boolean | null
          title: string
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_completed?: boolean | null
          title: string
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_completed?: boolean | null
          title?: string
        }
        Relationships: []
      }
      temoignage: {
        Row: {
          child_id: string | null
          content: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          parrain_id: string | null
          rating: number | null
          sponsor_id: string | null
          updated_at: string | null
        }
        Insert: {
          child_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          parrain_id?: string | null
          rating?: number | null
          sponsor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          child_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          parrain_id?: string | null
          rating?: number | null
          sponsor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_temoignage_parrain"
            columns: ["parrain_id"]
            isOneToOne: false
            referencedRelation: "parrain"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "temoignage_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "temoignage_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      translation_reports: {
        Row: {
          created_at: string | null
          id: string
          report: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          report: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          report?: Json
        }
        Relationships: []
      }
      translations: {
        Row: {
          content: Json
          created_at: string
          id: number
          language: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: number
          language: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: number
          language?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      donation_items_with_categories: {
        Row: {
          category_id: string | null
          category_name: string | null
          created_at: string | null
          description: string | null
          donation_id: string | null
          id: string | null
          quantity: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_items_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_donation_items_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "aid_categories"
            referencedColumns: ["id"]
          },
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
          },
        ]
      }
      featured_photos_view: {
        Row: {
          child_id: string | null
          child_name: string | null
          created_at: string | null
          description: string | null
          id: string | null
          is_anonymous: boolean | null
          is_approved: boolean | null
          is_featured: boolean | null
          is_public: boolean | null
          sponsor_id: string | null
          sponsor_name: string | null
          sponsorship_id: string | null
          title: string | null
          type: string | null
          updated_at: string | null
          url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "album_media_new_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "album_media_new_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "album_media_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_album_media_sponsors"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_album_media_sponsorships"
            columns: ["sponsorship_id"]
            isOneToOne: false
            referencedRelation: "sponsorships"
            referencedColumns: ["id"]
          },
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
      unified_media_browser: {
        Row: {
          category: string | null
          created_at: string | null
          id: string | null
          metadata: Json | null
          source_table: string | null
          type: string | null
          url: string | null
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
      attribuer_enfant: {
        Args: {
          nom_enfant: string
          nom_parrain: string
        }
        Returns: undefined
      }
      attribuer_parrainage: {
        Args: {
          nom_enfant: string
          nom_parrain: string
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
      clean_old_login_attempts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      clean_old_performance_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
      create_sponsorship_request: {
        Args: {
          p_child_id: string
          p_sponsor_data: Json
        }
        Returns: undefined
      }
      create_storage_bucket: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_table_if_not_exists: {
        Args: {
          table_name: string
          definition: string
        }
        Returns: undefined
      }
      enable_rls: {
        Args: {
          table_name: string
        }
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
      get_child_needs: {
        Args: {
          child_id: string
        }
        Returns: Json
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
      get_daily_donation_trends: {
        Args: Record<PropertyKey, never>
        Returns: {
          day: number
          donations: number
        }[]
      }
      get_dashboard_statistics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_default_privacy_settings: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_default_reminder_preferences: {
        Args: {
          p_sponsor_id: string
        }
        Returns: Json
      }
      get_distinct_cities: {
        Args: Record<PropertyKey, never>
        Returns: {
          city: string
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
      get_featured_photos: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          url: string
          title: string
          child_name: string
          sponsor_name: string
          created_at: string
        }[]
      }
      get_filtered_children: {
        Args: {
          status_filter?: string
          has_needs?: boolean
          has_urgent_needs?: boolean
          gender_filter?: string
          min_age?: number
          max_age?: number
          name_search?: string
        }
        Returns: {
          age: number | null
          birth_date: string
          city: string | null
          comments: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          gender: string
          id: string
          is_sponsored: boolean | null
          location_id: number | null
          name: string
          needs: Json | null
          photo_url: string | null
          sponsor_email: string | null
          sponsor_id: string | null
          sponsor_name: string | null
          start_date: string | null
          status: string
          story: string | null
          updated_at: string | null
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
      process_scheduled_notifications: {
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
    }
    Enums: {
      user_role:
        | "admin"
        | "assistant"
        | "sponsor"
        | "visitor"
        | "future_sponsor"
    }
    CompositeTypes: {
      email_template: {
        subject: string | null
        html: string | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
