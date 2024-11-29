import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { NavigationLinks } from "./Navigation/NavigationLinks";
import { adminLinks } from "./Navigation/AdminLinks";
import { sponsorLinks } from "./Navigation/SponsorLinks";
import { assistantLinks } from "./Navigation/AssistantLinks";

const Sidebar = () => {
  const { signOut, user, isAssistant } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isSponsor = user?.role === 'sponsor';

  return (
    <div className="h-full px-3 py-4 flex flex-col bg-white border-r">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-bold">Passion Varadero</h1>
      </div>
      
      <div className="flex-1 space-y-6">
        {isAdmin && (
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Administration
            </p>
            <NavigationLinks links={adminLinks} />
          </div>
        )}
        
        {isSponsor && (
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Espace Parrain
            </p>
            <NavigationLinks links={sponsorLinks} />
          </div>
        )}
        
        {isAssistant && !isAdmin && (
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Espace Assistant
            </p>
            <NavigationLinks links={assistantLinks} />
          </div>
        )}
      </div>

      <div className="border-t pt-4 mt-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

export { Sidebar };