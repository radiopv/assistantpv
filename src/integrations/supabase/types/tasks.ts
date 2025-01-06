export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'profile_verification' | 'missing_photos' | 'other';
  status: 'pending' | 'completed';
  child_id?: string;
  donation_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Tasks {
  Row: Task;
  Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>;
  Update: Partial<Omit<Task, 'id'>>;
  Relationships: [
    {
      foreignKeyName: "tasks_child_id_fkey"
      columns: ["child_id"]
      isOneToOne: false
      referencedRelation: "children"
      referencedColumns: ["id"]
    }
  ]
}