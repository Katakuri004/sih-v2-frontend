import { Train3D } from "./types";

export const mockTrains: Train3D[] = [
  {
    id: "1",
    trainNumber: "T-001",
    position: { x: 20, y: 0, z: 20 },
    status: "ready",
    route: "Line 1 - North",
    passengers: 0,
    speed: 0
  },
  {
    id: "2",
    trainNumber: "T-002",
    position: { x: 40, y: 0, z: 20 },
    status: "maintenance",
    route: "Line 2 - West",
    passengers: 0,
    speed: 0
  },
  {
    id: "3",
    trainNumber: "T-003",
    position: { x: 60, y: 0, z: 20 },
    status: "cleaning",
    route: "Depot",
    passengers: 0,
    speed: 0
  },
  {
    id: "4",
    trainNumber: "T-004",
    position: { x: 80, y: 0, z: 20 },
    status: "ready",
    route: "Line 3 - South",
    passengers: 0,
    speed: 0
  },
  {
    id: "5",
    trainNumber: "T-005",
    position: { x: 20, y: 0, z: 60 },
    status: "ready",
    route: "Line 4 - East",
    passengers: 0,
    speed: 0
  },
  {
    id: "6",
    trainNumber: "T-006",
    position: { x: 40, y: 0, z: 60 },
    status: "inactive",
    route: "Depot",
    passengers: 0,
    speed: 0
  }
];