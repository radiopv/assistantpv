import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SponsorFormFields } from "./SponsorFormFields";
import { ErrorAlert } from "../ErrorAlert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface EditSponsorDialogProps {
  sponsor: any;
  open: boolean;
  onClose: () => void;
}

export const EditSponsorDialog = ({ sponsor, open, onClose }: EditSponsorDialogProps) => {
  const [formData, setFormData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch available children
  const { data: availableChildren } = useQuery({
    queryKey: ['available-children'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (sponsor) {
      setFormData({
        id: sponsor.id,
        name: sponsor.name || '',
        email: sponsor.email || '',
        phone: sponsor.phone || '',
        city: sponsor.city || '',
        address: sponsor.address || '',
        facebook_url: sponsor.facebook_url || '',
        is_active: sponsor.is_active || false,
        is_anonymous: sponsor.is_anonymous || false,
        role: sponsor.role || '',
        photo_url: sponsor.photo_url || '',
        show_name_publicly: sponsor.show_name_publicly || false,
        sponsorships: sponsor.sponsorships || []
      });
    }
  }, [sponsor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value
    }));
  };

  const handleSwitchChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    try {
      if (formData.photo_url) {
        const oldPhotoPath = formData.photo_url.split('/').pop();
        if (oldPhotoPath) {
          await supabase.storage
            .from('sponsor-photos')
            .remove([`${sponsor.id}/${oldPhotoPath}`]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('sponsor-photos')
        .upload(`${sponsor.id}/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('sponsor-photos')
        .getPublicUrl(`${sponsor.id}/${fileName}`);

      setFormData(prev => ({
        ...prev,
        photo_url: publicUrl
      }));

      toast({
        title: "Photo mise à jour",
        description: "La photo a été mise à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating photo:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la photo",
      });
    }
  };

  const handleAddChild = async (childId: string) => {
    try {
      const { error } = await supabase
        .from('sponsorships')
        .insert({
          sponsor_id: sponsor.id,
          child_id: childId,
          start_date: new Date().toISOString(),
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'enfant a été ajouté au parrainage",
      });

      // Refresh sponsor data
      const { data: updatedSponsorships } = await supabase
        .from('sponsorships')
        .select(`
          *,
          children (
            id,
            name,
            age,
            city,
            photo_url
          )
        `)
        .eq('sponsor_id', sponsor.id);

      setFormData(prev => ({
        ...prev,
        sponsorships: updatedSponsorships
      }));

    } catch (error) {
      console.error('Error adding child:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter l'enfant",
      });
    }
  };

  const handleRemoveChild = async (sponsorshipId: string) => {
    try {
      const { error } = await supabase
        .from('sponsorships')
        .delete()
        .eq('id', sponsorshipId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'enfant a été retiré du parrainage",
      });

      // Update local state
      setFormData(prev => ({
        ...prev,
        sponsorships: prev.sponsorships.filter((s: any) => s.id !== sponsorshipId)
      }));

    } catch (error) {
      console.error('Error removing child:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de retirer l'enfant",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('sponsors')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          facebook_url: formData.facebook_url,
          is_active: formData.is_active,
          is_anonymous: formData.is_anonymous,
          role: formData.role,
          photo_url: formData.photo_url,
          show_name_publicly: formData.show_name_publicly
        })
        .eq('id', sponsor.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Les informations du parrain ont été mises à jour",
      });
      onClose();
    } catch (error) {
      console.error('Error updating sponsor:', error);
      setError("Impossible de mettre à jour les informations");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sponsor || !formData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Modifier le parrain</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          {error && <ErrorAlert message={error} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Informations du parrain</h3>
                <SponsorFormFields
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSwitchChange={handleSwitchChange}
                  handleSelectChange={handleSelectChange}
                  handlePhotoChange={handlePhotoChange}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Enfants parrainés</h3>
                <div className="space-y-4">
                  {formData.sponsorships?.map((sponsorship: any) => (
                    sponsorship.children && (
                      <Card key={sponsorship.id} className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => handleRemoveChild(sponsorship.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <CardHeader className="flex flex-row items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={sponsorship.children.photo_url} alt={sponsorship.children.name} />
                            <AvatarFallback>{sponsorship.children.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-sm font-semibold">{sponsorship.children.name}</h4>
                            <p className="text-sm text-gray-500">{sponsorship.children.city}</p>
                          </div>
                        </CardHeader>
                      </Card>
                    )
                  ))}

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Ajouter un enfant</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {availableChildren?.filter((child: any) => 
                        !formData.sponsorships?.some((s: any) => s.children?.id === child.id)
                      ).map((child: any) => (
                        <Card key={child.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleAddChild(child.id)}>
                          <CardContent className="flex items-center gap-2 p-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={child.photo_url} alt={child.name} />
                              <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{child.name}</p>
                              <p className="text-xs text-gray-500 truncate">{child.city}</p>
                            </div>
                            <Plus className="h-4 w-4 text-gray-400" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};