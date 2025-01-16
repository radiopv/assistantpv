import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, UserPlus, UserMinus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { differenceInYears, differenceInMonths, parseISO } from "date-fns";
import { useState } from "react";

interface ChildrenTableProps {
  children: any[];
  onViewProfile: (id: string) => void;
  onSponsorClick: (child: any) => void;
  onAssignSponsor?: (childId: string) => void;
  onRemoveSponsor?: (childId: string) => void;
}

export const ChildrenTable = ({ 
  children, 
  onViewProfile, 
  onSponsorClick,
  onAssignSponsor, 
  onRemoveSponsor 
}: ChildrenTableProps) => {
  const { t } = useLanguage();
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: '', direction: 'asc' });

  const formatAge = (birthDate: string) => {
    if (!birthDate) return t("ageNotAvailable");
    
    const today = new Date();
    const birth = parseISO(birthDate);
    const years = differenceInYears(today, birth);
    
    if (years === 0) {
      const months = differenceInMonths(today, birth);
      return `${months} ${t("months")}`;
    }
    
    return `${years} ${t("years")}`;
  };

  const sortData = (key: string) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const getSortedChildren = () => {
    if (!sortConfig.key) return children;

    return [...children].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'age') {
        const aDate = parseISO(a.birth_date);
        const bDate = parseISO(b.birth_date);
        aValue = aDate.getTime();
        bValue = bDate.getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const renderSortButton = (key: string, label: string) => (
    <Button
      variant="ghost"
      onClick={() => sortData(key)}
      className="h-8 flex items-center gap-1 p-0 hover:bg-transparent"
    >
      {label}
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );

  const handleRowClick = (childId: string) => {
    onViewProfile(childId);
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{renderSortButton('name', t("name"))}</TableHead>
            <TableHead>{renderSortButton('age', t("age"))}</TableHead>
            <TableHead>{renderSortButton('city', t("city"))}</TableHead>
            <TableHead>{renderSortButton('is_sponsored', t("status"))}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getSortedChildren().map((child) => (
            <TableRow 
              key={child.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleRowClick(child.id)}
            >
              <TableCell className="font-medium whitespace-normal break-words">
                {child.name}
                {child.is_sponsored && child.sponsor_name && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({t("sponsoredBy")} {child.sponsor_name})
                  </span>
                )}
              </TableCell>
              <TableCell>{formatAge(child.birth_date)}</TableCell>
              <TableCell className="whitespace-normal break-words">{child.city}</TableCell>
              <TableCell>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    !child.is_sponsored
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {child.is_sponsored ? t("sponsored") : t("available")}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {!child.is_sponsored && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSponsorClick(child);
                      }}
                      className="flex items-center gap-1"
                    >
                      <UserPlus className="h-4 w-4" />
                      {t("assignSponsor")}
                    </Button>
                  )}
                  {child.is_sponsored && onRemoveSponsor && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSponsor(child.id);
                      }}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <UserMinus className="h-4 w-4" />
                      {t("removeSponsor")}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};