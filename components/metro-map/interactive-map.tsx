"use client";

import * as React from "react";
import { SVGProps } from "react";
import { motion, useSpring } from "framer-motion";
import { MapLegend } from "./map-legend";
import { type MetroLine } from "@/types/metro";

// 1. DEFINED TYPES AND DATA
// ===================================

export interface Station {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
  lines: MetroLine[];
  status: "active" | "delayed" | "maintenance";
  crowdLevel: "low" | "medium" | "high";
}

interface InteractiveMapProps {
  onStationClick: (station: Station) => void;
  lensEnabled?: boolean;
}

export const kochiMetroStations: Station[] = [
  {
    id: "1",
    name: "Aluva",
    position: { x: 80, y: 20 },
    lines: ["BlueLine"],
    status: "active",
    crowdLevel: "medium",
  },
  {
    id: "2",
    name: "Pulinchodu",
    position: { x: 80, y: 60 },
    lines: ["BlueLine"],
    status: "active",
    crowdLevel: "low",
  },
  {
    id: "3",
    name: "Companypady",
    position: { x: 80, y: 100 },
    lines: ["BlueLine"],
    status: "active",
    crowdLevel: "high",
  },
  {
    id: "4",
    name: "Ambattukavu",
    position: { x: 80, y: 140 },
    lines: ["BlueLine"],
    status: "maintenance",
    crowdLevel: "low",
  },
  {
    id: "5",
    name: "Kalamassery",
    position: { x: 80, y: 180 },
    lines: ["BlueLine", "AquaLine"],
    status: "active",
    crowdLevel: "medium",
  },
  {
    id: "6",
    name: "CUSAT",
    position: { x: 120, y: 180 },
    lines: ["AquaLine"],
    status: "active",
    crowdLevel: "high",
  },
  {
    id: "7",
    name: "Pathadipalam",
    position: { x: 160, y: 180 },
    lines: ["AquaLine"],
    status: "delayed",
    crowdLevel: "medium",
  },
  {
    id: "8",
    name: "Edapally",
    position: { x: 200, y: 180 },
    lines: ["AquaLine", "PurpleLine"],
    status: "active",
    crowdLevel: "high",
  },
];

// 2. STYLING CONSTANTS
// ===================================

const lineColors: Record<MetroLine, string> = {
  BlueLine: "#3b82f6",
  AquaLine: "#06b6d4",
  PurpleLine: "#a855f7",
  Red: "#ef4444",
  Green: "#22c55e",
} as const;

const statusColors = {
  active: "#22c55e",
  delayed: "#f59e0b",
  maintenance: "#ef4444",
} as const;

const crowdLevelColors = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
} as const;


// 3. INTERACTIVE MAP COMPONENT
// ===================================

export function InteractiveMap({
  onStationClick,
  lensEnabled = true,
}: InteractiveMapProps) {
  const [hoveredStation, setHoveredStation] = React.useState<string | null>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!lensEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const springConfig = { damping: 20, stiffness: 300 };
  const mouseX = useSpring(mousePosition.x, springConfig);
  const mouseY = useSpring(mousePosition.y, springConfig);

  // Helper function to get line paths from station data
  const getLinePath = (line: keyof typeof lineColors) => {
    const stationsOnLine = kochiMetroStations.filter((s) => s.lines.includes(line));
    if (stationsOnLine.length < 2) return "";
    
    // Simple path generator: creates straight lines between stations in order
    const pathData = stationsOnLine
      .map((s, index) => {
        const command = index === 0 ? "M" : "L";
        return `${command} ${s.position.x} ${s.position.y}`;
      })
      .join(" ");
      
    return pathData;
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-[4/3] bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 300"
        onMouseMove={handleMouseMove}
        className="bg-gray-800 text-gray-300"
      >
        {/* Metro Lines */}
        {(Object.keys(lineColors) as (keyof typeof lineColors)[]).map((line) => (
          <path
            key={line}
            d={getLinePath(line)}
            stroke={lineColors[line]}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        ))}

        {/* Stations */}
        {kochiMetroStations.map((station) => (
          <g
            key={station.id}
            transform={`translate(${station.position.x}, ${station.position.y})`}
            onClick={() => onStationClick(station)}
            onMouseEnter={() => setHoveredStation(station.id)}
            onMouseLeave={() => setHoveredStation(null)}
            className="cursor-pointer transition-transform duration-200 hover:scale-110"
          >
            {/* Crowd Level Indicator */}
            <circle
              r="10"
              fill={crowdLevelColors[station.crowdLevel]}
              opacity="0.2"
            />

            {/* Station Circle */}
            <circle
              r="6"
              fill={statusColors[station.status]}
              stroke={hoveredStation === station.id ? "white" : station.lines.length > 1 ? lineColors[station.lines[0]] : "transparent"}
              strokeWidth="2"
            />

            {/* Station Name */}
            <text
              x="12"
              y="4"
              fontSize="8"
              fill="currentColor"
              className="select-none font-medium"
              textAnchor="start"
            >
              {station.name}
            </text>
          </g>
        ))}

        {/* Magnifying Lens Effect */}
        {lensEnabled && (
          <motion.g
            style={{
              x: mouseX,
              y: mouseY,
            }}
            pointerEvents="none"
          >
            <circle
              r="40"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.5"
            />
          </motion.g>
        )}
        
        {/* Map Legend */}
        <MapLegend 
          lineColors={lineColors}
          statusColors={statusColors}
        />
      </svg>
    </div>
  );
}