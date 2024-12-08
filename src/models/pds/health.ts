export interface HealthResponse {
  version: string;
}

export type Health =
  | { isHealthy: true; data: HealthResponse }
  | { isHealthy: false; data: undefined };