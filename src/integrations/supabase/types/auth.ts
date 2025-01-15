import { Json } from './json';

export interface AuthTables {
  profiles: {
    Row: {
      id: string
      role: string
      updated_at: string | null
      created_at: string | null
    }
    Insert: {
      id: string
      role?: string
      updated_at?: string | null
      created_at?: string | null
    }
    Update: {
      id?: string
      role?: string
      updated_at?: string | null
      created_at?: string | null
    }
    Relationships: []
  }
  login_attempts: {
    Row: {
      id: string
      email: string
      attempt_count: number | null
      last_attempt: string | null
      is_locked: boolean | null
      created_at: string | null
      updated_at: string | null
    }
    Insert: {
      id?: string
      email: string
      attempt_count?: number | null
      last_attempt?: string | null
      is_locked?: boolean | null
      created_at?: string | null
      updated_at?: string | null
    }
    Update: {
      id?: string
      email?: string
      attempt_count?: number | null
      last_attempt?: string | null
      is_locked?: boolean | null
      created_at?: string | null
      updated_at?: string | null
    }
    Relationships: []
  }
}