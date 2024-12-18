import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AddChildDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (childId: string) => void;
  sponsorId: string;
}

export const AddChildDialog = ({
  open,
  onClose,
  onAdd,
  sponsorId
}: AddChildDialogProps) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: availableChildren = [] } = useQuery({
    queryKey: ['available-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('is_sponsored', false);

      if (error) throw error;
      return data;
    }
  });

  const filteredChildren = availableChildren.filter(child => 
    child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("sponsorship.newSponsorship")}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchChild")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-2 gap-4 p-4">
            {filteredChildren.map((child) => (
              <Card key={child.id} className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={child.photo_url || ""} />
                    <AvatarFallback>{child.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{child.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {child.age} {t("years")}
                    </p>
                    {child.city && (
                      <p className="text-sm text-muted-foreground">{child.city}</p>
                    )}
                    <Badge variant="default" className="mt-2">
                      {t("available")}
                    </Badge>
                  </div>
                  <Button onClick={() => onAdd(child.id)}>
                    {t("select")}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};