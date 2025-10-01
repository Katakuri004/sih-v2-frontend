"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
  line: "blue" | "green";
  crowdLevel: "low" | "medium" | "high";
  nextTrain: string;
  trainStatus: "on-time" | "delayed" | "approaching";
}

const kochiMetroStations: Station[] = [
  // Blue Line (North-South)
  {
    id: "aluva",
    name: "Aluva",
    x: 400,
    y: 50,
    line: "blue",
    crowdLevel: "medium",
    nextTrain: "M101",
    trainStatus: "approaching",
  },
  {
    id: "pulinchodu",
    name: "Pulinchodu",
    x: 400,
    y: 100,
    line: "blue",
    crowdLevel: "low",
    nextTrain: "M102",
    trainStatus: "on-time",
  },
  {
    id: "companypady",
    name: "Companypady",
    x: 400,
    y: 150,
    line: "blue",
    crowdLevel: "medium",
    nextTrain: "M103",
    trainStatus: "on-time",
  },
  {
    id: "ambattukavu",
    name: "Ambattukavu",
    x: 400,
    y: 200,
    line: "blue",
    crowdLevel: "high",
    nextTrain: "M104",
    trainStatus: "delayed",
  },
  {
    id: "muttom",
    name: "Muttom",
    x: 400,
    y: 250,
    line: "blue",
    crowdLevel: "medium",
    nextTrain: "M105",
    trainStatus: "on-time",
  },
  {
    id: "kalamassery",
    name: "Kalamassery",
    x: 400,
    y: 300,
    line: "blue",
    crowdLevel: "high",
    nextTrain: "M106",
    trainStatus: "approaching",
  },
  {
    id: "cochin-university",
    name: "Cochin University",
    x: 400,
    y: 350,
    line: "blue",
    crowdLevel: "medium",
    nextTrain: "M107",
    trainStatus: "on-time",
  },
  {
    id: "pathadipalam",
    name: "Pathadipalam",
    x: 400,
    y: 400,
    line: "blue",
    crowdLevel: "low",
    nextTrain: "M108",
    trainStatus: "on-time",
  },
  {
    id: "edapally",
    name: "Edapally",
    x: 400,
    y: 450,
    line: "blue",
    crowdLevel: "high",
    nextTrain: "M109",
    trainStatus: "on-time",
  },
  {
    id: "changampuzha-park",
    name: "Changampuzha Park",
    x: 400,
    y: 500,
    line: "blue",
    crowdLevel: "medium",
    nextTrain: "M110",
    trainStatus: "approaching",
  },
  {
    id: "palarivattom",
    name: "Palarivattom",
    x: 400,
    y: 550,
    line: "blue",
    crowdLevel: "high",
    nextTrain: "M111",
    trainStatus: "on-time",
  },
  {
    id: "jln-stadium",
    name: "JLN Stadium",
    x: 400,
    y: 600,
    line: "blue",
    crowdLevel: "medium",
    nextTrain: "M112",
    trainStatus: "on-time",
  },
  {
    id: "kaloor",
    name: "Kaloor",
    x: 400,
    y: 650,
    line: "blue",
    crowdLevel: "high",
    nextTrain: "M113",
    trainStatus: "delayed",
  },
  {
    id: "lissie",
    name: "Lissie",
    x: 400,
    y: 700,
    line: "blue",
    crowdLevel: "medium",
    nextTrain: "M114",
    trainStatus: "on-time",
  },
  {
    id: "mg-road",
    name: "MG Road",
    x: 400,
    y: 750,
    line: "blue",
    crowdLevel: "high",
    nextTrain: "M115",
    trainStatus: "approaching",
  },
  {
    id: "maharajas",
    name: "Maharajas",
    x: 400,
    y: 800,
    line: "blue",
    crowdLevel: "medium",
    nextTrain: "M116",
    trainStatus: "on-time",
  },
  {
    id: "ernakulam-south",
    name: "Ernakulam South",
    x: 400,
    y: 850,
    line: "blue",
    crowdLevel: "high",
    nextTrain: "M117",
    trainStatus: "on-time",
  },

  // Green Line (East-West) - Intersects at Palarivattom
  {
    id: "thykoodam",
    name: "Thykoodam",
    x: 200,
    y: 550,
    line: "green",
    crowdLevel: "low",
    nextTrain: "G201",
    trainStatus: "on-time",
  },
  {
    id: "vytilla",
    name: "Vytilla",
    x: 300,
    y: 550,
    line: "green",
    crowdLevel: "high",
    nextTrain: "G202",
    trainStatus: "approaching",
  },
  {
    id: "sos",
    name: "SOS",
    x: 500,
    y: 550,
    line: "green",
    crowdLevel: "medium",
    nextTrain: "G203",
    trainStatus: "on-time",
  },
  {
    id: "kadavanthra",
    name: "Kadavanthra",
    x: 600,
    y: 550,
    line: "green",
    crowdLevel: "medium",
    nextTrain: "G204",
    trainStatus: "delayed",
  },
  {
    id: "elamkulam",
    name: "Elamkulam",
    x: 700,
    y: 550,
    line: "green",
    crowdLevel: "low",
    nextTrain: "G205",
    trainStatus: "on-time",
  },
];

