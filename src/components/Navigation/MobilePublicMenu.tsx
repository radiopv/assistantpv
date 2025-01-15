import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { PublicMenuItems } from "./PublicMenuItems";

export const MobilePublicMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-cuba-warmBeige/10 transition-colors"
          >
            <Menu className="h-6 w-6 text-cuba-coral" />
            <span className="sr-only">Menu public</span>
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="w-[80%] sm:w-[385px] bg-white/95 backdrop-blur-sm border-cuba-coral/20"
        >
          <div className="flex flex-col h-full py-6">
            <PublicMenuItems onItemClick={() => setIsOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};