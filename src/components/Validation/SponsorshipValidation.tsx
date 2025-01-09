import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { RequestsList } from "@/components/Sponsorship/RequestsList/RequestsList";
import { useAuth } from "@/components/Auth/AuthProvider";

export const SponsorshipValidation = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['sponsorships-pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsorship_requests')
        .select(`
          *,
          children (
            name,
            photo_url,
            age,
            city
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching requests:', error);
        throw error;
      }
      
      console.log('Fetched requests:', data);
      return data;
    }
  });

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sponsorship_requests')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['sponsorships-pending'] });

      toast({
        title: t("success"),
        description: t("sponsorshipRequestApproved"),
      });
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorApprovingRequest"),
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sponsorship_requests')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['sponsorships-pending'] });

      toast({
        title: t("success"),
        description: t("sponsorshipRequestRejected"),
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorRejectingRequest"),
      });
    }
  };

  if (isLoading) {
    return <p className="text-center">{t("loading")}</p>;
  }

  if (!requests?.length) {
    return <p className="text-center text-gray-500">{t("noRequestsPending")}</p>;
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg">{request.full_name}</h3>
              <p className="text-sm text-gray-600">{request.email}</p>
              <p className="text-sm text-gray-600">{request.city}</p>
              <p className="text-sm text-gray-600">
                {new Date(request.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleApprove(request.id)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                {t("approve")}
              </button>
              <button
                onClick={() => handleReject(request.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                {t("reject")}
              </button>
            </div>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">{t("childInformation")}</h4>
            <div className="flex items-center space-x-4">
              {request.children?.photo_url && (
                <img
                  src={request.children.photo_url}
                  alt={request.children.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium">{request.children?.name}</p>
                <p className="text-sm text-gray-600">
                  {t("age")}: {request.children?.age} {t("years")}
                </p>
                <p className="text-sm text-gray-600">
                  {t("city")}: {request.children?.city}
                </p>
              </div>
            </div>
          </div>
          {request.motivation && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">{t("motivation")}</h4>
              <p className="text-gray-700">{request.motivation}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};