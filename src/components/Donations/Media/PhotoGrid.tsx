interface PhotoGridProps {
  photos: any[];
}

export const PhotoGrid = ({ photos }: PhotoGridProps) => {
  if (!photos || photos.length === 0) return null;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group aspect-square">
          <img
            src={photo.url}
            alt="Donation"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
};