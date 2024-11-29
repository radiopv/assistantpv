import { 
  Home, 
  MessageSquare, 
  Award, 
  Heart,
  Star,
  Camera,
  Calendar,
  Share2
} from "lucide-react";

export const sponsorLinks = [
  { to: "/sponsor-dashboard", icon: Home, label: "Mon tableau de bord" },
  { to: "/messages", icon: MessageSquare, label: "Messages" },
  { to: "/rewards", icon: Award, label: "Récompenses" },
  { to: "/my-children", icon: Heart, label: "Mes enfants parrainés" },
  { to: "/my-testimonials", icon: Star, label: "Mes témoignages" },
  { to: "/my-memories", icon: Camera, label: "Mes souvenirs" },
  { to: "/my-calendar", icon: Calendar, label: "Mon calendrier" },
  { to: "/share", icon: Share2, label: "Partager" }
];