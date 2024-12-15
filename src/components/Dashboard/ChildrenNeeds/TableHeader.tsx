import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { TableHead, TableHeader as UITableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";

interface TableHeaderProps {
  onSort: (field: "childName" | "urgentNeeds") => void;
}

export const ChildrenNeedsHeader = ({ onSort }: TableHeaderProps) => {
  const { t } = useLanguage();

  return (
    <UITableHeader>
      <TableRow>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("childName")}
            className="w-full table-action-button"
          >
            {t("childNameStats")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("urgentNeeds")}
            className="w-full table-action-button"
          >
            {t("needsStats")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>{t("descriptionStats")}</TableHead>
        <TableHead>{t("storyStats")}</TableHead>
        <TableHead>{t("commentsStats")}</TableHead>
        <TableHead className="w-[100px]">{t("actionsStats")}</TableHead>
      </TableRow>
    </UITableHeader>
  );
};