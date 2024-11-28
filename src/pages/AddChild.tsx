import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AddChildForm } from "@/components/Children/AddChildForm";

const AddChild = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/children')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          Ajouter un enfant
        </h1>
      </div>

      <Card className="p-6">
        <AddChildForm />
      </Card>
    </div>
  );
};

export default AddChild;