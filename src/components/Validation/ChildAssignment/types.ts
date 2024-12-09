export interface EmailRequest {
  from: string
  to: string[]
  subject: string
  html: string
}

export interface ChildAssignmentRequest {
  id: string
  child_id: string
  requester_email: string
  name: string
  status: 'pending' | 'approved' | 'rejected'
  created_at?: string
  updated_at?: string
}