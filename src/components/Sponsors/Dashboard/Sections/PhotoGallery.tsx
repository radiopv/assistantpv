import { ScrollArea } from "@/components/ui/scroll-area";

interface PhotoGalleryProps {
  photos: any[];
  childName: string;
}

export const PhotoGallery = ({ photos, childName }: PhotoGalleryProps) => {
  return (
    <ScrollArea className="h-[200px]">
      <div className="grid grid-cols-3 gap-2">
        {photos.slice(0, 6).map((photo) => (
          <div 
            key={photo.id} 
            className="aspect-square relative overflow-hidden rounded-lg"
          >
            <img
              src={photo.url}
              alt={`Photo de ${childName}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};