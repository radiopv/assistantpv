interface PhotoAlbumProps {
  photos: any[];
}

export const PhotoAlbum = ({ photos }: PhotoAlbumProps) => {
  if (!photos?.length) return null;

  return (
    <div className="bg-white/80 rounded-lg p-3">
      <h4 className="font-medium text-sm mb-2 text-cuba-warmGray">Album photo de l'enfant</h4>
      <div className="grid grid-cols-3 gap-2">
        {photos.slice(0, 3).map((photo: any) => (
          <div key={photo.id} className="aspect-square rounded-md overflow-hidden">
            <img
              src={photo.url}
              alt="Photo album"
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};