import { Json } from './json';

export interface Sponsorship {
  id: string;
  sponsor_id: string | null;
  child_id: string;
  status: 'pending' | 'active' | 'ended' | 'paused';
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  termination_date: string | null;
  termination_reason: string | null;
  termination_comment: string | null;
  is_temporary: boolean;
  end_planned_date: string | null;
}

export interface SponsoredChildCardProps {
  child: {
    id: string;
    name: string;
    photo_url: string | null;
    city: string | null;
    birth_date: string;
    description: string | null;
    story: string | null;
    needs: Json;
    age: number;
  };
  sponsorshipId?: string;
  onAddPhoto: () => void;
  onAddTestimonial: () => void;
}

export interface SponsorshipTables {
  sponsorships: {
    Row: Sponsorship;
    Insert: Omit<Sponsorship, 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<Sponsorship, 'id'>>;
  };
}