import { useLanguage } from "@/contexts/LanguageContext";
import { RequestCard } from "./RequestCard";
import { useChildAssignment } from "./useChildAssignment";

export const ChildAssignmentValidation = () => {
  const { t } = useLanguage();
  const { requests, isLoading, handleApprove, handleReject } = useChildAssignment();

  if (isLoading) {
    return <p className="text-center">{t("loading")}</p>;
  }

  return (
    <div className="space-y-4">
      {requests?.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
      {!requests?.length && (
        <p className="text-center text-gray-500">
          {t("noChildRequestsPending")}
        </p>
      )}
    </div>
  );
};