interface InteractiveMapProps {
  onStationClick: (station: Station) => void;
}

export function InteractiveMap({ onStationClick }: InteractiveMapProps) {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getStationColor = (station: Station) => {
    if (station.line === "blue") return "hsl(var(--metro-blue))";
    return "hsl(var(--metro-green))";
  };

  const getCrowdColor = (crowdLevel: string) => {
    switch (crowdLevel) {
      case "low":
        return "hsl(var(--success))";
      case "medium":
        return "hsl(var(--warning))";
      case "high":
        return "hsl(var(--metro-red))";
      default:
        return "hsl(var(--muted))";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "hsl(var(--success))";
      case "delayed":
        return "hsl(var(--metro-red))";
      case "approaching":
        return "hsl(var(--metro-teal))";
      default:
        return "hsl(var(--muted))";
    }
  };

  return (
    <Card className="w-full h-full">
      <CardContent className="p-6">
        <div className="relative w-full h-[600px] bg-gradient-to-br from-amber-50/30 to-yellow-50/50 dark:from-gray-800/80 dark:to-gray-700/60 rounded-lg border overflow-hidden">
          <svg
            ref={svgRef}
            viewBox="0 0 900 900"
            className="w-full h-full"
            style={{ background: "hsl(var(--background))" }}
          >
            {/* Blue Line Track */}
            <line
              x1="400"
              y1="50"
              x2="400"
              y2="850"
              stroke="hsl(var(--metro-blue))"
              strokeWidth="6"
              opacity="0.3"
            />

            {/* Green Line Track */}
            <line
              x1="200"
              y1="550"
              x2="700"
              y2="550"
              stroke="hsl(var(--metro-green))"
              strokeWidth="6"
              opacity="0.3"
            />

            {/* Stations */}
            {kochiMetroStations.map((station) => (
              <g key={station.id}>
                {/* Station Circle */}
                <circle
                  cx={station.x}
                  cy={station.y}
                  r={hoveredStation === station.id ? "12" : "8"}
                  fill={getStationColor(station)}
                  stroke="hsl(var(--background))"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200 hover:scale-125"
                  onMouseEnter={() => setHoveredStation(station.id)}
                  onMouseLeave={() => setHoveredStation(null)}
                  onClick={() => onStationClick(station)}
                />

                {/* Crowd Level Indicator */}
                <circle
                  cx={station.x + 15}
                  cy={station.y - 15}
                  r="4"
                  fill={getCrowdColor(station.crowdLevel)}
                  className="cursor-pointer"
                  onClick={() => onStationClick(station)}
                />

                {/* Train Status Indicator */}
                <circle
                  cx={station.x - 15}
                  cy={station.y - 15}
                  r="4"
                  fill={getStatusColor(station.trainStatus)}
                  className="cursor-pointer"
                  onClick={() => onStationClick(station)}
                />

                {/* Station Name */}
                <text
                  x={station.x}
                  y={station.y + 25}
                  textAnchor="middle"
                  className="text-xs font-medium fill-foreground pointer-events-none"
                  style={{
                    fontSize: hoveredStation === station.id ? "12px" : "10px",
                  }}
                >
                  {station.name}
                </text>

                {/* Hover Tooltip */}
                {hoveredStation === station.id && (
                  <g>
                    <rect
                      x={station.x - 60}
                      y={station.y - 60}
                      width="120"
                      height="40"
                      fill="hsl(var(--popover))"
                      stroke="hsl(var(--border))"
                      strokeWidth="1"
                      rx="4"
                      className="drop-shadow-lg"
                    />
                    <text
                      x={station.x}
                      y={station.y - 45}
                      textAnchor="middle"
                      className="text-xs font-semibold fill-popover-foreground"
                    >
                      {station.name}
                    </text>
                    <text
                      x={station.x}
                      y={station.y - 30}
                      textAnchor="middle"
                      className="text-xs fill-muted-foreground"
                    >
                      Next: {station.nextTrain} • {station.trainStatus}
                    </text>
                  </g>
                )}
              </g>
            ))}

            {/* Legend */}
            <g transform="translate(50, 50)">
              <rect
                x="0"
                y="0"
                width="200"
                height="210"
                fill="white"
                stroke="#e5e7eb"
                strokeWidth="1"
                rx="12"
                className="drop-shadow-lg"
              />
              <text
                x="15"
                y="20"
                className="text-sm font-bold fill-gray-800"
                style={{ fontSize: "14px", fontWeight: "bold" }}
              >
                Legend
              </text>

              {/* Line Colors */}
              <text
                x="15"
                y="40"
                className="text-xs font-medium fill-gray-600"
                style={{ fontSize: "11px" }}
              >
                Lines:
              </text>
              <circle
                cx="25"
                cy="52"
                r="4"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="1"
              />
              <text
                x="35"
                y="57"
                className="text-xs fill-gray-800"
                style={{ fontSize: "11px" }}
              >
                Blue Line
              </text>
              <circle
                cx="25"
                cy="67"
                r="4"
                fill="#10b981"
                stroke="white"
                strokeWidth="1"
              />
              <text
                x="35"
                y="72"
                className="text-xs fill-gray-800"
                style={{ fontSize: "11px" }}
              >
                Green Line
              </text>

              {/* Crowd Levels */}
              <text
                x="15"
                y="90"
                className="text-xs font-medium fill-gray-600"
                style={{ fontSize: "11px" }}
              >
                Crowd Level:
              </text>
              <circle
                cx="25"
                cy="102"
                r="3"
                fill="#10b981"
                stroke="white"
                strokeWidth="1"
              />
              <text
                x="35"
                y="107"
                className="text-xs fill-gray-800"
                style={{ fontSize: "11px" }}
              >
                Low
              </text>
              <circle
                cx="25"
                cy="117"
                r="3"
                fill="#f59e0b"
                stroke="white"
                strokeWidth="1"
              />
              <text
                x="35"
                y="122"
                className="text-xs fill-gray-800"
                style={{ fontSize: "11px" }}
              >
                Medium
              </text>
              <circle
                cx="25"
                cy="132"
                r="3"
                fill="#ef4444"
                stroke="white"
                strokeWidth="1"
              />
              <text
                x="35"
                y="137"
                className="text-xs fill-gray-800"
                style={{ fontSize: "11px" }}
              >
                High
              </text>

              {/* Train Status */}
              <text
                x="15"
                y="155"
                className="text-xs font-medium fill-gray-600"
                style={{ fontSize: "11px" }}
              >
                Train Status:
              </text>
              <circle
                cx="25"
                cy="167"
                r="3"
                fill="#10b981"
                stroke="white"
                strokeWidth="1"
              />
              <text
                x="35"
                y="172"
                className="text-xs fill-gray-800"
                style={{ fontSize: "11px" }}
              >
                On Time
              </text>
              <circle
                cx="25"
                cy="182"
                r="3"
                fill="#06b6d4"
                stroke="white"
                strokeWidth="1"
              />
              <text
                x="35"
                y="187"
                className="text-xs fill-gray-800"
                style={{ fontSize: "11px" }}
              >
                Approaching
              </text>
              <circle
                cx="25"
                cy="197"
                r="3"
                fill="#ef4444"
                stroke="white"
                strokeWidth="1"
              />
              <text
                x="35"
                y="202"
                className="text-xs fill-gray-800"
                style={{ fontSize: "11px" }}
              >
                Delayed
              </text>
            </g>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}

export { kochiMetroStations };
export type { Station };
