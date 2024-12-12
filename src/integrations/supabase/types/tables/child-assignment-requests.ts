import { Database } from '../database';

export interface ChildAssignmentRequest {
  id: string;
  child_id: string;
  requester_email: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export type ChildAssignmentRequestTable = Database['public']['Tables']['child_assignment_requests'];