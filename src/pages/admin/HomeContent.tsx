import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const HomeContent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: heroSection, isLoading } = useQuery({
    queryKey: ['hero-section'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_key', 'hero')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    ctaText: '',
    leftImage: '',
    rightImage: '',
    mobileImage: ''
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('homepage_sections')
        .update({
          title: data.title,
          subtitle: data.subtitle,
          content: {
            ctaText: data.ctaText,
            leftImage: data.leftImage,
            rightImage: data.rightImage,
            mobileImage: data.mobileImage
          }
        })
        .eq('section_key', 'hero');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-section'] });
      toast({
        title: "Success",
        description: "Homepage content updated successfully",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update homepage content",
        variant: "destructive",
      });
      console.error('Error updating homepage content:', error);
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      title: heroSection.title,
      subtitle: heroSection.subtitle,
      ctaText: heroSection.content.ctaText,
      leftImage: heroSection.content.leftImage,
      rightImage: heroSection.content.rightImage,
      mobileImage: heroSection.content.mobileImage
    });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Homepage Content Management</h1>
      
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Hero Section</h2>
          {!isEditing && (
            <Button onClick={handleEdit}>Edit Content</Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <Textarea
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">CTA Text</label>
              <Input
                value={formData.ctaText}
                onChange={(e) => setFormData(prev => ({ ...prev, ctaText: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Left Image URL</label>
              <Input
                value={formData.leftImage}
                onChange={(e) => setFormData(prev => ({ ...prev, leftImage: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Right Image URL</label>
              <Input
                value={formData.rightImage}
                onChange={(e) => setFormData(prev => ({ ...prev, rightImage: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mobile Image URL</label>
              <Input
                value={formData.mobileImage}
                onChange={(e) => setFormData(prev => ({ ...prev, mobileImage: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Current Content</h3>
              <p className="mt-2"><strong>Title:</strong> {heroSection.title}</p>
              <p className="mt-2"><strong>Subtitle:</strong> {heroSection.subtitle}</p>
              <p className="mt-2"><strong>CTA Text:</strong> {heroSection.content.ctaText}</p>
              <p className="mt-2"><strong>Left Image:</strong> {heroSection.content.leftImage}</p>
              <p className="mt-2"><strong>Right Image:</strong> {heroSection.content.rightImage}</p>
              <p className="mt-2"><strong>Mobile Image:</strong> {heroSection.content.mobileImage}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HomeContent;