import { Json } from "./json";

export interface ChildAssignmentRequest {
  id: string;
  child_id: string;
  requester_email: string;
  name: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChildAssignmentRequestRow {
  id: string;
  child_id: string;
  requester_email: string;
  name: string;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}