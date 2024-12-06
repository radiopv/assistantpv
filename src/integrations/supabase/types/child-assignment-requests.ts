import { Database as DatabaseBase } from './database';

export interface ChildAssignmentRequest {
  id: string;
  name: string;
  requester_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export interface ChildAssignmentRequestsDatabase extends DatabaseBase {
  public: {
    Tables: {
      child_assignment_requests: {
        Row: ChildAssignmentRequest;
        Insert: Omit<ChildAssignmentRequest, 'id' | 'created_at'>;
        Update: Partial<Omit<ChildAssignmentRequest, 'id' | 'created_at'>>;
      };
    } & DatabaseBase['public']['Tables'];
  };
}