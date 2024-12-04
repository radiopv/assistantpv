import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";

interface MediaCardProps {
  item: {
    id: string;
    url: string;
    type: string;
    title?: string;
    description?: string;
    thumbnail_url?: string;
  };
  onDelete: (item: any) => void;
  onEdit: (item: any) => void;
}

export const MediaCard = ({ item, onDelete, onEdit }: MediaCardProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
        {item.type === 'video' ? (
          <div className="relative w-full h-full">
            {item.thumbnail_url ? (
              <img 
                src={item.thumbnail_url} 
                alt={item.title || 'Video thumbnail'} 
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => window.open(item.url, '_blank')}
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center bg-gray-200 cursor-pointer"
                onClick={() => window.open(item.url, '_blank')}
              >
                <span className="text-gray-600">Voir la vidéo</span>
              </div>
            )}
          </div>
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
          onClick={() => onEdit(item)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(item)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};