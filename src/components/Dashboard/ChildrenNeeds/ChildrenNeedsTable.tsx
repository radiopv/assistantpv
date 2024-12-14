import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Save, Edit } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Need, convertJsonToNeeds, convertNeedsToJson } from "@/types/needs";
import { toast } from "sonner";
import { NeedsCell } from "./NeedsCell";
import { EditableCell } from "./EditableCell";

interface ChildNeed {
  childId: string;
  childName: string;
  description: string;
  story: string;
  comments: string;
  needs: Need[];
}

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
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" onClick={() => toggleSort("childName")}>
                {t("childName")}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => toggleSort("urgentNeeds")}>
                {t("needs")}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>{t("description")}</TableHead>
            <TableHead>{t("story")}</TableHead>
            <TableHead>{t("comments")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((child) => (
            <TableRow key={child.childId}>
              <TableCell>{child.childName}</TableCell>
              <TableCell>
                <NeedsCell
                  needs={editingChild === child.childId ? editableFields?.needs || [] : child.needs}
                  isEditing={editingChild === child.childId}
                  onUpdate={(updatedNeeds) =>
                    setEditableFields(prev => prev ? { ...prev, needs: updatedNeeds } : null)
                  }
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={editingChild === child.childId ? editableFields?.description || "" : child.description}
                  isEditing={editingChild === child.childId}
                  onChange={(value) =>
                    setEditableFields(prev => prev ? { ...prev, description: value } : null)
                  }
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={editingChild === child.childId ? editableFields?.story || "" : child.story}
                  isEditing={editingChild === child.childId}
                  onChange={(value) =>
                    setEditableFields(prev => prev ? { ...prev, story: value } : null)
                  }
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={editingChild === child.childId ? editableFields?.comments || "" : child.comments}
                  isEditing={editingChild === child.childId}
                  onChange={(value) =>
                    setEditableFields(prev => prev ? { ...prev, comments: value } : null)
                  }
                />
              </TableCell>
              <TableCell>
                {editingChild === child.childId ? (
                  <Button
                    variant="default"
                    onClick={() => handleSave(child.childId)}
                    className="h-8 w-8 p-0"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => handleEdit(child)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};