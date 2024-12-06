import { Database } from './database';

export interface ChildAssignmentRequest {
  id: string;
  name: string;
  requester_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export type ChildAssignmentRequestsDatabase = Database;