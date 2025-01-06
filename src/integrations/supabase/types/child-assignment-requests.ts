export interface ChildAssignmentRequest {
  id: string;
  name: string;
  requester_email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  child_id?: string;
  sponsor_id?: string;
  notes?: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      child_assignment_requests: {
        Row: ChildAssignmentRequest;
        Insert: Omit<ChildAssignmentRequest, 'id' | 'created_at'>;
        Update: Partial<Omit<ChildAssignmentRequest, 'id' | 'created_at'>>;
      };
    };
  };
}