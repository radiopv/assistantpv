export interface Module {
  id: string;
  name: string;
  module_type: string;
  is_active: boolean;
  settings: any;
  order_index: number;
}