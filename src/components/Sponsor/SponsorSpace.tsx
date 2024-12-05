import { useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Loader2 } from "lucide-react";
import { SponsoredChildrenList } from "./SponsoredChildrenList";
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
      <h1 className="text-2xl font-bold">Mes Filleuls ({sponsoredChildren.length})</h1>
      <div className="grid gap-6">
        <SponsoredChildrenList
          children={sponsoredChildren}
          selectedChild={selectedChild}
          onSelectChild={setSelectedChild}
        />
      </div>
    </div>
  );
};