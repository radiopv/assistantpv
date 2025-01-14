import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Child {
  id: string;
  name: string;
  description: string | null;
  story: string | null;
  needs: any;
}

interface TranslationStatus {
  [key: string]: {
    description?: boolean;
    story?: boolean;
    needs?: boolean;
  };
}

const TranslationAdmin = () => {
  const { toast } = useToast();
  const [translations, setTranslations] = useState<{ [key: string]: Child }>({});
  const [translationStatus, setTranslationStatus] = useState<TranslationStatus>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const { data: children, isLoading } = useQuery({
    queryKey: ["children"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("id, name, description, story, needs")
        .order("name");

      if (error) throw error;
      return data as Child[];
    },
  });

  const translateText = async (text: string) => {
    try {
      const response = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPL_API_KEY}`,
        },
        body: JSON.stringify({
          text,
          source_lang: "ES",
          target_lang: "FR",
        }),
      });
      const data = await response.json();
      return data.translations[0].text;
    } catch (error) {
      console.error("Translation error:", error);
      throw error;
    }
  };

  const handleTranslate = async (childId: string, field: keyof Child) => {
    try {
      setLoading((prev) => ({ ...prev, [`${childId}-${field}`]: true }));
      const originalText = children?.find((c) => c.id === childId)?.[field];

      if (!originalText) {
        toast({
          title: "Erreur",
          description: "Aucun texte à traduire",
          variant: "destructive",
        });
        return;
      }

      const translatedText = await translateText(
        typeof originalText === "string" ? originalText : JSON.stringify(originalText)
      );

      setTranslations((prev) => ({
        ...prev,
        [childId]: {
          ...prev[childId],
          [field]: translatedText,
        },
      }));

      setTranslationStatus((prev) => ({
        ...prev,
        [childId]: {
          ...prev[childId],
          [field]: true,
        },
      }));

      toast({
        title: "Succès",
        description: "Traduction effectuée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur de traduction",
        description: "Impossible de traduire le texte",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [`${childId}-${field}`]: false }));
    }
  };

  const handleSave = async (childId: string) => {
    try {
      const translatedData = translations[childId];
      if (!translatedData) return;

      const { error } = await supabase
        .from("children")
        .update({
          description: translatedData.description,
          story: translatedData.story,
          needs: translatedData.needs,
        })
        .eq("id", childId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Traductions sauvegardées avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les traductions",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Traduction des profils d'enfants</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Histoire</TableHead>
              <TableHead>Besoins</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {children?.map((child) => (
              <TableRow key={child.id}>
                <TableCell className="font-medium">{child.name}</TableCell>
                <TableCell className="max-w-md">
                  <Textarea
                    value={translations[child.id]?.description || child.description || ""}
                    onChange={(e) =>
                      setTranslations((prev) => ({
                        ...prev,
                        [child.id]: { ...prev[child.id], description: e.target.value },
                      }))
                    }
                    className={
                      translationStatus[child.id]?.description ? "bg-green-50" : undefined
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleTranslate(child.id, "description")}
                    disabled={loading[`${child.id}-description`]}
                  >
                    {loading[`${child.id}-description`] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Traduire"
                    )}
                  </Button>
                </TableCell>
                <TableCell className="max-w-md">
                  <Textarea
                    value={translations[child.id]?.story || child.story || ""}
                    onChange={(e) =>
                      setTranslations((prev) => ({
                        ...prev,
                        [child.id]: { ...prev[child.id], story: e.target.value },
                      }))
                    }
                    className={translationStatus[child.id]?.story ? "bg-green-50" : undefined}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleTranslate(child.id, "story")}
                    disabled={loading[`${child.id}-story`]}
                  >
                    {loading[`${child.id}-story`] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Traduire"
                    )}
                  </Button>
                </TableCell>
                <TableCell className="max-w-md">
                  <Textarea
                    value={
                      translations[child.id]?.needs ||
                      (typeof child.needs === "object"
                        ? JSON.stringify(child.needs, null, 2)
                        : child.needs || "")
                    }
                    onChange={(e) =>
                      setTranslations((prev) => ({
                        ...prev,
                        [child.id]: { ...prev[child.id], needs: e.target.value },
                      }))
                    }
                    className={translationStatus[child.id]?.needs ? "bg-green-50" : undefined}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleTranslate(child.id, "needs")}
                    disabled={loading[`${child.id}-needs`]}
                  >
                    {loading[`${child.id}-needs`] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Traduire"
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleSave(child.id)}
                    disabled={!translations[child.id]}
                  >
                    Sauvegarder
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TranslationAdmin;