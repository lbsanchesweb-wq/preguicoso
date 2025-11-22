
export enum AppStep {
  CONFIG = 'CONFIG',
  SCRIPT_GEN = 'SCRIPT_GEN',
  INFRA_PREVIEW = 'INFRA_PREVIEW'
}

export interface AgentConfig {
  targetUrl: string;
  taskDescription: string;
  projectId: string;
  region: string;
  serviceName: string;
  secretName: string;
  cronSchedule: string;
  alertEmail: string;
  alertWhatsapp: string;
}

export interface GeneratedArtifacts {
  playwrightScript: string;
  playbookJson: string;
  dockerfile: string;
  packageJson: string;
  cloudBuildYaml: string;
  entrypoint: string;
  setupScript: string;
  localRunScript: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}
