import { RequestStatus } from './request-status';

export interface ChildAssignmentRequest {
  id: string;
  child_id: string;
  requester_email: string;
  name: string;
  status: RequestStatus;
  created_at: string;
  updated_at?: string;
}

export interface ChildAssignmentRequestTable {
  Row: ChildAssignmentRequest;
  Insert: Omit<ChildAssignmentRequest, 'id' | 'created_at' | 'updated_at'> & {
    id?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: Partial<ChildAssignmentRequest>;
}