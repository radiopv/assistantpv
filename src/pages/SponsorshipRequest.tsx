import { SponsorshipRequestForm } from "@/components/Sponsorship/SponsorshipRequestForm";

const SponsorshipRequest = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Devenir parrain</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800">
            En devenant parrain, vous contribuez directement à améliorer la vie d'un enfant à Cuba.
            Veuillez remplir le formulaire ci-dessous pour soumettre votre demande de parrainage.
          </p>
        </div>

        <SponsorshipRequestForm />
      </div>
    </div>
  );
};

export default SponsorshipRequest;