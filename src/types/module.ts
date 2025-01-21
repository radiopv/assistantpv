import { Json } from "@/integrations/supabase/types/json";

export type ModuleType = 'hero' | 'impact' | 'journey' | 'featured' | 'cta';

export interface Module {
  id: string;
  name: string;
  module_type: ModuleType;
  content: Json;
  settings: Json;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ModuleCardProps {
  module: Module;
  key: string;
  onToggle: (moduleId: string) => void;
  onSettingsClick: (module: Module) => void;
  onDeleteClick: (moduleId: string) => void;
  dragHandleProps?: any;
}