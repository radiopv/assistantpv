import { Json } from './json';

export interface ChildAssignmentRequest {
  id: string;
  name: string;
  requester_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export interface ChildAssignmentRequestsTable {
  Row: ChildAssignmentRequest;
  Insert: Omit<ChildAssignmentRequest, 'id' | 'created_at'>;
  Update: Partial<Omit<ChildAssignmentRequest, 'id' | 'created_at'>>;
}