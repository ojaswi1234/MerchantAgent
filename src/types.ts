export interface AgentTrigger {
  type: string;
  conditions: string[];
}

export interface AgentAction {
  type: string;
  config: Record<string, any>;
}

export interface AgentGuardrails {
  max_retries: number;
  allowed_channels: string[];
}

export interface AgentConfig {
  id?: string;
  name: string;
  description: string;
  trigger: AgentTrigger;
  actions: AgentAction[];
  message_template: string;
  guardrails: AgentGuardrails;
  createdAt?: string;
}

export interface SimulationStep {
  title: string;
  description: string;
  status: 'success' | 'skipped' | 'failed';
}

export interface SimulationResult {
  steps: SimulationStep[];
  final_output: string;
  is_successful: boolean;
}
