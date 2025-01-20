interface TerminationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorshipId: string;
  childName: string;
  onTerminationComplete: () => void;
}

export const TerminationDialog = ({
  isOpen,
  onClose,
  sponsorshipId,
  childName,
  onTerminationComplete
}: TerminationDialogProps) => {
  return (
    <div className={`modal ${isOpen ? 'block' : 'hidden'}`}>
      <div className="modal-content">
        <h2>Terminer le parrainage</h2>
        <p>Êtes-vous sûr de vouloir mettre fin au parrainage de {childName}?</p>
        <div className="flex justify-end gap-4 mt-4">
          <button onClick={onClose}>Annuler</button>
          <button onClick={onTerminationComplete}>Confirmer</button>
        </div>
      </div>
    </div>
  );
};