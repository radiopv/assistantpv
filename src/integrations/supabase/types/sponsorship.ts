export interface SponsorshipRequests {
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
}

export interface Sponsorships {
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
}