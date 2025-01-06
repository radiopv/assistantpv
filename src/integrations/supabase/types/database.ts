import { ChildAssignmentRequestTable } from './tables/child-assignment-requests';
import { Database as GeneratedDatabase } from './types';

export interface Database extends GeneratedDatabase {
  public: {
    Tables: {
      child_assignment_requests: ChildAssignmentRequestTable;
    } & GeneratedDatabase['public']['Tables'];
    Views: GeneratedDatabase['public']['Views'];
    Functions: GeneratedDatabase['public']['Functions'];
    Enums: GeneratedDatabase['public']['Enums'];
    CompositeTypes: GeneratedDatabase['public']['CompositeTypes'];
  };
}