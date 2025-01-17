import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, MessageSquare, LayoutDashboard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProfileForm } from "@/components/Profile/ProfileForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const UserProfileMenu = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    photo_url: "",
  });

  const { data: unreadMessages } = useQuery({
    queryKey: ['unread-messages'],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false);
        
        if (error) {
          console.warn('Messages table not accessible:', error.message);
          return 0;
        }
        
        return count || 0;
      } catch (error) {
        console.warn('Error fetching messages:', error);
        return 0;
      }
    },
    meta: {
      errorMessage: "Erreur lors du chargement des messages"
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
        photo_url: user.photo_url || "",
      });
    }
  }, [user]);

  const initials = formData.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  const handleOpenChange = (open: boolean) => {
    setIsProfileOpen(open);
  };

  const handleMessagesClick = () => {
    navigate('/messages');
    toast.info("Redirection vers les messages");
  };

  if (!user) {
    return null;
  }

  const isAssistant = user.role === 'assistant' || user.role === 'admin';
  const isSponsor = user.role === 'sponsor';

  return (
    <div className="flex items-center gap-4">
      {isSponsor && (
        <Button
          variant="ghost"
          className="text-primary"
          onClick={() => navigate("/sponsor-dashboard")}
        >
          Espace parrain
        </Button>
      )}
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={handleMessagesClick}
      >
        <MessageSquare className="h-5 w-5" />
        {unreadMessages && unreadMessages > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
          >
            {unreadMessages}
          </Badge>
        )}
      </Button>

      <span className="text-sm text-gray-600">
        {t("bonjour")}, {formData.name || t("utilisateur")}
      </span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={formData.photo_url} alt={formData.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{formData.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {formData.email}
              </p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          {isAssistant && (
            <DropdownMenuItem onSelect={() => navigate("/dashboard")}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Tableau de bord</span>
            </DropdownMenuItem>
          )}

          <Dialog open={isProfileOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <User className="mr-2 h-4 w-4" />
                <span>{t("editProfile")}</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t("editProfile")}</DialogTitle>
              </DialogHeader>
              <ProfileForm 
                initialData={formData}
                userId={user.id}
                onClose={() => setIsProfileOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
