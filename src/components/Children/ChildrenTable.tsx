import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChildrenTableProps {
  children: any[];
  onViewProfile: (id: string) => void;
  onSponsorClick: (child: any) => void;
}

export const ChildrenTable = ({ children, onViewProfile, onSponsorClick }: ChildrenTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Âge</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Besoins urgents</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {children.map((child) => (
            <TableRow key={child.id}>
              <TableCell className="font-medium">{child.name}</TableCell>
              <TableCell>{child.age} ans</TableCell>
              <TableCell>{child.city}</TableCell>
              <TableCell>
                {child.needs?.some((need: any) => need.is_urgent) && (
                  <Badge variant="destructive">BESOIN URGENT</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewProfile(child.id)}
                  >
                    Voir le profil
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onSponsorClick(child)}
                    className="bg-cuba-warmBeige hover:bg-cuba-warmBeige/90 text-white font-semibold shadow-md transition-all duration-200"
                  >
                    Parrainer
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