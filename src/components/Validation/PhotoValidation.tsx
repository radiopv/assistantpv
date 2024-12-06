import { useQuery } from "@tanstack/react-query";
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

  const { data: photos, refetch } = useQuery({
    queryKey: ["pending-photos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("album_media")
        .select("*")
        .eq("is_featured", true)
        .is("is_approved", null);

      if (error) throw error;
      return data;
    },
  });

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from("album_media")
      .update({ is_approved: true })
      .eq("id", id);

    if (error) {
      toast.error(t("errorApprovingPhoto"));
      return;
    }

    toast.success(t("photoApproved"));
    refetch();
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from("album_media")
      .update({ is_approved: false, is_featured: false })
      .eq("id", id);

    if (error) {
      toast.error(t("errorRejectingPhoto"));
      return;
    }

    toast.success(t("photoRejected"));
    refetch();
  };

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