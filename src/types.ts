export type VersionType = 'PATCH' | 'MINOR' | 'MAJOR';
export type DeployDependencies = 'dev' | 'all';

export interface InputParams {
  deployDependencies: DeployDependencies;
  gitHubToken: string;
  maxDeployVersion: VersionType;
  deployOnlyInWorkingHours: boolean;
  timezone: string;
}
