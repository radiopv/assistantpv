export interface Tasks {
  Row: {
    id: string;
    title: string;
    description: string;
    type: 'profile_verification' | 'missing_photos' | 'other';
    status: 'pending' | 'completed';
    child_id?: string;
    donation_id?: string;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    id?: string;
    title: string;
    description: string;
    type: 'profile_verification' | 'missing_photos' | 'other';
    status?: 'pending' | 'completed';
    child_id?: string;
    donation_id?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    title?: string;
    description?: string;
    type?: 'profile_verification' | 'missing_photos' | 'other';
    status?: 'pending' | 'completed';
    child_id?: string;
    donation_id?: string;
    created_at?: string;
    updated_at?: string;
  };
}