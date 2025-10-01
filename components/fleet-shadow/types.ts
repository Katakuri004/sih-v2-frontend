export interface Train3D {
  id: string;
  trainNumber: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  status: "ready" | "maintenance" | "cleaning" | "inactive";
  route: string;
  passengers: number;
  speed: number;
}