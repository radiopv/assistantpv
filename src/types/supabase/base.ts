import { Json } from "./json";

export interface Database {
  public: {
    Tables: {
      sponsorships: {
        Row: {
          id: string;
          child_id: string;
          sponsor_id: string;
          start_date: string;
          end_date: string | null;
          status: 'active' | 'pending' | 'ended';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          sponsor_id: string;
          start_date?: string;
          end_date?: string | null;
          status?: 'active' | 'pending' | 'ended';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          child_id?: string;
          sponsor_id?: string;
          start_date?: string;
          end_date?: string | null;
          status?: 'active' | 'pending' | 'ended';
          created_at?: string;
          updated_at?: string;
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
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          created_at?: string
        }
      }
      sponsorship_requests: {
        Row: {
          id: string
          full_name: string
          city: string
          phone: string
          email: string
          facebook_url: string
          motivation: string
          sponsorship_type: 'long_term' | 'one_time'
          terms_accepted: boolean
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          city: string
          phone: string
          email: string
          facebook_url: string
          motivation: string
          sponsorship_type: 'long_term' | 'one_time'
          terms_accepted: boolean
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          city?: string
          phone?: string
          email?: string
          facebook_url?: string
          motivation?: string
          sponsorship_type?: 'long_term' | 'one_time'
          terms_accepted?: boolean
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
    };
    Views: {
      unified_media_browser: {
        Row: {
          id: string;
          url: string;
          type: string;
          source_table: string;
          category: string;
          metadata: Json;
          created_at: string;
        };
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
      // ... keep existing code (function definitions)
    };
    Enums: {
      user_role: "admin" | "assistant" | "sponsor" | "visitor";
    };
  };
}
