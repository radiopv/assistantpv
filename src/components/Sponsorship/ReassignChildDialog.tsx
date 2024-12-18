import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ReassignChildDialogProps {
  open: boolean;
  onClose: () => void;
  child: any;
  currentSponsorId: string;
  onReassign: (newSponsorId: string) => void;
}

export const ReassignChildDialog = ({
  open,
  onClose,
  child,
  currentSponsorId,
  onReassign
}: ReassignChildDialogProps) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: sponsors = [] } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .neq('id', currentSponsorId);

      if (error) throw error;
      return data;
    }
  });

  const filteredSponsors = sponsors.filter(sponsor => 
    sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sponsor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t("sponsorship.reassignChild")}
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchSponsor")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <ScrollArea className="h-[400px]">
          <div className="grid gap-4 p-4">
            {filteredSponsors.map((sponsor) => (
              <Card key={sponsor.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={sponsor.photo_url || ""} />
                      <AvatarFallback>{sponsor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{sponsor.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {sponsor.email}
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => onReassign(sponsor.id)}>
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