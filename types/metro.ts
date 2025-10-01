export interface Position {
  x: number;
  y: number;
}

export type MetroLine = "Blue" | "AquaLine" | "Purple";

// Line details including current status
export interface MetroLineDetails {
  id: MetroLine;
  name: string;
  color: string;
  status: "operational" | "construction" | "planned";
  length: number; // in kilometers
  stations: number;
  expectedCompletion?: string;
}

// Kochi Metro Line Details
export const metroLines: MetroLineDetails[] = [
  {
    id: "Blue",
    name: "Line 1 (Blue Line)",
    color: "hsl(217 91% 60%)",
    status: "operational",
    length: 25,
    stations: 22
  },
  {
    id: "AquaLine",
    name: "Line 2 (Water Metro)",
    color: "hsl(198 93% 60%)",
    status: "construction",
    length: 15.5,
    stations: 38,
    expectedCompletion: "2026"
  },
  {
    id: "Purple",
    name: "Line 3 (Purple Line)",
    color: "hsl(262 83% 58%)",
    status: "planned",
    length: 11.2,
    stations: 11,
    expectedCompletion: "2027"
  }
];
export type StationStatus = "active" | "delayed" | "maintenance";
export type CrowdLevel = "low" | "medium" | "high";

export interface Station {
  id: string;
  name: string;
  position: Position;
  line: MetroLine;
  status: StationStatus;
  crowdLevel: CrowdLevel;
  connections: string[]; // IDs of connected stations
  phase?: "operational" | "construction" | "planned"; // Phase status of the station
  expectedCompletion?: string; // Expected completion date for stations under construction
}

