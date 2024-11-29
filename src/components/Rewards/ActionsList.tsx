import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  UserCircle, 
  MessageSquare, 
  Camera, 
  Heart, 
  Users,
  Share2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { SocialShare } from "@/components/Share/SocialShare";

interface Action {
  title: string;
  description: string;
  points: number;
  icon: React.ReactNode;
  link: string;
  isExternal?: boolean;
  onClick?: () => void;
  customButton?: React.ReactNode;
}

export const ActionsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleShareComplete = () => {
    toast({
      title: "Partage réussi",
      description: "Merci d'avoir partagé ! Vous avez gagné 25 points.",
    });
  };

  const actions: Action[] = [
    {
      title: "Compléter votre profil",
      description: "Ajoutez une photo et complétez vos informations",
      points: 10,
      icon: <UserCircle className="w-5 h-5" />,
      link: "/settings/profile"
    },
    {
      title: "Ajouter un témoignage",
      description: "Partagez votre expérience de parrainage",
      points: 20,
      icon: <MessageSquare className="w-5 h-5" />,
      link: "/testimonials/new"
    },
    {
      title: "Partager une photo",
      description: "Téléchargez une photo de votre filleul",
      points: 15,
      icon: <Camera className="w-5 h-5" />,
      link: "/sponsor-dashboard/photos"
    },
    {
      title: "Faire un don",
      description: "Soutenez un projet spécial",
      points: 30,
      icon: <Heart className="w-5 h-5" />,
      link: "/donations/new"
    },
    {
      title: "Parrainer un autre enfant",
      description: "Étendez votre impact",
      points: 50,
      icon: <Users className="w-5 h-5" />,
      link: "/children/available"
    },
    {
      title: "Partager sur les réseaux",
      description: "Invitez d'autres à rejoindre l'aventure",
      points: 25,
      icon: <Share2 className="w-5 h-5" />,
      link: "#",
      customButton: <SocialShare onShare={handleShareComplete} />
    }
  ];

  const handleActionClick = (action: Action) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.isExternal) {
      window.open(action.link, '_blank');
    } else if (action.link !== "#") {
      navigate(action.link);
      toast({
        title: "Action disponible",
        description: `Cette action vous rapportera ${action.points} points une fois complétée.`,
      });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold">Comment gagner des points ?</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                {action.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{action.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-medium text-primary">
                    +{action.points} points
                  </span>
                  {action.customButton || (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleActionClick(action)}
                    >
                      Commencer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};