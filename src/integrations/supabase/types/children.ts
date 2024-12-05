import { Json } from './common';

export interface Children {
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
}