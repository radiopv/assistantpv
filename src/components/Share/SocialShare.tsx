import { Button } from "@/components/ui/button";
import { Facebook, Twitter } from "lucide-react";

export const SocialShare = () => {
  return (
    <div className="flex gap-4">
      <Button variant="outline" className="flex items-center gap-2">
        <Facebook className="h-4 w-4" />
        Partager sur Facebook
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Twitter className="h-4 w-4" />
        Partager sur Twitter
      </Button>
    </div>
  );
};