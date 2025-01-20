import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AutoTranslate } from "@/components/Translation/AutoTranslate";
import { PhotoAnalysis } from "@/components/Photos/PhotoAnalysis";
import { PhotoUpload } from "@/components/Photos/PhotoUpload";

export const TranslationAndAnalysisExample = () => {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="space-y-8 p-4">
      {/* Section Traduction */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Traduction Automatique</h2>
        <div className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Entrez du texte à traduire..."
            className="min-h-[100px]"
          />
          <AutoTranslate
            text={text}
            targetLanguage="fr"
            onTranslationComplete={(translatedText) => setText(translatedText)}
          />
        </div>
      </Card>

      {/* Section Analyse de Photos */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Analyse de Photos</h2>
        {imageUrl ? (
          <PhotoUpload
            imageUrl={imageUrl}
            description={description}
            onDescriptionChange={setDescription}
          />
        ) : (
          <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <p>Téléchargez une photo pour l'analyser</p>
          </div>
        )}
        <PhotoAnalysis
          imageUrl={imageUrl}
          onAnalysisComplete={(analysis) => setDescription(analysis)}
        />
      </Card>
    </div>
  );
};