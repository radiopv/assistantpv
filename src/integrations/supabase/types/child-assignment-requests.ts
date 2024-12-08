import { Json } from './json';

export interface ChildAssignmentRequest {
  id: string;
  child_id: string;
  requester_email: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export interface ChildAssignmentRequestsTable {
  Row: ChildAssignmentRequest;
  Insert: Omit<ChildAssignmentRequest, 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<Omit<ChildAssignmentRequest, 'id' | 'created_at' | 'updated_at'>>;
}