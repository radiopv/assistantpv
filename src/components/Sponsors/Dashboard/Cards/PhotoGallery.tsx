interface PhotoGalleryProps {
  photos: any[];
  childName: string;
}

export const PhotoGallery = ({ photos, childName }: PhotoGalleryProps) => {
  if (!photos || photos.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="font-medium text-sm mb-3 text-cuba-warmGray">Photos de l'album</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className="aspect-square rounded-lg overflow-hidden"
            onClick={() => window.open(photo.url, '_blank')}
          >
            <img
              src={photo.url}
              alt={`Photo de ${childName}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};