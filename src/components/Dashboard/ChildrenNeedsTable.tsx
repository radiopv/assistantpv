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
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Need, convertJsonToNeeds } from "@/types/needs";

interface ChildNeed {
  childId: string;
  childName: string;
  needs: Need[];
}

export const ChildrenNeedsTable = () => {
  const { t } = useLanguage();
  const [sortField, setSortField] = useState<"childName" | "urgentNeeds">("childName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { data: childrenNeeds = [], isLoading } = useQuery({
    queryKey: ["childrenNeeds"],
    queryFn: async () => {
      const { data: children } = await supabase
        .from("children")
        .select("id, name, needs");

      return (children || []).map((child) => ({
        childId: child.id,
        childName: child.name,
        needs: convertJsonToNeeds(child.needs),
      }));
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
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((child) => (
            <TableRow key={child.childId}>
              <TableCell>{child.childName}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {child.needs.map((need, index) => (
                    <Badge
                      key={index}
                      variant={need.is_urgent ? "destructive" : "secondary"}
                    >
                      {need.category}: {need.description}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        // TODO: Implement edit functionality
                        console.log("Edit", child);
                      }}
                    >
                      {t("edit")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};