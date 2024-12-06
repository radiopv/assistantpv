import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, UserPlus, ArrowUpDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { differenceInYears, parseISO } from "date-fns";
import { useState } from "react";

interface ChildrenTableProps {
  children: any[];
  onViewProfile: (id: string) => void;
  onSponsorClick: (child: any) => void;
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

export const ChildrenTable = ({ children, onViewProfile, onSponsorClick }: ChildrenTableProps) => {
  const { t } = useLanguage();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' });

  const getAge = (birthDate: string) => {
    return differenceInYears(new Date(), parseISO(birthDate));
  };

  const sortData = (data: any[], key: string) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    return [...data].sort((a, b) => {
      let aValue = key === 'age' ? getAge(a.birth_date) : a[key];
      let bValue = key === 'age' ? getAge(b.birth_date) : b[key];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const getSortedChildren = () => {
    if (!sortConfig.key) return children;
    return sortData(children, sortConfig.key);
  };

  const renderSortButton = (key: string, label: string) => (
    <Button
      variant="ghost"
      onClick={() => sortData(children, key)}
      className="h-8 flex items-center gap-1 p-0 hover:bg-transparent"
    >
      {label}
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{renderSortButton('name', t("name"))}</TableHead>
            <TableHead>{renderSortButton('birth_date', t("age"))}</TableHead>
            <TableHead>{renderSortButton('city', t("city"))}</TableHead>
            <TableHead>{renderSortButton('is_sponsored', t("status"))}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getSortedChildren().map((child) => (
            <TableRow key={child.id}>
              <TableCell className="font-medium">{child.name}</TableCell>
              <TableCell>{getAge(child.birth_date)} {t("years")}</TableCell>
              <TableCell>{child.city}</TableCell>
              <TableCell>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    !child.is_sponsored
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {child.is_sponsored ? t("sponsored") : t("available")}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewProfile(child.id)}
                    className="w-full sm:w-auto"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {t("edit")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSponsorClick(child)}
                    className="w-full sm:w-auto"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {child.is_sponsored ? t("editOrRemoveSponsor") : t("addSponsor")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};