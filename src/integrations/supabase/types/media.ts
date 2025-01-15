import { Json } from './json';

export interface MediaTables {
  album_media: {
    Row: {
      id: string
      child_id: string | null
      url: string
      type: string
      title: string | null
      description: string | null
      is_featured: boolean | null
      created_at: string | null
      updated_at: string | null
      is_public: boolean | null
      is_approved: boolean | null
      sponsor_id: string | null
      sponsorship_id: string | null
    }
    Insert: {
      id?: string
      child_id?: string | null
      url: string
      type?: string | null
      title?: string | null
      description?: string | null
      is_featured?: boolean | null
      created_at?: string | null
      updated_at?: string | null
      is_public?: boolean | null
      is_approved?: boolean | null
      sponsor_id?: string | null
      sponsorship_id?: string | null
    }
    Update: {
      id?: string
      child_id?: string | null
      url?: string
      type?: string | null
      title?: string | null
      description?: string | null
      is_featured?: boolean | null
      created_at?: string | null
      updated_at?: string | null
      is_public?: boolean | null
      is_approved?: boolean | null
      sponsor_id?: string | null
      sponsorship_id?: string | null
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
  media_items: {
    Row: {
      id: string
      url: string
      original_url: string | null
      thumbnail_url: string | null
      source_table: string
      source_id: string
      type: string
      metadata: Json | null
      version: number | null
      created_at: string | null
      updated_at: string | null
    }
    Insert: {
      id?: string
      url: string
      original_url?: string | null
      thumbnail_url?: string | null
      source_table: string
      source_id: string
      type: string
      metadata?: Json | null
      version?: number | null
      created_at?: string | null
      updated_at?: string | null
    }
    Update: {
      id?: string
      url?: string
      original_url?: string | null
      thumbnail_url?: string | null
      source_table?: string
      source_id?: string
      type?: string
      metadata?: Json | null
      version?: number | null
      created_at?: string | null
      updated_at?: string | null
    }
    Relationships: []
  }
}