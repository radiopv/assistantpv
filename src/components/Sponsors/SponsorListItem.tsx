import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  UserPlus, 
  History, 
  Pause, 
  Play, 
  Clock,
  StickyNote,
  ArrowRightLeft
} from "lucide-react";
import { useState } from "react";
import { SponsorshipHistoryDialog } from "./SponsorshipManagement/SponsorshipHistoryDialog";
import { NotesDialog } from "./SponsorshipManagement/NotesDialog";
import { TemporaryStatusDialog } from "./SponsorshipManagement/TemporaryStatusDialog";

interface SponsorListItemProps {
  sponsor: any;
  onAddChild: (sponsor: any) => void;
  onStatusChange: (sponsorId: string, field: string, value: boolean) => void;
  onVerificationChange: (sponsorId: string, checked: boolean) => void;
  onPauseSponsorship?: (sponsorshipId: string) => void;
  onResumeSponsorship?: (sponsorshipId: string) => void;
  onSelect?: (sponsorId: string, selected: boolean) => void;
  isSelected?: boolean;
}

export const SponsorListItem = ({
  sponsor,
  onAddChild,
  onStatusChange,
  onVerificationChange,
  onPauseSponsorship,
  onResumeSponsorship,
  onSelect,
  isSelected
}: SponsorListItemProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showTemporary, setShowTemporary] = useState(false);
  const [selectedSponsorshipId, setSelectedSponsorshipId] = useState<string>("");

  const handleHistoryClick = (sponsorshipId: string) => {
    setSelectedSponsorshipId(sponsorshipId);
    setShowHistory(true);
  };

  const handleNotesClick = (sponsorshipId: string) => {
    setSelectedSponsorshipId(sponsorshipId);
    setShowNotes(true);
  };

  const handleTemporaryClick = (sponsorshipId: string) => {
    setSelectedSponsorshipId(sponsorshipId);
    setShowTemporary(true);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {onSelect && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(sponsor.id, checked as boolean)}
            />
          )}
          <Avatar className="h-12 w-12">
            <AvatarImage src={sponsor.photo_url} alt={sponsor.name} />
            <AvatarFallback>{sponsor.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{sponsor.name}</h3>
            <p className="text-sm text-gray-500">{sponsor.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Vérifié</span>
            <Checkbox
              checked={sponsor.is_verified}
              onCheckedChange={(checked) => onVerificationChange(sponsor.id, checked as boolean)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Statut</span>
            <Switch
              checked={sponsor.is_active}
              onCheckedChange={(checked) => onStatusChange(sponsor.id, 'is_active', checked)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => onAddChild(sponsor)}
        >
          <UserPlus className="h-4 w-4" />
          Ajouter un enfant
        </Button>

        {sponsor.sponsorships?.map((s: any) => (
          <div key={s.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span>{s.child.name}</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleHistoryClick(s.id)}
              >
                <History className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNotesClick(s.id)}
              >
                <StickyNote className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTemporaryClick(s.id)}
              >
                <Clock className="h-4 w-4" />
              </Button>
              {s.is_paused ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onResumeSponsorship?.(s.id)}
                >
                  <Play className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPauseSponsorship?.(s.id)}
                >
                  <Pause className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <SponsorshipHistoryDialog
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        sponsorshipId={selectedSponsorshipId}
      />

      <NotesDialog
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
        sponsorshipId={selectedSponsorshipId}
      />

      <TemporaryStatusDialog
        isOpen={showTemporary}
        onClose={() => setShowTemporary(false)}
        sponsorshipId={selectedSponsorshipId}
        onStatusChange={() => {
          // Refresh the sponsor list
          window.location.reload();
        }}
      />
    </Card>
  );
};