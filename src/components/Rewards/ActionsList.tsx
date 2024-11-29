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

interface Action {
  title: string;
  description: string;
  points: number;
  icon: React.ReactNode;
  link: string;
}

const actions: Action[] = [
  {
    title: "Compléter votre profil",
    description: "Ajoutez une photo et complétez vos informations",
    points: 10,
    icon: <UserCircle className="w-5 h-5" />,
    link: "/settings"
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
    link: "/album/upload"
  },
  {
    title: "Faire un don",
    description: "Soutenez un projet spécial",
    points: 30,
    icon: <Heart className="w-5 h-5" />,
    link: "/donations"
  },
  {
    title: "Parrainer un autre enfant",
    description: "Étendez votre impact",
    points: 50,
    icon: <Users className="w-5 h-5" />,
    link: "/children"
  },
  {
    title: "Partager sur les réseaux",
    description: "Invitez d'autres à rejoindre l'aventure",
    points: 25,
    icon: <Share2 className="w-5 h-5" />,
    link: "/share"
  }
];

export const ActionsList = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(action.link)}
                  >
                    Commencer
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};