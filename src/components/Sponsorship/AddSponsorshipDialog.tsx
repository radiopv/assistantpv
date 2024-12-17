import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Children } from "@/integrations/supabase/types/children";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddSponsorshipDialogProps {
  open: boolean;
  onClose: () => void;
  availableChildren: Children['Row'][];
  onAdd: (childId: string) => void;
}

export const AddSponsorshipDialog = ({
  open,
  onClose,
  availableChildren,
  onAdd,
}: AddSponsorshipDialogProps) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChildren = availableChildren.filter(child => 
    child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectChild = (childId: string, isSponsored: boolean) => {
    if (isSponsored) {
      // Show confirmation dialog before reassigning
      if (window.confirm(t("sponsorship.confirmReassign"))) {
        onAdd(childId);
      }
    } else {
      onAdd(childId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("sponsorship.createSponsorship")}</DialogTitle>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t("sponsorship.reassignmentInfo")}
          </AlertDescription>
        </Alert>

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
                      {child.age} ans
                    </p>
                    {child.city && (
                      <p className="text-sm text-muted-foreground">{child.city}</p>
                    )}
                    <Badge 
                      variant={child.is_sponsored ? "secondary" : "default"}
                      className="mt-2"
                    >
                      {child.is_sponsored ? t("sponsored") : t("available")}
                    </Badge>
                  </div>
                  <Button
                    variant={child.is_sponsored ? "destructive" : "default"}
                    onClick={() => handleSelectChild(child.id, child.is_sponsored)}
                  >
                    {child.is_sponsored ? t("reassign") : t("select")}
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