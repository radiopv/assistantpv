import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SponsorsList } from "@/components/Sponsors/SponsorsList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Download, Upload, Filter, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/components/Auth/AuthProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SponsorsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: sponsors, isLoading: sponsorsLoading } = useQuery({
    queryKey: ["sponsors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsors")
        .select(`
          *,
          sponsorships (
            id,
            start_date,
            child:children (
              id,
              name,
              photo_url
            )
          )
        `)
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const { data: requests, isLoading: requestsLoading, refetch: refetchRequests } = useQuery({
    queryKey: ["sponsorship-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sponsorship_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleApproveRequest = async (requestId: string) => {
    try {
      const { error } = await supabase.rpc('approve_sponsorship_request', {
        request_id: requestId,
        admin_id: user?.id
      });

      if (error) throw error;

      toast({
        title: t("success"),
        description: t("requestApproved"),
      });

      refetchRequests();
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: error.message || t("errorApprovingRequest"),
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase.rpc('reject_sponsorship_request', {
        request_id: requestId,
        admin_id: user?.id
      });

      if (error) throw error;

      toast({
        title: t("success"),
        description: t("requestRejected"),
      });

      refetchRequests();
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: error.message || t("errorRejectingRequest"),
      });
    }
  };

  const filteredSponsors = sponsors?.filter(sponsor =>
    sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sponsor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sponsor.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Tabs defaultValue="sponsors" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sponsors">{t("sponsors")}</TabsTrigger>
          <TabsTrigger value="requests">{t("sponsorshipRequests")}</TabsTrigger>
        </TabsList>

        <TabsContent value="sponsors" className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold">{t("sponsorManagement")}</h1>
            
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 md:flex-none md:min-w-[300px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder={t("searchSponsor")}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {t("export")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => console.log("Export")}>
                    <Download className="h-4 w-4 mr-2" />
                    {t("exportToCsv")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("Import")}>
                    <Upload className="h-4 w-4 mr-2" />
                    {t("importFromCsv")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <SponsorsList sponsors={filteredSponsors || []} isLoading={sponsorsLoading} />
        </TabsContent>

        <TabsContent value="requests">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("email")}</TableHead>
                  <TableHead>{t("city")}</TableHead>
                  <TableHead>{t("phone")}</TableHead>
                  <TableHead>{t("sponsorshipType")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requestsLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      {t("loading")}
                    </TableCell>
                  </TableRow>
                ) : requests?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      {t("noRequests")}
                    </TableCell>
                  </TableRow>
                ) : (
                  requests?.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.full_name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.city}</TableCell>
                      <TableCell>{request.phone || "-"}</TableCell>
                      <TableCell>
                        {request.is_long_term ? t("longTerm") : t("oneTime")}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApproveRequest(request.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SponsorsManagement;