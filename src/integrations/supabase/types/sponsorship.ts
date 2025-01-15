import { Json } from './json';

export interface SponsorshipTables {
  sponsorships: {
    Row: {
      id: string
      sponsor_id: string | null
      child_id: string
      status: string
      start_date: string | null
      end_date: string | null
      created_at: string | null
      updated_at: string | null
      termination_date: string | null
      termination_reason: string | null
      termination_comment: string | null
      is_temporary: boolean | null
      end_planned_date: string | null
    }
    Insert: {
      id?: string
      sponsor_id?: string | null
      child_id: string
      status?: string
      start_date?: string | null
      end_date?: string | null
      created_at?: string | null
      updated_at?: string | null
      termination_date?: string | null
      termination_reason?: string | null
      termination_comment?: string | null
      is_temporary?: boolean | null
      end_planned_date?: string | null
    }
    Update: {
      id?: string
      sponsor_id?: string | null
      child_id?: string
      status?: string
      start_date?: string | null
      end_date?: string | null
      created_at?: string | null
      updated_at?: string | null
      termination_date?: string | null
      termination_reason?: string | null
      termination_comment?: string | null
      is_temporary?: boolean | null
      end_planned_date?: string | null
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
  sponsorship_notes: {
    Row: {
      id: string
      sponsorship_id: string | null
      content: string
      created_by: string | null
      created_at: string | null
      updated_at: string | null
      note_type: string | null
    }
    Insert: {
      id?: string
      sponsorship_id?: string | null
      content: string
      created_by?: string | null
      created_at?: string | null
      updated_at?: string | null
      note_type?: string | null
    }
    Update: {
      id?: string
      sponsorship_id?: string | null
      content?: string
      created_by?: string | null
      created_at?: string | null
      updated_at?: string | null
      note_type?: string | null
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
      }
    ]
  }
  sponsorship_history: {
    Row: {
      id: string
      sponsorship_id: string | null
      action: string
      created_at: string | null
      reason: string | null
      performed_by: string | null
    }
    Insert: {
      id?: string
      sponsorship_id?: string | null
      action: string
      created_at?: string | null
      reason?: string | null
      performed_by?: string | null
    }
    Update: {
      id?: string
      sponsorship_id?: string | null
      action?: string
      created_at?: string | null
      reason?: string | null
      performed_by?: string | null
    }
    Relationships: [
      {
        foreignKeyName: "sponsorship_history_performed_by_fkey"
        columns: ["performed_by"]
        isOneToOne: false
        referencedRelation: "sponsors"
        referencedColumns: ["id"]
      },
      {
        foreignKeyName: "sponsorship_history_sponsorship_id_fkey"
        columns: ["sponsorship_id"]
        isOneToOne: false
        referencedRelation: "sponsorships"
        referencedColumns: ["id"]
      }
    ]
  }
}