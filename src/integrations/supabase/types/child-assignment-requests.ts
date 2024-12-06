import { Database } from './database';

export type ChildAssignmentRequest = Database['public']['Tables']['child_assignment_requests']['Row'];
export type ChildAssignmentRequestInsert = Database['public']['Tables']['child_assignment_requests']['Insert'];
export type ChildAssignmentRequestUpdate = Database['public']['Tables']['child_assignment_requests']['Update'];