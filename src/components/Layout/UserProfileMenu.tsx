import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/Auth/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Languages } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProfileForm } from "@/components/Profile/ProfileForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export const UserProfileMenu = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    photo_url: "",
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

  const handleScanTranslations = async () => {
    setScanning(true);
    try {
      // Simulate scanning for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would implement the actual scanning logic
      // For now, we'll just show a toast
      toast.success(t("translationsFound").replace("{{count}}", "5"));
    } catch (error) {
      console.error('Error scanning translations:', error);
      toast.error(t("translationError"));
    } finally {
      setScanning(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">
        {t("welcome")}, {formData.name || t("user")}
      </span>
      
      {user.role === 'admin' && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleScanTranslations}
          disabled={scanning}
        >
          <Languages className="w-4 h-4 mr-2" />
          {scanning ? t("scanningTranslations") : t("scanAssistantSection")}
        </Button>
      )}
      
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

          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};