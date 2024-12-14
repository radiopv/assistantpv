import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Table, TableBody } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { convertJsonToNeeds, convertNeedsToJson } from "@/types/needs";
import { toast } from "sonner";
import { ChildrenNeedsHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { ChildNeed } from "./types";

export const ChildrenNeedsTable = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [sortField, setSortField] = useState<"childName" | "urgentNeeds">("childName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [editingChild, setEditingChild] = useState<string | null>(null);
  const [editableFields, setEditableFields] = useState<ChildNeed | null>(null);

  const { data: childrenNeeds = [], isLoading } = useQuery({
    queryKey: ["childrenNeeds"],
    queryFn: async () => {
      const { data: children } = await supabase
        .from("children")
        .select("id, name, needs, description, story, comments");

      return (children || []).map((child) => ({
        childId: child.id,
        childName: child.name,
        description: child.description || "",
        story: child.story || "",
        comments: child.comments || "",
        needs: convertJsonToNeeds(child.needs),
      }));
    },
  });

  const updateChildMutation = useMutation({
    mutationFn: async (data: { childId: string; updates: Partial<ChildNeed> }) => {
      const { error } = await supabase
        .from("children")
        .update({
          needs: convertNeedsToJson(data.updates.needs),
          description: data.updates.description,
          story: data.updates.story,
          comments: data.updates.comments,
        })
        .eq("id", data.childId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["childrenNeeds"] });
      toast.success(t("updateSuccess"));
      setEditingChild(null);
      setEditableFields(null);
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast.error(t("updateError"));
    },
  });

  const sortedData = [...childrenNeeds].sort((a, b) => {
    if (sortField === "childName") {
      return sortDirection === "asc"
        ? a.childName.localeCompare(b.childName)
        : b.childName.localeCompare(a.childName);
    } else {
      const aUrgentCount = a.needs.filter((n) => n.is_urgent).length;
      const bUrgentCount = b.needs.filter((n) => n.is_urgent).length;
      return sortDirection === "asc"
        ? aUrgentCount - bUrgentCount
        : bUrgentCount - aUrgentCount;
    }
  });

  const toggleSort = (field: "childName" | "urgentNeeds") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (child: ChildNeed) => {
    setEditingChild(child.childId);
    setEditableFields(child);
  };

  const handleSave = (childId: string) => {
    if (!editableFields) return;
    
    updateChildMutation.mutate({
      childId,
      updates: editableFields,
    });
  };

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <ChildrenNeedsHeader onSort={toggleSort} />
        <TableBody>
          {sortedData.map((child) => (
            <TableRow
              key={child.childId}
              child={child}
              isEditing={editingChild === child.childId}
              onEdit={handleEdit}
              onSave={handleSave}
              editableFields={editableFields}
              setEditableFields={setEditableFields}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
