export interface AlbumMediaTable {
  Row: {
    id: string;
    child_id: string | null;
    url: string;
    type: string;
    title: string | null;
    description: string | null;
    is_public: boolean | null;
    is_approved: boolean | null;
    is_featured: boolean | null;
    featured_until: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: Omit<AlbumMediaTable["Row"], "id" | "created_at" | "updated_at"> & {
    id?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: Partial<AlbumMediaTable["Row"]>;
  Relationships: [
    {
      foreignKeyName: "album_media_child_id_fkey";
      columns: ["child_id"];
      isOneToOne: false;
      referencedRelation: "children";
      referencedColumns: ["id"];
    }
  ];
}

export type AlbumMedia = AlbumMediaTable["Row"];