export const kochiMetroStations: Station[] = [
  {
    id: "aluva",
    name: "Aluva",
    position: { x: 450, y: 80 },
    line: "Blue",
    status: "active",
    crowdLevel: "medium",
    connections: ["pulinchodu"]
  },
  {
    id: "pulinchodu",
    name: "Pulinchodu",
    position: { x: 435, y: 120 },
    line: "Blue",
    status: "active",
    crowdLevel: "low",
    connections: ["aluva", "companypady"]
  },
  {
    id: "companypady",
    name: "Companypady",
    position: { x: 420, y: 160 },
    line: "Blue",
    status: "active",
    crowdLevel: "high",
    connections: ["pulinchodu", "ambattukavu"]
  },
  {
    id: "ambattukavu",
    name: "Ambattukavu",
    position: { x: 400, y: 200 },
    line: "Blue",
    status: "maintenance",
    crowdLevel: "low",
    connections: ["companypady", "muttom"]
  },
  {
    id: "muttom",
    name: "Muttom",
    position: { x: 400, y: 250 },
    line: "Blue",
    status: "active",
    crowdLevel: "medium",
    connections: ["ambattukavu", "kalamassery"]
  },
  {
    id: "kalamassery",
    name: "Kalamassery",
    position: { x: 400, y: 300 },
    line: "Blue",
    status: "active",
    crowdLevel: "high",
    connections: ["muttom", "cusat"]
  },
  {
    id: "cusat",
    name: "CUSAT",
    position: { x: 400, y: 350 },
    line: "Blue",
    status: "active",
    crowdLevel: "high",
    connections: ["kalamassery", "pathadipalam"]
  },
  {
    id: "pathadipalam",
    name: "Pathadipalam",
    position: { x: 400, y: 400 },
    line: "Blue",
    status: "active",
    crowdLevel: "medium",
    connections: ["cusat", "edapally"]
  },
  {
    id: "edapally",
    name: "Edapally",
    position: { x: 400, y: 450 },
    line: "Blue",
    status: "active",
    crowdLevel: "medium",
    connections: ["pathadipalam", "changampuzha"]
  },
  {
    id: "changampuzha",
    name: "Changampuzha Park",
    position: { x: 400, y: 500 },
    line: "Blue",
    status: "active",
    crowdLevel: "low",
    connections: ["edapally", "palarivattom"]
  },
  {
    id: "palarivattom",
    name: "Palarivattom",
    position: { x: 400, y: 550 },
    line: "Blue",
    status: "active",
    crowdLevel: "high",
    connections: ["changampuzha", "jln-stadium"]
  },
  {
    id: "jln-stadium",
    name: "JLN Stadium",
    position: { x: 400, y: 600 },
    line: "Blue",
    status: "active",
    crowdLevel: "medium",
    connections: ["palarivattom", "kaloor"]
  },
  {
    id: "kaloor",
    name: "Kaloor",
    position: { x: 400, y: 650 },
    line: "Blue",
    status: "active",
    crowdLevel: "high",
    connections: ["jln-stadium", "lissie"]
  },
  {
    id: "lissie",
    name: "Lissie",
    position: { x: 400, y: 700 },
    line: "Blue",
    status: "active",
    crowdLevel: "medium",
    connections: ["kaloor", "mg-road"]
  },
  {
    id: "mg-road",
    name: "MG Road",
    position: { x: 400, y: 750 },
    line: "Blue",
    status: "active",
    crowdLevel: "high",
    connections: ["lissie", "maharajas"]
  },
  {
    id: "maharajas",
    name: "Maharajas",
    position: { x: 400, y: 800 },
    line: "Blue",
    status: "active",
    crowdLevel: "high",
    connections: ["mg-road", "ernakulam-south"]
  },
  {
    id: "ernakulam-south",
    name: "Ernakulam South",
    position: { x: 400, y: 850 },
    line: "Blue",
    status: "active",
    crowdLevel: "medium",
    connections: ["maharajas", "kadavanthra"]
  },
  {
    id: "kadavanthra",
    name: "Kadavanthra",
    position: { x: 400, y: 900 },
    line: "Blue",
    status: "active",
    crowdLevel: "low",
    connections: ["ernakulam-south", "elamkulam"]
  },
  {
    id: "elamkulam",
    name: "Elamkulam",
    position: { x: 400, y: 950 },
    line: "Blue",
    status: "active",
    crowdLevel: "low",
    connections: ["kadavanthra", "vyttila"]
  },
  {
    id: "vyttila",
    name: "Vyttila",
    position: { x: 400, y: 1000 },
    line: "Blue",
    status: "active",
    crowdLevel: "high",
    connections: ["elamkulam", "thaikoodam"]
  },
  {
    id: "thaikoodam",
    name: "Thaikoodam",
    position: { x: 400, y: 1050 },
    line: "Blue",
    status: "active",
    crowdLevel: "medium",
    connections: ["vyttila", "petta"]
  },
  {
    id: "petta",
    name: "Petta",
    position: { x: 400, y: 1100 },
    line: "Blue",
    status: "active",
    crowdLevel: "low",
    connections: ["thaikoodam", "sn-junction"]
  },
  {
    id: "sn-junction",
    name: "SN Junction",
    position: { x: 400, y: 1150 },
    line: "Blue",
    status: "active",
    crowdLevel: "low",
    connections: ["petta"],
    phase: "operational"
  },
  // Water Metro (AquaLine) Stations
  {
    id: "high-court",
    name: "High Court",
    position: { x: 480, y: 620 },
    line: "AquaLine",
    status: "maintenance",
    crowdLevel: "low",
    connections: ["info-park"],
    phase: "construction",
    expectedCompletion: "2026-Q1"
  },
  {
    id: "info-park",
    name: "Info Park",
    position: { x: 550, y: 580 },
    line: "AquaLine",
    status: "maintenance",
    crowdLevel: "low",
    connections: ["high-court", "kakkanad"],
    phase: "construction",
    expectedCompletion: "2026-Q1"
  },
  {
    id: "kakkanad",
    name: "Kakkanad",
    position: { x: 620, y: 540 },
    line: "AquaLine",
    status: "maintenance",
    crowdLevel: "low",
    connections: ["info-park"],
    phase: "construction",
    expectedCompletion: "2026-Q2"
  },
  // Purple Line Stations (Planned)
  {
    id: "tripunithura",
    name: "Tripunithura",
    position: { x: 320, y: 800 },
    line: "Purple",
    status: "maintenance",
    crowdLevel: "low",
    connections: ["ernakulam-south-purple"],
    phase: "planned",
    expectedCompletion: "2027-Q4"
  },
  {
    id: "ernakulam-south-purple",
    name: "Ernakulam South",
    position: { x: 380, y: 700 },
    line: "Purple",
    status: "maintenance",
    crowdLevel: "low",
    connections: ["tripunithura", "kadavanthra-purple"],
    phase: "planned",
    expectedCompletion: "2027-Q4"
  },
  {
    id: "kadavanthra-purple",
    name: "Kadavanthra",
    position: { x: 440, y: 600 },
    line: "Purple",
    status: "maintenance",
    crowdLevel: "low",
    connections: ["ernakulam-south-purple", "elamkulam-purple"],
    phase: "planned",
    expectedCompletion: "2027-Q3"
  }
];