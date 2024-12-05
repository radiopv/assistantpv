import { useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { ChildrenTab } from "./Tabs/ChildrenTab";
import { MessagesTab } from "./Tabs/MessagesTab";
import { DocumentsTab } from "./Tabs/DocumentsTab";
import { useSponsoredChildren } from "@/hooks/useSponsoredChildren";

export const SponsorSpace = () => {
  const { user } = useAuth();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const { sponsoredChildren, loading } = useSponsoredChildren(user?.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Espace Parrain</h1>

      <Tabs defaultValue="children" className="w-full">
        <TabsList>
          <TabsTrigger value="children">Mes Filleuls ({sponsoredChildren.length})</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="children" className="mt-6">
          <ChildrenTab
            sponsoredChildren={sponsoredChildren}
            selectedChild={selectedChild}
            onSelectChild={setSelectedChild}
            userId={user?.id || ''}
          />
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <MessagesTab />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};