import { 
  Home, 
  Users, 
  Gift, 
  MessageSquare,
  AlertTriangle,
  Camera,
  FileText,
  Newspaper
} from "lucide-react";

export const assistantLinks = [
  { to: "/dashboard", icon: Home, label: "Tableau de bord" },
  { to: "/children", icon: Users, label: "Enfants" },
  { to: "/children/add", icon: Users, label: "Ajouter un enfant" },
  { to: "/donations", icon: Gift, label: "Dons" },
  { to: "/messages", icon: MessageSquare, label: "Messages" },
  { to: "/urgent-needs", icon: AlertTriangle, label: "Besoins urgents" },
  { to: "/media-management", icon: Camera, label: "Gestion médias" },
  { to: "/reports", icon: FileText, label: "Rapports" },
  { to: "/news", icon: Newspaper, label: "Actualités" }
];