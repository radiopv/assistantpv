export interface Database {
  public: {
    Tables: {
      sponsorships: {
        Row: {
          id: string
          child_id: string
          sponsor_id: string
          start_date: string
          end_date: string | null
          status: 'active' | 'pending' | 'ended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          child_id: string
          sponsor_id: string
          start_date?: string
          end_date?: string | null
          status?: 'active' | 'pending' | 'ended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          sponsor_id?: string
          start_date?: string
          end_date?: string | null
          status?: 'active' | 'pending' | 'ended'
          created_at?: string
          updated_at?: string
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
    }
    Views: {
      unified_media_browser: {
        Row: {
          id: string
          url: string
          type: string
          source_table: string
          category: string
          metadata: Json
          created_at: string
        }
      }
    }
  }
}
