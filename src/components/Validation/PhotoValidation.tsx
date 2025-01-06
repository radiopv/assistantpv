import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const PhotoValidation = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: photos, isLoading } = useQuery({
    queryKey: ["pending-photos"],
    queryFn: async () => {
      console.log("Fetching pending photos");
      const { data, error } = await supabase
        .from("album_media")
        .select("*")
        .eq("is_approved", false);

      if (error) {
        console.error("Error fetching photos:", error);
        throw error;
      }

      console.log("Fetched photos:", data);
      return data;
    },
  });

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("album_media")
        .update({ is_approved: true })
        .eq("id", id);

      if (error) {
        console.error("Error approving photo:", error);
        toast.error(t("errorApprovingPhoto"));
        return;
      }

      toast.success(t("photoApproved"));
      queryClient.invalidateQueries({ queryKey: ["pending-photos"] });
    } catch (error) {
      console.error("Error in handleApprove:", error);
      toast.error(t("errorApprovingPhoto"));
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("album_media")
        .update({ 
          is_approved: false,
          is_featured: false 
        })
        .eq("id", id);

      if (error) {
        console.error("Error rejecting photo:", error);
        toast.error(t("errorRejectingPhoto"));
        return;
      }

      toast.success(t("photoRejected"));
      queryClient.invalidateQueries({ queryKey: ["pending-photos"] });
    } catch (error) {
      console.error("Error in handleReject:", error);
      toast.error(t("errorRejectingPhoto"));
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">{t("loading")}</div>;
  }

  if (!photos?.length) {
    return <div className="text-center p-4">{t("noPhotosToValidate")}</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("photo")}</TableHead>
            <TableHead>{t("childName")}</TableHead>
            <TableHead>{t("uploadDate")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {photos.map((photo) => (
            <TableRow key={photo.id}>
              <TableCell>
                <img
                  src={photo.url}
                  alt=""
                  className="w-20 h-20 object-cover rounded"
                />
              </TableCell>
              <TableCell>{photo.title}</TableCell>
              <TableCell>
                {new Date(photo.created_at || "").toLocaleDateString()}
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleApprove(photo.id)}
                >
                  {t("approve")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleReject(photo.id)}
                >
                  {t("reject")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};