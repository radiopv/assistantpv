import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSponsorshipManagement } from "@/hooks/useSponsorshipManagement";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Plus, Search } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { SponsorshipCard } from "@/components/Sponsorship/SponsorshipCard";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const SponsorshipManagement = () => {
  const { t } = useLanguage();
  const {
    sponsorships,
    allChildren,
    isLoading,
    createSponsorship,
    deleteSponsorship,
  } = useSponsorshipManagement();

  const [selectedSponsor, setSelectedSponsor] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChildren = allChildren?.filter(child => 
    child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.sponsor?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{t("sponsorshipManagement.sponsorsList")}</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t("sponsorshipManagement.newSponsorship")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t("sponsorshipManagement.newSponsorship")}</DialogTitle>
                <DialogDescription>
                  {t("sponsorshipManagement.selectChild")}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 gap-4 p-4">
                  {allChildren?.filter(child => !child.is_sponsored).map((child) => (
                    <Card key={child.id} className="cursor-pointer hover:bg-accent p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={child.photo_url || ""} />
                          <AvatarFallback>{child.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">{child.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {child.age} {t("years")}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {sponsorships?.map((group) => (
            <SponsorshipCard
              key={group.sponsor.email}
              group={group}
              onAddChild={(sponsorId) => setSelectedSponsor(sponsorId)}
              onDeleteSponsorship={(sponsorshipId) => 
                deleteSponsorship.mutate(sponsorshipId)
              }
            />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{t("sponsorshipManagement.childrenList")}</h2>
          <div className="flex gap-4">
            <Input
              placeholder={t("sponsorshipManagement.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("age")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("currentSponsor")}</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChildren?.map((child) => (
                <TableRow key={child.id}>
                  <TableCell className="font-medium">{child.name}</TableCell>
                  <TableCell>{child.age} {t("years")}</TableCell>
                  <TableCell>
                    <Badge variant={child.is_sponsored ? "default" : "secondary"}>
                      {child.is_sponsored ? t("sponsorshipManagement.status.sponsored") : t("sponsorshipManagement.status.notSponsored")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {child.sponsor ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback>{child.sponsor.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{child.sponsor.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">{t("sponsorshipManagement.noSponsor")}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (child.is_sponsored) {
                          const sponsorship = sponsorships?.find(s => 
                            s.sponsorships.some(sp => sp.child.id === child.id)
                          );
                          if (sponsorship) {
                            const childSponsorship = sponsorship.sponsorships.find(s => s.child.id === child.id);
                            if (childSponsorship) {
                              deleteSponsorship.mutate(childSponsorship.id);
                            }
                          }
                        } else {
                          setSelectedSponsor(null);
                        }
                      }}
                    >
                      {child.is_sponsored ? t("sponsorshipManagement.actions.removeSponsor") : t("sponsorshipManagement.actions.addSponsor")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};

export default SponsorshipManagement;