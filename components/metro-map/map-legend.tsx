"use client";

import * as React from "react";
import { metroLines, type MetroLine } from "@/types/metro";

interface MapLegendProps {
  lineColors: Record<MetroLine, string>;
  statusColors: Record<string, string>;
}

export function MapLegend({ lineColors, statusColors }: MapLegendProps) {
  return (
    <g transform="translate(20, 20)">
      {/* Semi-transparent background for better readability */}
      <rect
        x="-10"
        y="-10"
        width="320"
        height={220 + metroLines.length * 45}
        fill="white"
        className="dark:fill-gray-800"
        opacity="0.95"
        rx="12"
      />
      {/* Main legend box */}
      <rect
        x="0"
        y="0"
        width="300"
        height={200 + metroLines.length * 45}
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="2"
        rx="8"
        className="dark:fill-gray-800/80"
      />

      {/* Title */}
      <text
        x="20"
        y="35"
        className="fill-gray-800 dark:fill-gray-100"
        style={{ fontSize: "16px", fontWeight: "bold" }}
      >
        Kochi Metro Map
      </text>

      {/* Metro Lines */}
      {metroLines.map((line, index) => (
        <g key={line.id} transform={`translate(0, ${70 + index * 50})`}>
          {/* Line name with colored background */}
          <rect
            x="20"
            y="-15"
            width="260"
            height="40"
            rx="4"
            fill={lineColors[line.id]}
            opacity="0.1"
            className="dark:opacity-20"
          />
          <text
            x="20"
            y="0"
            className="font-semibold fill-gray-900 dark:fill-gray-100"
            style={{ fontSize: "14px" }}
          >
            {line.name}
          </text>
          {/* Line indicator */}
          <line
            x1="20"
            y1="10"
            x2="50"
            y2="10"
            stroke={lineColors[line.id]}
            strokeWidth="3"
            opacity={line.status === "operational" ? 1 : 0.6}
          />
          <circle
            cx="35"
            cy="10"
            r="4"
            fill={lineColors[line.id]}
            stroke="white"
            strokeWidth="1.5"
          />
          {/* Status text */}
          <text
            x="60"
            y="14"
            className="fill-gray-700 dark:fill-gray-300"
            style={{ fontSize: "13px" }}
          >
            {line.status === "operational" ? "Operational" : 
             line.status === "construction" ? `Under Construction (${line.expectedCompletion})` :
             `Planned (${line.expectedCompletion})`}
          </text>
          {/* Stats text */}
          <text
            x="20"
            y="32"
            className="fill-gray-600 dark:fill-gray-400"
            style={{ fontSize: "13px" }}
          >
            {line.length}km • {line.stations} stations
          </text>
        </g>
      ))}

      {/* Station Status */}
      <g transform={`translate(0, ${80 + metroLines.length * 50})`}>
        {/* Section title with background */}
        <rect
          x="20"
          y="-5"
          width="260"
          height="80"
          rx="4"
          fill="#f3f4f6"
          className="dark:fill-gray-700/30"
        />
        <text
          x="20"
          y="15"
          className="font-semibold fill-gray-800 dark:fill-gray-100"
          style={{ fontSize: "14px" }}
        >
          Station Status
        </text>
        {/* Status indicators */}
        <g transform="translate(30, 30)">
          <circle cx="0" cy="0" r="4" fill={statusColors.active} />
          <text
            x="15"
            y="5"
            className="fill-gray-700 dark:fill-gray-300"
            style={{ fontSize: "13px" }}
          >
            Operational
          </text>
          
          <circle cx="120" cy="0" r="4" fill={statusColors.delayed} />
          <text
            x="135"
            y="5"
            className="fill-gray-700 dark:fill-gray-300"
            style={{ fontSize: "13px" }}
          >
            Under Construction
          </text>
          
          <circle cx="0" cy="25" r="4" fill={statusColors.maintenance} />
          <text
            x="15"
            y="30"
            className="fill-gray-700 dark:fill-gray-300"
            style={{ fontSize: "13px" }}
          >
            Planned
          </text>
        </g>
      </g>
    </g>
  );
}