import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PublicMediaToggleProps {
  mediaId: string;
  isPublic: boolean;
  onToggle: () => void;
}

export const PublicMediaToggle = ({ mediaId, isPublic, onToggle }: PublicMediaToggleProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async () => {
    try {
      setIsPending(true);
      const { error } = await supabase
        .from('album_media')
        .update({ is_public: !isPublic })
        .eq('id', mediaId);

      if (error) throw error;

      toast.success(isPublic ? "Media set to private" : "Media set to public, waiting for approval");
      onToggle();
    } catch (error) {
      toast.error("Failed to update media visibility");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`public-toggle-${mediaId}`}
        checked={isPublic}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
      <Label htmlFor={`public-toggle-${mediaId}`}>
        {isPublic ? "Public" : "Private"}
      </Label>
    </div>
  );
};