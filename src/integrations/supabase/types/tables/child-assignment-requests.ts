import { Database } from '../database';

export type ChildAssignmentRequestsTable = Database['public']['Tables']['child_assignment_requests'];
export type ChildAssignmentRequest = ChildAssignmentRequestsTable['Row'];