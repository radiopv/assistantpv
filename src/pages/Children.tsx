import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CUBAN_CITIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  birth_date: string;
  city: string;
  status: string;
  is_sponsored: boolean;
  needs: any[];
  photo_url?: string;
  sponsorships?: any[];
}

const Children = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select(`
          *,
          sponsorships(
            id,
            status,
            start_date,
            sponsor:sponsors(*)
          )
        `)
        .order('name');

      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      console.error('Error fetching children:', error);
      toast.error('Erreur lors du chargement des enfants');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChild = async (childId: string) => {
    try {
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', childId);

      if (error) throw error;

      setChildren(children.filter(child => child.id !== childId));
      toast.success('Enfant supprimé avec succès');
    } catch (error) {
      console.error('Error deleting child:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         child.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'all' || child.city === cityFilter;
    const matchesStatus = statusFilter === 'all' || child.status === statusFilter;
    return matchesSearch && matchesCity && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Enfants</h1>
          <Button
            onClick={() => navigate('/children/add')}
            className="inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un Enfant
          </Button>
        </div>
      </div>

      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un enfant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Toutes les villes</option>
              {CUBAN_CITIES.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="available">Disponible</option>
              <option value="sponsored">Parrainé</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {filteredChildren.map((child) => (
          <Card key={child.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{child.name}</h3>
                <p className="text-sm text-gray-500">
                  {child.age} ans • {child.city} • {child.gender}
                </p>
                <p className="text-sm text-gray-500">
                  Status: {child.status}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/children/${child.id}`)}
                >
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteChild(child.id)}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredChildren.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">Aucun enfant trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Children;