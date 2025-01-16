import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <Card className="p-4 md:rounded-lg rounded-none">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-4 min-w-0">
          {onSelect && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(sponsor.id, checked as boolean)}
            />
          )}
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={sponsor.photo_url} alt={sponsor.name} />
            <AvatarFallback>{sponsor.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold break-words">{sponsor.name}</h3>
            <p className="text-sm text-gray-500 break-all">{sponsor.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Vérifié</span>
            <Checkbox
              checked={sponsor.is_verified}
              onCheckedChange={(checked) => onVerificationChange(sponsor.id, checked as boolean)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 w-full md:w-auto"
          onClick={() => onAddChild(sponsor)}
        >
          <UserPlus className="h-4 w-4" />
          Ajouter un enfant
        </Button>

        {sponsor.sponsorships?.map((s: any) => (
          <div key={s.id} className="flex justify-between items-center p-2 bg-gray-50 rounded flex-wrap gap-2">
            <span className="break-words min-w-0">{s.child.name}</span>
            <div className="flex gap-2 flex-wrap">
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
          window.location.reload();
        }}
      />
    </Card>
  );
};