import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-cuba-gradient text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Changez une vie aujourd'hui
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Votre soutien peut faire une réelle différence dans la vie d'un enfant
        </p>
        <Button
          onClick={() => navigate("/children")}
          size="lg"
          className="bg-white text-primary hover:bg-white/90"
        >
          Parrainer un enfant
        </Button>
      </div>
    </section>
  );
};