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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, ArrowUpDown, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Need, convertJsonToNeeds, convertNeedsToJson } from "@/types/needs";
import { toast } from "sonner";

interface ChildNeed {
  childId: string;
  childName: string;
  description: string;
  story: string;
  comments: string;
  needs: Need[];
}

interface EditableFields {
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
  const [editableFields, setEditableFields] = useState<EditableFields | null>(null);

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
    mutationFn: async (data: { childId: string; updates: Partial<EditableFields> }) => {
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
    setEditableFields({
      description: child.description,
      story: child.story,
      comments: child.comments,
      needs: [...child.needs],
    });
  };

  const handleSave = (childId: string) => {
    if (!editableFields) return;
    
    updateChildMutation.mutate({
      childId,
      updates: editableFields,
    });
  };

  const updateNeed = (index: number, field: keyof Need, value: string | boolean) => {
    if (!editableFields) return;
    
    const updatedNeeds = [...editableFields.needs];
    updatedNeeds[index] = {
      ...updatedNeeds[index],
      [field]: value,
    };
    
    setEditableFields({
      ...editableFields,
      needs: updatedNeeds,
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
              <Button
                variant="ghost"
                onClick={() => toggleSort("childName")}
              >
                {t("childName")}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => toggleSort("urgentNeeds")}
              >
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
                <div className="flex flex-wrap gap-2">
                  {(editingChild === child.childId ? editableFields?.needs : child.needs).map((need, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {editingChild === child.childId ? (
                        <>
                          <Input
                            value={need.category}
                            onChange={(e) => updateNeed(index, "category", e.target.value)}
                            className="w-24"
                          />
                          <Input
                            value={need.description}
                            onChange={(e) => updateNeed(index, "description", e.target.value)}
                            className="w-32"
                          />
                          <Button
                            variant={need.is_urgent ? "destructive" : "secondary"}
                            onClick={() => updateNeed(index, "is_urgent", !need.is_urgent)}
                            size="sm"
                          >
                            {need.is_urgent ? t("urgent") : t("normal")}
                          </Button>
                        </>
                      ) : (
                        <Badge
                          variant={need.is_urgent ? "destructive" : "secondary"}
                        >
                          {need.category}: {need.description}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {editingChild === child.childId ? (
                  <Textarea
                    value={editableFields?.description}
                    onChange={(e) => setEditableFields({
                      ...editableFields!,
                      description: e.target.value,
                    })}
                    className="min-h-[100px]"
                  />
                ) : (
                  <div className="max-w-md overflow-auto">{child.description}</div>
                )}
              </TableCell>
              <TableCell>
                {editingChild === child.childId ? (
                  <Textarea
                    value={editableFields?.story}
                    onChange={(e) => setEditableFields({
                      ...editableFields!,
                      story: e.target.value,
                    })}
                    className="min-h-[100px]"
                  />
                ) : (
                  <div className="max-w-md overflow-auto">{child.story}</div>
                )}
              </TableCell>
              <TableCell>
                {editingChild === child.childId ? (
                  <Textarea
                    value={editableFields?.comments}
                    onChange={(e) => setEditableFields({
                      ...editableFields!,
                      comments: e.target.value,
                    })}
                    className="min-h-[100px]"
                  />
                ) : (
                  <div className="max-w-md overflow-auto">{child.comments}</div>
                )}
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(child)}>
                        {t("edit")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};