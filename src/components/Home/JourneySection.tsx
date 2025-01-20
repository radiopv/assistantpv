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
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-cuba-coral font-title">
        {settings.title}
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {settings.steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="p-4 h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-cuba-coral">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-cuba-coral text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800">{step.title}</h3>
                </div>
                <p className="text-gray-600 flex-grow text-sm">{step.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {settings.showProgressBar && (
        <div className="mt-6 max-w-3xl mx-auto">
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-full bg-cuba-coral rounded-full w-1/3 transition-all duration-500" />
          </div>
        </div>
      )}
    </div>
  );
};