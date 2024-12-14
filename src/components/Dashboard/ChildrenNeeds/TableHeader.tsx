import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";

interface TableHeaderProps {
  onSort: (field: "childName" | "urgentNeeds") => void;
}

export const TableHeader = ({ onSort }: TableHeaderProps) => {
  const { t } = useLanguage();

  return (
    <TableHeader>
      <TableRow>
        <TableHead>
          <Button variant="ghost" onClick={() => onSort("childName")} className="w-full">
            {t("childName")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button variant="ghost" onClick={() => onSort("urgentNeeds")} className="w-full">
            {t("needs")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>{t("description")}</TableHead>
        <TableHead>{t("story")}</TableHead>
        <TableHead>{t("comments")}</TableHead>
        <TableHead className="w-[100px]">{t("actions")}</TableHead>
      </TableRow>
    </TableHeader>
  );
};