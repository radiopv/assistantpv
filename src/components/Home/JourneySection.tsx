import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface JourneyStep {
  title: string;
  description: string;
}

interface JourneySectionProps {
  settings: {
    title: string;
    steps: JourneyStep[];
    showProgressBar?: boolean;
  };
}

export const JourneySection = ({ settings }: JourneySectionProps) => {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12 text-cuba-coral font-title">
        {settings.title}
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {settings.steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="p-6 h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-cuba-coral">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-cuba-coral text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-xl text-gray-800">{step.title}</h3>
                </div>
                <p className="text-gray-600 flex-grow">{step.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {settings.showProgressBar && (
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-cuba-coral rounded-full w-1/3 transition-all duration-500" />
          </div>
        </div>
      )}
    </div>
  );
};