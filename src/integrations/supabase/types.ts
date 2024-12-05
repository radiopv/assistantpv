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
          end_date?: string | null
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
          id?: string
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

      donation_photos: {
        Row: {
          created_at: string
          donation_id: string | null
          id: number
          title: string | null
          url: string | null
          is_featured: boolean | null
        }
        Insert: {
          created_at?: string
          donation_id?: string | null
          id?: number
          title?: string | null
          url?: string | null
          is_featured?: boolean | null
        }
        Update: {
          created_at?: string
          donation_id?: string | null
          id?: number
          title?: string | null
          url?: string | null
          is_featured?: boolean | null
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
        Relationships: [
          {
            foreignKeyName: "email_queue_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          content: string
          created_at: string | null
          days_after_start: number | null
          id: string
          name: string
          subject: string
          template_type: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          days_after_start?: number | null
          id?: string
          name: string
          subject: string
          template_type?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          days_after_start?: number | null
          id?: string
          name?: string
          subject?: string
          template_type?: string | null
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
          updated_at: string | null
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
          layout_position: string | null
          position: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_mobile?: boolean | null
          layout_position?: string | null
          position: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_mobile?: boolean | null
          layout_position?: string | null
          position?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      homepage_config: {
        Row: {
          button_link: string | null
          button_text: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_visible: boolean | null
          section_name: string
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_visible?: boolean | null
          section_name: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_visible?: boolean | null
          section_name?: string
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
          last_checked: string | null
          page_url: string
          redirect_url: string | null
          status: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          last_checked?: string | null
          page_url: string
          redirect_url?: string | null
          status: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          last_checked?: string | null
          page_url?: string
          redirect_url?: string | null
          status: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
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
          latitude: number
          longitude: number
          sponsored_count?: number | null
          updated_at?: string | null
        }
        Update: {
          child_count?: number | null
          city_name?: string
          created_at?: string | null
          id?: number
          latitude?: number
          longitude?: number
          sponsored_count?: number | null
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
      memories: {
        Row: {
          child_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          is_private: boolean | null
          type: string
          updated_at: string | null
          url: string
        }
        Insert: {
          child_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          type: string
          updated_at?: string | null
          url: string
        }
        Update: {
          child_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          type: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "memories_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      message_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          message_id: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          message_id?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          message_id?: string | null
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          category: string
          content: string
          created_at: string | null
          created_by: string | null
          created_by_role: string
          id: string
          is_global: boolean | null
          name: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          created_by?: string | null
          created_by_role: string
          id?: string
          is_global?: boolean | null
          name: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          created_by_role?: string
          id?: string
          is_global?: boolean | null
          name?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
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
          },
        ]
      }
      messages_recipients: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message_id: string | null
          recipient_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_id?: string | null
          recipient_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_id?: string | null
          recipient_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipients_recipient_id_fkey"
            columns: ["recipient_id"]
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
          name: string
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
          title: string
          type: string
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
      page_config: {
        Row: {
          created_at: string | null
          id: string
          is_visible: boolean | null
          page_id: string
          required_role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          page_id: string
          required_role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          page_id?: string
          required_role?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      profiles: {
        Row: {
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
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
          updated_at?: string
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
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string | null
          role: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_tasks: {
        Row: {
          attempts: number | null
          created_at: string | null
          data: Json | null
          execute_at: string
          id: string
          last_attempt: string | null
          status: string | null
          task_type: string
          updated_at: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          data?: Json | null
          execute_at: string
          id: string
          last_attempt?: string | null
          status?: string
          task_type: string
          updated_at?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          data?: Json | null
          execute_at?: string
          id: string
          last_attempt?: string | null
          status?: string | null
          task_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      scheduled_visits: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          reminder_days_before: number | null
          reminder_sent: boolean | null
          sponsorship_id: string | null
          status: string | null
          updated_at: string | null
          visit_date: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          reminder_days_before?: number | null
          reminder_sent?: boolean | null
          sponsorship_id?: string | null
          status?: string | null
          updated_at?: string
          visit_date: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          reminder_days_before?: number | null
          reminder_sent?: boolean | null
          sponsorship_id?: string | null
          status?: string | null
          updated_at?: string
          visit_date?: string
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
          id: string
          logo_url: string | null
          primary_color: string
          secondary_color: string
          site_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          site_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          site_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sponsor_levels: {
        Row: {
          benefits: Json | null
          created_at: string | null
          description: string | null
          id: string
          min_points: number
          name: string
          updated_at: string | null
        }
        Insert: {
          benefits?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          min_points: number
          name: string
          updated_at?: string | null
        }
        Update: {
          benefits?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          min_points?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sponsor_memories: {
        Row: {
          child_id: string | null
          created_at: string | null
          description: string | null
          id: string
          type: string
          updated_at: string | null
          url: string
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          type: string
          updated_at?: string | null
          url: string
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          type: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_child"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsor_memories_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
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
          },
        ]
      }
      sponsorship_audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          performed_by: string | null
          sponsorship_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          performed_by?: string | null
          sponsorship_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          performed_by?: string | null
          sponsorship_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsorship_audit_logs_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsorship_audit_logs_sponsorship_id_fkey"
            columns: ["sponsorship_id"]
            isOneToOne: false
            referencedRelation: "sponsorships"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsorship_notes: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          note_type: string | null
          sponsorship_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          note_type?: string | null
          sponsorship_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          note_type?: string | null
          sponsorship_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsorship_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsorship_notes_sponsorship_id_fkey"
            columns: ["sponsorship_id"]
            isOneToOne: false
            referencedRelation: "sponsorships"
            referencedColumns: ["id"]
          },
        ]
      }

      sponsorship_requests: {
        Row: {
          child_id: string | null
          created_at: string | null
          email: string
          facebook_url: string | null
          full_name: string
          id: string
          motivation: string | null
          phone: string | null
          status: string
          terms_accepted: boolean
          updated_at: string | null
          city: string | null
          is_long_term: boolean | null
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          email: string
          facebook_url?: string | null
          full_name: string
          id?: string
          motivation?: string | null
          phone?: string | null
          status: string
          terms_accepted?: boolean
          updated_at?: string | null
          city?: string | null
          is_long_term?: boolean | null
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          email?: string
          facebook_url?: string | null
          full_name?: string
          id?: string
          motivation?: string | null
          phone?: string | null
          status?: string
          terms_accepted?: boolean
          updated_at?: string | null
          city?: string | null
          is_long_term?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsorship_requests_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
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
          start_date: string
          status: string
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
      statistics_config: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_visible: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id: string
          is_visible?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_visible?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          child_id: string | null
          content: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
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
          rating?: number | null
          sponsor_id?: string | null
          updated_at?: string
        }
        Update: {
          child_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          rating?: number | null
          sponsor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      unified_media_browser: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          source_table: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string | null
          type: string
          updated_at: string | null
          url: string
          version: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          source_table: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          type: string
          updated_at?: string | null
          url: string
          version?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          source_table?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          url?: string
          version?: number | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          badge_id: string | null
          created_at: string | null
          earned_at: string | null
          id: string
          metadata: Json | null
          points: number | null
          sponsor_id: string | null
          updated_at: string | null
        }
        Insert: {
          badge_id?: string | null
          created_at?: string | null
          earned_at?: string | null
          id?: string
          metadata: Json | null
          points?: number | null
          sponsor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          badge_id?: string | null
          created_at?: string | null
          earned_at?: string | null
          id?: string
          metadata: Json | null
          points?: number | null
          sponsor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          details: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          details?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          details?: Json | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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

