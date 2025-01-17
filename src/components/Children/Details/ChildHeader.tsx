import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChildHeaderProps {
  name: string;
}

export const ChildHeader = ({ name }: ChildHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <Button 
        onClick={() => navigate(-1)} 
        variant="ghost" 
        className="text-cuba-coral hover:text-cuba-coral/80 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Retour
      </Button>
      <h1 className="text-3xl font-title font-bold text-cuba-coral">{name}</h1>
    </div>
  );
};