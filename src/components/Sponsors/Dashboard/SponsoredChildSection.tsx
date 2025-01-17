import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { convertJsonToNeeds } from "@/types/needs";
import { SponsoredChildCard } from "./SponsoredChildCard";
import { SponsorTestimonials } from "./SponsorTestimonials";

interface SponsoredChildSectionProps {
  sponsorship: any;
  userId: string;
}

export const SponsoredChildSection = ({ sponsorship, userId }: SponsoredChildSectionProps) => {
  return (
    <div className="space-y-6">
      <SponsoredChildCard child={sponsorship.children} />
      
      {/* Description and Story Section */}
      <Card className="p-4">
        <div className="space-y-4">
          {sponsorship.children.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{sponsorship.children.description}</p>
            </div>
          )}
          
          {sponsorship.children.story && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Histoire</h3>
              <p className="text-gray-600">{sponsorship.children.story}</p>
            </div>
          )}
        </div>
      </Card>
      
      {/* Needs Section */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Besoins de {sponsorship.children.name}</h3>
        <ScrollArea className="h-[200px] w-full">
          <div className="grid grid-cols-1 gap-3">
            {convertJsonToNeeds(sponsorship.children.needs).map((need, index) => (
              <div
                key={`${need.category}-${index}`}
                className={`p-3 rounded-lg ${
                  need.is_urgent
                    ? "bg-red-50 border border-red-200"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Badge
                      variant={need.is_urgent ? "destructive" : "secondary"}
                      className="mb-2"
                    >
                      {need.category}
                      {need.is_urgent && " (!)"} 
                    </Badge>
                    {need.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {need.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Testimonials Section */}
      <Card className="p-4">
        <SponsorTestimonials 
          sponsorId={userId} 
          childId={sponsorship.children.id} 
        />
      </Card>
    </div>
  );
};