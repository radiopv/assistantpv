import { PhotoAnalysis } from "./PhotoAnalysis";
import { AutoTranslate } from "../Translation/AutoTranslate";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface PhotoUploadProps {
  imageUrl: string;
  description: string;
  onDescriptionChange: (description: string) => void;
}

export const PhotoUpload = ({ imageUrl, description, onDescriptionChange }: PhotoUploadProps) => {
  const [analysis, setAnalysis] = useState<string>("");

  return (
    <Card className="p-4 space-y-4">
      <img 
        src={imageUrl} 
        alt="Photo uploaded" 
        className="w-full h-64 object-cover rounded-lg"
      />
      
      <div className="flex gap-2">
        <PhotoAnalysis 
          imageUrl={imageUrl}
          onAnalysisComplete={setAnalysis}
        />
        <AutoTranslate
          text={description}
          targetLanguage="fr"
          onTranslationComplete={onDescriptionChange}
        />
      </div>

      {analysis && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Analyse de l'IA :</h3>
          <p className="text-sm text-gray-600">{analysis}</p>
        </div>
      )}
    </Card>
  );
};