import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-cuba-gradient text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Prêt à changer une vie ?</h2>
        <p className="mb-8 text-lg">Devenez parrain aujourd'hui et faites la différence dans la vie d'un enfant.</p>
        <Button 
          onClick={() => navigate("/become-sponsor")}
          size="lg"
          className="bg-white text-black hover:bg-gray-100"
        >
          Devenir parrain
        </Button>
      </div>
    </section>
  );
};