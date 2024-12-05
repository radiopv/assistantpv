import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { HomeModule } from "@/types/homepage-modules";
import { ImageUpload } from "@/components/ImageUpload";

interface ModuleEditorProps {
  module: HomeModule;
  onClose: () => void;
  onSave: (module: HomeModule) => void;
}

export const ModuleEditor = ({ module, onClose, onSave }: ModuleEditorProps) => {
  const [editedModule, setEditedModule] = useState<HomeModule>(module);

  const handleContentChange = (key: string, value: string) => {
    setEditedModule(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value
      }
    }));
  };

  const handleSettingsChange = (key: string, value: any) => {
    setEditedModule(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value
      }
    }));
  };

  const handleImageUpload = (url: string) => {
    handleContentChange('imageUrl', url);
  };

  const renderFields = () => {
    switch (editedModule.module_type) {
      case 'hero':
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label>Titre</Label>
                <Input
                  value={editedModule.content.title || ''}
                  onChange={(e) => handleContentChange('title', e.target.value)}
                />
              </div>
              <div>
                <Label>Sous-titre</Label>
                <Input
                  value={editedModule.content.subtitle || ''}
                  onChange={(e) => handleContentChange('subtitle', e.target.value)}
                />
              </div>
              <div>
                <Label>Texte du bouton</Label>
                <Input
                  value={editedModule.content.ctaText || ''}
                  onChange={(e) => handleContentChange('ctaText', e.target.value)}
                />
              </div>
              <div>
                <Label>Lien du bouton</Label>
                <Input
                  value={editedModule.content.ctaLink || ''}
                  onChange={(e) => handleContentChange('ctaLink', e.target.value)}
                />
              </div>
              <div>
                <Label>Image</Label>
                <ImageUpload
                  currentImageUrl={editedModule.content.imageUrl}
                  onUploadComplete={handleImageUpload}
                  bucketName="homepage-media"
                />
              </div>
            </div>
          </>
        );

      case 'mission':
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label>Titre</Label>
                <Input
                  value={editedModule.content.title || ''}
                  onChange={(e) => handleContentChange('title', e.target.value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editedModule.content.description || ''}
                  onChange={(e) => handleContentChange('description', e.target.value)}
                />
              </div>
              <div>
                <Label>Image</Label>
                <ImageUpload
                  currentImageUrl={editedModule.content.imageUrl}
                  onUploadComplete={handleImageUpload}
                  bucketName="homepage-media"
                />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Modifier le module {module.name}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {renderFields()}
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={() => onSave(editedModule)}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};