export interface SponsorshipWithDetails {
  id: string;
  sponsors: {
    id: string;
    name: string;
    email: string;
    photo_url: string | null;
  };
  children: {
    id: string;
    name: string;
    photo_url: string | null;
    age: number;
  };
}

export type GroupedSponsorship = {
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
};