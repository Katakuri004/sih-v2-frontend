"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MapBackground } from "./map-background";
import { type Station, MetroLine, StationStatus, CrowdLevel } from "@/types/metro";

interface SVGAnimateProps extends React.SVGProps<SVGAnimateElement> {
  attributeName?: string;
  from?: string;
  to?: string;
  dur?: string;
  begin?: string;
  repeatCount?: string;
}

interface InteractiveMapProps {
  onStationClick: (station: Station) => void;
  lensEnabled?: boolean;
  stations: Station[];
}

import { metroLines } from "@/types/metro";

const lineColors = {
  Blue: "hsl(var(--metro-blue))",
  AquaLine: "hsl(var(--info))",
  Purple: "hsl(var(--metro-purple))",
} as const;

const statusColors = {
  active: "#22c55e",
  delayed: "#f59e0b",
  maintenance: "#ef4444"
} as const;

const crowdLevelColors = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444"
} as const;

export function InteractiveMap({ onStationClick, lensEnabled = true, stations }: InteractiveMapProps) {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  const opacity = useSpring(0);
  const scale = useSpring(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!lensEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleStationHover = (stationId: string | null) => {
    setHoveredStation(stationId);
    if (stationId) {
      opacity.set(1);
      scale.set(1);
    } else {
      opacity.set(0);
      scale.set(0);
    }
  };

  if (!mounted) {
    return null;
  }

  // Helper function to draw connection lines between stations
  const renderConnections = () => {
    const renderedConnections = new Set<string>();

    return stations.map(station => {
      return station.connections.map(targetId => {
        const connectionId = [station.id, targetId].sort().join("-");
        if (renderedConnections.has(connectionId)) return null;
        renderedConnections.add(connectionId);

        const targetStation = stations.find(s => s.id === targetId);
        if (!targetStation) return null;

        return (
          <line
            key={connectionId}
            x1={station.position.x}
            y1={station.position.y}
            x2={targetStation.position.x}
            y2={targetStation.position.y}
            stroke={lineColors[station.line]}
            strokeWidth="6"
            strokeLinecap="round"
            className="transition-opacity duration-200"
            style={{
              opacity: hoveredStation && ![station.id, targetId].includes(hoveredStation) ? 0.2 : 1
            }}
          />
        );
      });
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="relative w-full h-[800px] bg-gradient-to-br from-amber-50/30 to-yellow-50/50 dark:from-gray-800/80 dark:to-gray-700/60 rounded-lg border overflow-hidden">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 1000"
            className="w-full h-full"
            onMouseMove={handleMouseMove}
            style={{ cursor: "none" }}
          >
            {/* Map Background */}
            <MapBackground />
            
            {/* Connection Lines */}
            <g className="connections">{renderConnections()}</g>

            {/* Stations */}
            {stations.map(station => (
              <g
                key={station.id}
                onMouseEnter={() => handleStationHover(station.id)}
                onMouseLeave={() => handleStationHover(null)}
                onClick={() => onStationClick(station)}
                style={{ cursor: "pointer" }}
                className="station-group"
              >
                {/* Station Circle */}
                <circle
                  cx={station.position.x}
                  cy={station.position.y}
                  r={hoveredStation === station.id ? "12" : "8"}
                  fill={lineColors[station.line]}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-all duration-200"
                  style={{
                    opacity: hoveredStation && hoveredStation !== station.id ? 0.3 : 1
                  }}
                />

                {/* Status Indicator */}
                <circle
                  cx={station.position.x + 15}
                  cy={station.position.y - 15}
                  r="4"
                  fill={statusColors[station.status]}
                  stroke="white"
                  strokeWidth="1"
                  className="transition-opacity duration-200"
                  style={{
                    opacity: hoveredStation === station.id ? 1 : 0
                  }}
                />

                {/* Station Name */}
                <text
                  x={station.position.x}
                  y={station.position.y + 25}
                  textAnchor="middle"
                  className="text-xs font-medium fill-foreground"
                  style={{
                    opacity: hoveredStation === station.id ? 1 : 0,
                    transition: "opacity 0.2s ease"
                  }}
                >
                  {station.name}
                </text>

                {/* Hover Effect */}
                {hoveredStation === station.id && (
                  <motion.g>
                    <circle
                      r="30"
                      fill="none"
                      stroke="white"
                      strokeWidth="1"
                      opacity="0.5"
                      cx={station.position.x}
                      cy={station.position.y}
                    >
                      <animate
                        attributeName="r"
                        from="30"
                        to="40"
                        dur="1.5s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.5"
                        to="0"
                        dur="1.5s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </motion.g>
                )}
              </g>
            ))}

            {/* Lens Effect */}
            {lensEnabled && hoveredStation && (
              <motion.circle
                cx={mousePosition.x}
                cy={mousePosition.y}
                r="100"
                fill="white"
                opacity={0.1}
                style={{
                  opacity,
                  scale
                }}
              />
            )}

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
                rx="8"
                className="dark:fill-gray-800/60"
              />

              {/* Title */}
              <text
                x="15"
                y="20"
                className="text-sm font-bold fill-gray-800 dark:fill-gray-200"
                style={{ fontSize: "14px", fontWeight: "bold" }}
              >
                Metro Lines & Stations
              </text>

              {/* Metro Lines */}
              {metroLines.map((line, index) => (
                <g key={line.id} transform={`translate(0, ${40 + index * 45})`}>
                  <text
                    x="15"
                    y="0"
                    className="text-xs font-bold fill-gray-800 dark:fill-gray-200"
                    style={{ fontSize: "11px" }}
                  >
                    {line.name}
                  </text>
                  <circle
                    cx="25"
                    cy="12"
                    r="4"
                    fill={lineColors[line.id]}
                    stroke="white"
                    strokeWidth="1"
                    opacity={line.status === "operational" ? 1 : 0.6}
                  />
                  <text
                    x="35"
                    y="17"
                    className="text-xs fill-gray-600 dark:fill-gray-400"
                    style={{ fontSize: "11px" }}
                  >
                    {line.status === "operational" ? "Operational" : 
                     line.status === "construction" ? `Under Construction (${line.expectedCompletion})` :
                     `Planned (${line.expectedCompletion})`}
                  </text>
                  <text
                    x="35"
                    y="32"
                    className="text-xs fill-gray-600 dark:fill-gray-400"
                    style={{ fontSize: "11px" }}
                  >
                    {line.length}km • {line.stations} stations
                  </text>
                </g>
              ))}

              {/* Station Status */}
              <text
                x="15"
                y="90"
                className="text-xs font-medium fill-gray-600 dark:fill-gray-400"
                style={{ fontSize: "11px" }}
              >
                Station Status
              </text>
              <circle cx="25" cy="102" r="3" fill={statusColors.active} />
              <text
                x="35"
                y="107"
                className="text-xs fill-gray-800 dark:fill-gray-200"
                style={{ fontSize: "11px" }}
              >
                Active
              </text>
              <circle cx="25" cy="117" r="3" fill={statusColors.delayed} />
              <text
                x="35"
                y="122"
                className="text-xs fill-gray-800 dark:fill-gray-200"
                style={{ fontSize: "11px" }}
              >
                Delayed
              </text>
              <circle cx="25" cy="132" r="3" fill={statusColors.maintenance} />
              <text
                x="35"
                y="137"
                className="text-xs fill-gray-800 dark:fill-gray-200"
                style={{ fontSize: "11px" }}
              >
                Maintenance
              </text>

              {/* Crowd Levels */}
              <text
                x="15"
                y="155"
                className="text-xs font-medium fill-gray-600 dark:fill-gray-400"
                style={{ fontSize: "11px" }}
              >
                Crowd Levels
              </text>
              <circle cx="25" cy="167" r="3" fill={crowdLevelColors.low} />
              <text
                x="35"
                y="172"
                className="text-xs fill-gray-800 dark:fill-gray-200"
                style={{ fontSize: "11px" }}
              >
                Low
              </text>
              <circle cx="25" cy="182" r="3" fill={crowdLevelColors.medium} />
              <text
                x="35"
                y="187"
                className="text-xs fill-gray-800 dark:fill-gray-200"
                style={{ fontSize: "11px" }}
              >
                Medium
              </text>
              <circle cx="25" cy="197" r="3" fill={crowdLevelColors.high} />
              <text
                x="35"
                y="202"
                className="text-xs fill-gray-800 dark:fill-gray-200"
                style={{ fontSize: "11px" }}
              >
                High
              </text>
            </g>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
