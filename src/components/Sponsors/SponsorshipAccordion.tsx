import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface SponsorshipAccordionProps {
  sponsor: any;
  onUpdate: () => void;
}

export const SponsorshipAccordion = ({ sponsor, onUpdate }: SponsorshipAccordionProps) => {
  const { t } = useLanguage();

  // Dédupliquer les enfants en utilisant un Set basé sur l'ID
  const uniqueChildren = sponsor.sponsorships?.reduce((acc: any[], sponsorship: any) => {
    if (sponsorship.children && !acc.some(item => item.children.id === sponsorship.children.id)) {
      acc.push(sponsorship);
    }
    return acc;
  }, []);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex items-center gap-4">
            <Avatar className="w-10 h-10">
              {sponsor.photo_url ? (
                <img src={sponsor.photo_url} alt={sponsor.name} className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {sponsor.name?.charAt(0)}
                </div>
              )}
            </Avatar>
            <div className="text-left">
              <div className="font-semibold">{sponsor.name}</div>
              <div className="text-sm text-gray-500">{sponsor.email}</div>
            </div>
            <div className="ml-4">
              <Badge variant={sponsor.is_active ? "default" : "secondary"}>
                {sponsor.is_active ? t("active") : t("inactive")}
              </Badge>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="mt-4 space-y-4">
            <h3 className="font-semibold">{t("sponsoredChildren")}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {uniqueChildren?.map((sponsorship: any) => (
                <div key={sponsorship.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {sponsorship.children?.photo_url && (
                      <img 
                        src={sponsorship.children.photo_url} 
                        alt={sponsorship.children.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium">{sponsorship.children?.name}</div>
                      <div className="text-sm text-gray-500">
                        {sponsorship.children?.age} {t("years")} - {sponsorship.children?.city}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t("startDate")}: {new Date(sponsorship.start_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};