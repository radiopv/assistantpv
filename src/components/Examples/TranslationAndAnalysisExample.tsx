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
            placeholder="La traduction automatique est temporairement désactivée..."
            className="min-h-[100px]"
            disabled
          />
          <Button 
            variant="outline" 
            disabled
            className="opacity-50"
          >
            Traduction temporairement désactivée
          </Button>
        </div>
      </Card>

      {/* Section Analyse de Photos */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Analyse de Photos</h2>
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <p>L'analyse de photos est temporairement désactivée</p>
        </div>
      </Card>
    </div>
  );
};