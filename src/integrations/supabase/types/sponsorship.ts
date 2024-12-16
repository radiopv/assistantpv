export interface SponsorshipWithDetails {
  id: string;
  sponsor: {
    id: string;
    name: string;
    email: string;
    photo_url: string | null;
  };
  child: {
    id: string;
    name: string;
    photo_url: string | null;
    age: number;
  };
}

export interface GroupedSponsorship {
  sponsor: {
    id: string;
    name: string;
    email: string;
    photo_url: string | null;
  };
  sponsorships: Array<{
    id: string;
    child: {
      id: string;
      name: string;
      photo_url: string | null;
      age: number;
    };
  }>;
}

export interface ChildWithSponsorDetails {
  id: string;
  name: string;
  age: number;
  photo_url: string | null;
  is_sponsored: boolean;
  sponsor: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface SponsorshipRequest {
  id: string;
  sponsor_id: string;
  child_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  motivation?: string;
  is_long_term: boolean;
  facebook_url?: string;
}