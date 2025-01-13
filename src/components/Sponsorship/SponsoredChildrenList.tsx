import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/utils/dates";

interface SponsoredChildrenListProps {
  children: any[];
}

export const SponsoredChildrenList = ({ children }: SponsoredChildrenListProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {children.map((child) => (
        <Card key={child.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <div className="relative aspect-[4/3]">
            <img
              src={child.photo_url || "/placeholder.svg"}
              alt={child.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{child.name}</h3>
              <p className="text-sm text-gray-500">
                {t("sponsoredSince")}: {formatDate(child.sponsorship_date)}
              </p>
            </div>

            {child.description && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-600">{t("description")}:</h4>
                <ScrollArea className="h-20">
                  <p className="text-sm text-gray-600">{child.description}</p>
                </ScrollArea>
              </div>
            )}

            {child.story && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-600">{t("story")}:</h4>
                <ScrollArea className="h-20">
                  <p className="text-sm text-gray-600">{child.story}</p>
                </ScrollArea>
              </div>
            )}

            {Array.isArray(child.needs) && child.needs.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-600">{t("needs")}:</h4>
                <div className="flex flex-wrap gap-2">
                  {child.needs.map((need: any, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cuba-warmBeige text-cuba-deepOrange"
                    >
                      {need.category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {child.album_photos && child.album_photos.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-600">{t("photos")}:</h4>
                <div className="flex gap-2 overflow-x-auto">
                  {child.album_photos.map((photo: any) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt=""
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};