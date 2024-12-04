import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EditSponsorDialog } from "./EditSponsorDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Pencil, 
  Album, 
  Mail, 
  Phone, 
  MapPin, 
  Star,
  Users,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

interface SponsorsListProps {
  sponsors: any[];
  isLoading: boolean;
}

export const SponsorsList = ({ sponsors, isLoading }: SponsorsListProps) => {
  const [editingSponsor, setEditingSponsor] = useState<any>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  const viewAlbum = (childId: string) => {
    navigate(`/children/${childId}/album`);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="active">{t("activeSponsors")}</TabsTrigger>
        <TabsTrigger value="inactive">{t("inactiveSponsors")}</TabsTrigger>
      </TabsList>

      <TabsContent value="active">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sponsors
            .filter(sponsor => sponsor.is_active)
            .map((sponsor) => (
              <Card key={sponsor.id} className="p-6 space-y-4">
                {/* Header Section */}
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={sponsor.photo_url} alt={sponsor.name} />
                      <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{sponsor.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="h-4 w-4" />
                        <span>{sponsor.total_points || 0} points</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingSponsor(sponsor)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  {sponsor.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{sponsor.email}</span>
                    </div>
                  )}
                  {sponsor.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{sponsor.phone}</span>
                    </div>
                  )}
                  {sponsor.city && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{sponsor.city}</span>
                    </div>
                  )}
                </div>

                {/* Sponsorships Section */}
                {sponsor.sponsorships?.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-medium">
                      <Users className="h-4 w-4" />
                      <span>{t("sponsoredChildren")}</span>
                    </div>
                    <div className="grid gap-2">
                      {sponsor.sponsorships.map((sponsorship: any) => (
                        sponsorship.child && (
                          <div key={sponsorship.child.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={sponsorship.child.photo_url} alt={sponsorship.child.name} />
                                <AvatarFallback>{sponsorship.child.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="text-sm">
                                <p className="font-medium">{sponsorship.child.name}</p>
                                <p className="text-xs text-gray-500">
                                  {t("since")} {format(new Date(sponsorship.start_date), 'PP', { locale: fr })}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewAlbum(sponsorship.child.id)}
                            >
                              <Album className="h-4 w-4 mr-1" />
                              {t("album")}
                            </Button>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary">
                    {sponsor.role || "sponsor"}
                  </Badge>
                  <Badge variant={sponsor.is_active ? "default" : "secondary"}>
                    {sponsor.is_active ? t("active") : t("inactive")}
                  </Badge>
                  {sponsor.is_anonymous && (
                    <Badge variant="outline">{t("anonymous")}</Badge>
                  )}
                </div>
              </Card>
            ))}
        </div>
      </TabsContent>

      <TabsContent value="inactive">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sponsors
            .filter(sponsor => !sponsor.is_active)
            .map((sponsor) => (
          <Card key={sponsor.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={sponsor.photo_url} alt={sponsor.name} />
                  <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{sponsor.name}</h3>
                  <p className="text-sm text-gray-600">{sponsor.email}</p>
                  <p className="text-sm text-gray-600">{sponsor.city}</p>
                  {sponsor.phone && (
                    <p className="text-sm text-gray-600">{sponsor.phone}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingSponsor(sponsor)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant={sponsor.is_active ? "default" : "secondary"}>
                  {sponsor.is_active ? "Actif" : "Inactif"}
                </Badge>
                <Badge variant="outline">{sponsor.role}</Badge>
                {sponsor.is_anonymous && (
                  <Badge variant="secondary">Anonyme</Badge>
                )}
              </div>
            </div>

            {sponsor.sponsorships?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium">Enfants parrainés:</p>
                <div className="mt-1">
                  {sponsor.sponsorships.map((sponsorship: any) => (
                    sponsorship.child && (
                      <span key={sponsorship.child.id} className="text-sm text-gray-600 block">
                        {sponsorship.child.name}
                      </span>
                    )
                  ))}
                </div>
              </div>
            )}
          </Card>
            ))}
        </div>
      </TabsContent>

      <EditSponsorDialog
        sponsor={editingSponsor}
        open={!!editingSponsor}
        onClose={() => setEditingSponsor(null)}
      />
    </Tabs>
  );
};
