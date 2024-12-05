import { useLanguage } from "@/contexts/LanguageContext";
import type { ScheduledVisit } from "@/types/scheduled-visits";

interface ScheduledVisitsListProps {
  visits: ScheduledVisit[];
}

export const ScheduledVisitsList = ({ visits }: ScheduledVisitsListProps) => {
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t("scheduledVisits")}</h2>
      <div className="space-y-4">
        {visits?.map((visit) => (
          <div key={visit.id} className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">
                  {visit.sponsorships.sponsors.name}
                </p>
                <p className="text-sm text-gray-600">
                  {visit.sponsorships.sponsors.email}
                </p>
              </div>
              <div>
                <p>
                  {new Date(visit.visit_start_date || '').toLocaleDateString()} - {new Date(visit.visit_end_date || '').toLocaleDateString()}
                </p>
                {visit.wants_to_visit_child && (
                  <p className="text-sm text-blue-600">
                    {t("wantsToVisitChild")}
                  </p>
                )}
                {visit.wants_donation_pickup && (
                  <p className="text-sm text-green-600">
                    {t("wantsDonationPickup")}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};