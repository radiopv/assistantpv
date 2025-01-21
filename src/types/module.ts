import { Json } from "@/integrations/supabase/types/json";

export type ModuleType = 'hero' | 'impact' | 'journey' | 'featured' | 'cta';

export interface ModuleContent {
  title?: string;
  subtitle?: string;
  text?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface ModuleSettings {
  layout?: string;
  theme?: string;
  animation?: string;
  isFullWidth?: boolean;
}

export interface Module {
  id: string;
  name: string;
  module_type: ModuleType;
  content: ModuleContent;
  settings: ModuleSettings;
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

export interface ModulesListProps {
  modules: Module[];
  onToggle: (moduleId: string) => Promise<void>;
  onDeleteClick: (moduleId: string) => Promise<void>;
  onAddModule: (moduleData: Partial<Module>) => Promise<void>;
}