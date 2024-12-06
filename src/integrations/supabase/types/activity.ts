import { type Json } from './json';

export type ActivityLogTables = {
  activity_logs: {
    Row: {
      id: string;
      created_at: string;
      user_id: string;
      action: string;
      details: Json;
    };
    Insert: {
      id?: string;
      created_at?: string;
      user_id: string;
      action: string;
      details: Json;
    };
    Update: {
      id?: string;
      created_at?: string;
      user_id?: string;
      action?: string;
      details?: Json;
    };
  };
};