import { Card } from "@/components/ui/card";
import SponsorshipRequestForm from "@/components/Sponsors/SponsorshipRequestForm";

const SponsorshipRequest = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto">
        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Devenir Parrain</h1>
          <p className="text-gray-600 mb-8">
            Remplissez ce formulaire pour commencer votre parcours de parrainage
          </p>
        </div>
        <SponsorshipRequestForm />
      </Card>
    </div>
  );
};

export default SponsorshipRequest;