export interface Train3D {
  id: string;
  trainNumber: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  // unify status values seen across the codebase
  status: "ready" | "maintenance" | "cleaning" | "inactive" | "active" | "standby" | "telecom-expired";
  route?: string;
  passengers?: number;
  speed?: number;
  // additional telemetry / maintenance fields used by viewer and panels
  healthScore?: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  totalKm?: number;
  bay?: number;
}