-- Add is_approved column to album_media table
ALTER TABLE album_media 
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT NULL;