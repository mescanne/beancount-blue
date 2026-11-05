export interface ParamDefinition {
  type: string;
  default: any;
  min: number | null;
  max: number | null;
  step: number | null;
  label: string;
  unit: string;
  group: string;
  description: string;
}

export interface ModelInfo {
  status: string;
  model_name: string;
  models?: string[];
  is_demo: boolean;
  start_year: number;
  end_year: number;
  params: Record<string, ParamDefinition>;
}

export interface SimulationTrace {
  periods: number[];
  cashflows: Record<string, number[]>;
  balances: Record<string, number[]>;
  metrics: Record<string, number[]>;
  funding?: Record<string, number[]>;
  colors?: Record<string, string>;
}
