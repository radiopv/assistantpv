import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Sponsor {
  id: string;
  name: string;
  email: string;
  last_login: string;
  password_hash: string;
}

export default function SponsorsManagement() {
  const { t } = useLanguage();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from("sponsors")
        .select("id, name, email, last_login, password_hash")
        .order('last_login', { ascending: false }); // Sort by last_login in descending order

      if (error) throw error;
      setSponsors(data || []);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      toast.error(t("errorFetchingSponsors"));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setEditForm({
      name: sponsor.name,
      email: sponsor.email,
      password: sponsor.password_hash,
    });
  };

  const handleSave = async () => {
    if (!selectedSponsor) return;

    try {
      const { error } = await supabase
        .from("sponsors")
        .update({
          name: editForm.name,
          email: editForm.email,
          password_hash: editForm.password,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedSponsor.id);

      if (error) throw error;

      toast.success(t("sponsorUpdated"));
      setSelectedSponsor(null);
      fetchSponsors();
    } catch (error) {
      console.error("Error updating sponsor:", error);
      toast.error(t("errorUpdatingSponsor"));
    }
  };

  if (loading) {
    return <div className="p-4">{t("loading")}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("sponsorsManagement")}</h1>

      <div className="grid gap-4">
        {sponsors.map((sponsor) => (
          <Card key={sponsor.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{sponsor.name}</h3>
                <p className="text-sm text-gray-600">{sponsor.email}</p>
                <p className="text-sm text-gray-500">
                  {t("lastLogin")}: {new Date(sponsor.last_login).toLocaleDateString()}
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => handleEdit(sponsor)}>
                    {t("edit")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("editSponsor")}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("name")}
                      </label>
                      <Input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("email")}
                      </label>
                      <Input
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("password")}
                      </label>
                      <Input
                        value={editForm.password}
                        onChange={(e) =>
                          setEditForm({ ...editForm, password: e.target.value })
                        }
                      />
                    </div>
                    <Button onClick={handleSave}>{t("save")}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}