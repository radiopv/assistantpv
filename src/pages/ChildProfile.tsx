import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { AlbumMediaUpload } from "@/components/AlbumMedia/AlbumMediaUpload";
import { AlbumMediaGrid } from "@/components/AlbumMedia/AlbumMediaGrid";

const ChildProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [child, setChild] = useState<any>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadChild();
  }, [id]);

  const loadChild = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setChild(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('children')
        .update(child)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
      setEditing(false);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
      });
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorAlert 
          message="Une erreur est survenue lors du chargement du profil" 
          retry={loadChild}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card className="p-6">
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/children')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {child.name}
          </h1>
        </div>
        <Button 
          variant={editing ? "outline" : "default"}
          onClick={() => editing ? handleUpdate() : setEditing(true)}
        >
          {editing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </>
          ) : (
            "Modifier"
          )}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <div className="grid gap-6">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <img
                src={child.photo_url || "/placeholder.svg"}
                alt={child.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={child.name}
                  onChange={(e) => editing && setChild({ ...child, name: e.target.value })}
                  disabled={!editing}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  type="number"
                  value={child.age}
                  onChange={(e) => editing && setChild({ ...child, age: parseInt(e.target.value) })}
                  disabled={!editing}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={child.city}
                  onChange={(e) => editing && setChild({ ...child, city: e.target.value })}
                  disabled={!editing}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Statut</Label>
                <Input
                  id="status"
                  value={child.status}
                  onChange={(e) => editing && setChild({ ...child, status: e.target.value })}
                  disabled={!editing}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Photos supplémentaires</h2>
          <div className="space-y-6">
            <AlbumMediaUpload childId={id!} onUploadComplete={loadChild} />
            <AlbumMediaGrid childId={id!} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChildProfile;