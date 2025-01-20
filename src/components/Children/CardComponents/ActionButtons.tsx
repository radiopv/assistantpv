interface ActionButtonsProps {
  onAddPhoto: () => void;
  childId: string;
  sponsorshipId: string;
  onShowTermination: () => void;
}

export const ActionButtons = ({ 
  onAddPhoto, 
  childId,
  sponsorshipId,
  onShowTermination 
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-col space-y-2 mt-6">
      <button
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        onClick={onAddPhoto}
      >
        Ajouter une photo
      </button>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={onShowTermination}
      >
        Mettre fin au parrainage
      </button>
    </div>
  );
};