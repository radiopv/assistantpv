import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AddChildForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    birth_date: "",
    city: "",
    status: "available",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl = null;

      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('children-photos')
          .upload(filePath, photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('children-photos')
          .getPublicUrl(filePath);

        photoUrl = publicUrl;
      }

      const { error } = await supabase
        .from('children')
        .insert({
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender,
          birth_date: formData.birth_date,
          city: formData.city,
          status: "available",
          photo_url: photoUrl,
          is_sponsored: false,
        });

      if (error) throw error;

      toast({
        title: "Enfant ajouté",
        description: "L'enfant a été ajouté avec succès.",
      });

      navigate('/children');
    } catch (error: any) {
      console.error('Error adding child:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout de l'enfant.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="age">Âge</Label>
          <Input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="gender">Genre</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculin</SelectItem>
              <SelectItem value="F">Féminin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="birth_date">Date de naissance</Label>
          <Input
            id="birth_date"
            name="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="photo">Photo</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="cursor-pointer"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/children')}
          className="w-full md:w-auto"
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? "Ajout en cours..." : "Ajouter l'enfant"}
        </Button>
      </div>
    </form>
  );
};