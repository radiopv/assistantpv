import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Share as ShareIcon,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface SocialShareProps {
  onShare?: () => void;
}

export const SocialShare = ({ onShare }: SocialShareProps) => {
  const { toast } = useToast();
  const shareUrl = window.location.origin;
  const shareTitle = "Passion Varadero - Parrainage d'enfants";
  const shareText = "Rejoignez-nous dans notre mission de parrainage d'enfants à Cuba ! Ensemble, nous pouvons faire la différence.";

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      });
      toast({
        title: "Partage réussi",
        description: "Merci d'avoir partagé notre mission !",
      });
      onShare?.();
    } catch (error) {
      console.error("Erreur de partage:", error);
    }
  };

  const shareToSocial = (platform: string) => {
    let url = '';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedTitle = encodeURIComponent(shareTitle);

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`;
        break;
    }

    if (url) {
      window.open(url, '_blank');
      toast({
        title: "Lien de partage ouvert",
        description: "Merci de partager notre mission !",
      });
      onShare?.();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <ShareIcon className="w-4 h-4 mr-2" />
          Partager
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager notre mission</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {navigator.share && (
            <Button onClick={handleNativeShare} className="w-full">
              <ShareIcon className="w-4 h-4 mr-2" />
              Partager
            </Button>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => shareToSocial('facebook')}>
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            <Button variant="outline" onClick={() => shareToSocial('twitter')}>
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button variant="outline" onClick={() => shareToSocial('linkedin')}>
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
            <Button variant="outline" onClick={() => shareToSocial('whatsapp')}>
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
          <Button variant="outline" onClick={() => shareToSocial('email')}>
            <Mail className="w-4 h-4 mr-2" />
            Envoyer par email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};