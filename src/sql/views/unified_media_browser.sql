CREATE OR REPLACE VIEW public.unified_media_browser AS
SELECT 
    id::text,
    url,
    'image' as type,
    'donation_photos' as source_table,
    'Donations' as category,
    jsonb_build_object(
        'title', title,
        'is_featured', is_featured
    ) as metadata,
    created_at
FROM public.donation_photos

UNION ALL

SELECT 
    id::text,
    url,
    'video' as type,
    'donation_videos' as source_table,
    'Donations' as category,
    jsonb_build_object(
        'title', title,
        'description', description,
        'thumbnail_url', thumbnail_url
    ) as metadata,
    created_at
FROM public.donation_videos

UNION ALL

SELECT 
    id::text,
    url,
    type,
    'album_media' as source_table,
    'Album' as category,
    jsonb_build_object(
        'title', title,
        'description', description,
        'is_public', is_public
    ) as metadata,
    created_at
FROM public.album_media;