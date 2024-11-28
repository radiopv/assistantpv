import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface MediaGridProps {
  media: any[];
  onDelete: (item: any) => void;
  category: string;
}

export const MediaGrid = ({ media, onDelete, category }: MediaGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {media?.map((item) => (
        <Card key={item.id} className="p-4 space-y-4">
          <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
            {item.type === 'video' ? (
              <video 
                src={item.url} 
                controls 
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={item.url} 
                alt={item.title || 'Media'} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className="space-y-2">
            {item.title && (
              <h3 className="font-medium">{item.title}</h3>
            )}
            {item.description && (
              <p className="text-sm text-gray-600">{item.description}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(item)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};