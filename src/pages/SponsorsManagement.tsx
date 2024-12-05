import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvailableChildrenList } from "@/components/Sponsorship/AvailableChildrenList";
import { SponsoredChildrenList } from "@/components/Sponsorship/SponsoredChildrenList";
import { RequestsList } from "@/components/Sponsorship/RequestsList/RequestsList";
import { useSponsorship } from "@/hooks/useSponsorship";

const SponsorsManagement = () => {
  const {
    sponsoredChildren,
    availableChildren,
    pendingRequests,
    isLoading,
    handleApprove,
    handleReject
  } = useSponsorship();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Parrainages</h1>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">
            Demandes en attente ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Enfants Disponibles ({availableChildren.length})
          </TabsTrigger>
          <TabsTrigger value="sponsored">
            Enfants Parrainés ({sponsoredChildren.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-6">
          <RequestsList
            requests={pendingRequests}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TabsContent>

        <TabsContent value="available" className="mt-6">
          <Card className="p-4">
            <AvailableChildrenList children={availableChildren} />
          </Card>
        </TabsContent>

        <TabsContent value="sponsored" className="mt-6">
          <Card className="p-4">
            <SponsoredChildrenList children={sponsoredChildren} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SponsorsManagement;