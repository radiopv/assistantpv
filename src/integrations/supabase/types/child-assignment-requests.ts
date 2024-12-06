import { Database } from './database';

export interface ChildAssignmentRequest {
  id: string;
  created_at: string;
  name: string;
  requester_email: string;
  status: string;
}

export interface ChildAssignmentRequestsTable {
  Row: ChildAssignmentRequest;
  Insert: Omit<ChildAssignmentRequest, 'id' | 'created_at'>;
  Update: Partial<Omit<ChildAssignmentRequest, 'id' | 'created_at'>>;
}