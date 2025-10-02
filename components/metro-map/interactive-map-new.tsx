"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize, Minimize } from "lucide-react";
import { MapBackground } from "./map-background";
import {
  type Station,
  MetroLine,
  StationStatus,
  CrowdLevel,
} from "@/types/metro";

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
  maintenance: "#ef4444",
} as const;

const crowdLevelColors = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
} as const;

export function InteractiveMap({
  onStationClick,
  stations,
}: InteractiveMapProps) {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPanOffset, setLastPanOffset] = useState({ x: 0, y: 0 });
  const [isMouseOverMap, setIsMouseOverMap] = useState(false);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStationHover = (stationId: string | null) => {
    setHoveredStation(stationId);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Allow dragging at any zoom level for better UX
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
    setLastPanOffset({ ...panOffset });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = (e.clientX - dragStart.x) * 1.5; // Increased sensitivity
      const deltaY = (e.clientY - dragStart.y) * 1.5; // Increased sensitivity

      setPanOffset({
        x: lastPanOffset.x + deltaX,
        y: lastPanOffset.y + deltaY,
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Touch event handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX,
        y: touch.clientY,
      });
      setLastPanOffset({ ...panOffset });
      e.preventDefault();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;

      setPanOffset({
        x: lastPanOffset.x + deltaX,
        y: lastPanOffset.y + deltaY,
      });
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Always prevent default and stop propagation when scrolling on the map
    e.preventDefault();
    e.stopPropagation();

    // More sensitive zoom with better control
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoomLevel((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleMouseEnterMap = () => {
    setIsMouseOverMap(true);
  };

  const handleMouseLeaveMap = () => {
    setIsMouseOverMap(false);
    // Also stop dragging if mouse leaves the map
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = (e.clientX - dragStart.x) * 1.5; // Increased sensitivity
        const deltaY = (e.clientY - dragStart.y) * 1.5; // Increased sensitivity

        setPanOffset({
          x: lastPanOffset.x + deltaX,
          y: lastPanOffset.y + deltaY,
        });
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaX = (touch.clientX - dragStart.x) * 1.5; // Increased sensitivity
        const deltaY = (touch.clientY - dragStart.y) * 1.5; // Increased sensitivity

        setPanOffset({
          x: lastPanOffset.x + deltaX,
          y: lastPanOffset.y + deltaY,
        });
        e.preventDefault();
      }
    };

    const handleGlobalTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    // Add wheel event listener to the map container
    const handleMapWheel = (e: WheelEvent) => {
      // Only prevent default if mouse is over the map
      if (isMouseOverMap) {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        setZoomLevel((prev) => Math.max(0.5, Math.min(3, prev + delta)));
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Add wheel event listener to map container
    const mapContainer = mapContainerRef.current;
    if (mapContainer) {
      mapContainer.addEventListener("wheel", handleMapWheel, {
        passive: false,
      });
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
      document.addEventListener("touchmove", handleGlobalTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleGlobalTouchEnd);
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("touchend", handleGlobalTouchEnd);
      if (mapContainer) {
        mapContainer.removeEventListener("wheel", handleMapWheel);
      }
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, dragStart, lastPanOffset, isMouseOverMap]);

  if (!mounted) {
    return null;
  }

  // Helper function to draw connection lines between stations
  const renderConnections = () => {
    const renderedConnections = new Set<string>();

    return stations.map((station) => {
      return station.connections.map((targetId) => {
        const connectionId = [station.id, targetId].sort().join("-");
        if (renderedConnections.has(connectionId)) return null;
        renderedConnections.add(connectionId);

        const targetStation = stations.find((s) => s.id === targetId);
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
              opacity:
                hoveredStation &&
                ![station.id, targetId].includes(hoveredStation)
                  ? 0.2
                  : 1,
            }}
          />
        );
      });
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div
          ref={mapContainerRef}
          className={`relative w-full ${
            isFullscreen ? "h-screen" : "h-[600px]"
          } bg-gradient-to-br from-amber-50/30 to-yellow-50/50 dark:from-gray-800/80 dark:to-gray-700/60 rounded-lg border overflow-hidden ${
            isMouseOverMap ? "ring-2 ring-primary/20" : ""
          } transition-all duration-200`}
        >
          {/* Zoom and Fullscreen Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
              className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleFullscreen}
              className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
            {zoomLevel !== 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetView}
                className="bg-background/80 backdrop-blur-sm hover:bg-background/90 text-xs px-2"
                title="Reset View"
              >
                Reset
              </Button>
            )}
          </div>

          {/* Zoom Level Indicator */}
          {zoomLevel !== 1 && (
            <div className="absolute bottom-4 right-4 z-10 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-md border text-sm font-medium">
              {Math.round(zoomLevel * 100)}%
            </div>
          )}

          {/* Scroll to Zoom Indicator */}
          {isMouseOverMap && (
            <div className="absolute bottom-4 left-4 z-10 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-md border text-xs text-muted-foreground">
              Scroll to zoom
            </div>
          )}

          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 800 1000"
            className={`w-full h-full ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            } select-none`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnterMap}
            onMouseLeave={handleMouseLeaveMap}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              touchAction: "none",
              pointerEvents: "all",
            }}
          >
            <g
              transform={`translate(${panOffset.x / zoomLevel}, ${
                panOffset.y / zoomLevel
              }) scale(${zoomLevel})`}
              style={{ transformOrigin: "center" }}
            >
              {/* Map Background */}
              <MapBackground />

              {/* Connection Lines */}
              <g className="connections">{renderConnections()}</g>

              {/* Stations */}
              {stations.map((station) => (
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
                      opacity:
                        hoveredStation && hoveredStation !== station.id
                          ? 0.3
                          : 1,
                    }}
                  />

                  {/* Crowd Level Indicator - Always Visible */}
                  <circle
                    cx={station.position.x + 15}
                    cy={station.position.y - 15}
                    r="6"
                    fill={crowdLevelColors[station.crowdLevel]}
                    stroke="white"
                    strokeWidth="2"
                    className="transition-all duration-200"
                    style={{
                      opacity:
                        hoveredStation && hoveredStation !== station.id
                          ? 0.3
                          : 1,
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
                      transition: "opacity 0.2s ease",
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
                        stroke="currentColor"
                        strokeWidth="2"
                        opacity="0.8"
                        cx={station.position.x}
                        cy={station.position.y}
                        className="stroke-gray-800 dark:stroke-white"
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
                          from="0.8"
                          to="0.2"
                          dur="1.5s"
                          begin="0s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </motion.g>
                  )}
                </g>
              ))}

              {/* Legend */}
              <g transform="translate(30, 30)">
                <rect
                  x="0"
                  y="0"
                  width="300"
                  height="400"
                  fill="white"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                  rx="12"
                  className="dark:fill-gray-800/90"
                  opacity="0.95"
                />

                {/* Title */}
                <text
                  x="20"
                  y="30"
                  className="text-sm font-bold fill-gray-800 dark:fill-gray-200"
                  style={{ fontSize: "16px", fontWeight: "bold" }}
                >
                  Metro Lines & Stations
                </text>

                {/* Metro Lines Section */}
                <g transform="translate(0, 50)">
                  {metroLines.map((line, index) => (
                    <g key={line.id} transform={`translate(0, ${index * 70})`}>
                      {/* Line Header */}
                      <text
                        x="20"
                        y="15"
                        className="text-sm font-semibold fill-gray-800 dark:fill-gray-200"
                        style={{ fontSize: "13px", fontWeight: "600" }}
                      >
                        {line.name}
                      </text>

                      {/* Line Indicator */}
                      <g transform="translate(20, 25)">
                        <circle
                          cx="8"
                          cy="0"
                          r="6"
                          fill={lineColors[line.id]}
                          stroke="white"
                          strokeWidth="2"
                          opacity={line.status === "operational" ? 1 : 0.6}
                        />
                        <text
                          x="20"
                          y="5"
                          className="text-xs fill-gray-600 dark:fill-gray-400"
                          style={{ fontSize: "11px" }}
                        >
                          {line.status === "operational"
                            ? "Operational"
                            : line.status === "construction"
                            ? `Under Construction (${line.expectedCompletion})`
                            : `Planned (${line.expectedCompletion})`}
                        </text>
                      </g>

                      {/* Line Stats */}
                      <text
                        x="20"
                        y="50"
                        className="text-xs fill-gray-500 dark:fill-gray-400"
                        style={{ fontSize: "10px" }}
                      >
                        {line.length}km • {line.stations} stations
                      </text>
                    </g>
                  ))}
                </g>

                {/* Station Status Section */}
                <g transform="translate(0, 270)">
                  <text
                    x="20"
                    y="0"
                    className="text-sm font-semibold fill-gray-700 dark:fill-gray-300"
                    style={{ fontSize: "13px", fontWeight: "600" }}
                  >
                    Station Status
                  </text>

                  <g transform="translate(20, 15)">
                    <circle cx="8" cy="5" r="5" fill={statusColors.active} />
                    <text
                      x="20"
                      y="9"
                      className="text-xs fill-gray-800 dark:fill-gray-200"
                      style={{ fontSize: "11px" }}
                    >
                      Active
                    </text>
                  </g>

                  <g transform="translate(20, 35)">
                    <circle cx="8" cy="5" r="5" fill={statusColors.delayed} />
                    <text
                      x="20"
                      y="9"
                      className="text-xs fill-gray-800 dark:fill-gray-200"
                      style={{ fontSize: "11px" }}
                    >
                      Delayed
                    </text>
                  </g>

                  <g transform="translate(20, 55)">
                    <circle
                      cx="8"
                      cy="5"
                      r="5"
                      fill={statusColors.maintenance}
                    />
                    <text
                      x="20"
                      y="9"
                      className="text-xs fill-gray-800 dark:fill-gray-200"
                      style={{ fontSize: "11px" }}
                    >
                      Maintenance
                    </text>
                  </g>
                </g>

                {/* Crowd Levels Section */}
                <g transform="translate(150, 270)">
                  <text
                    x="0"
                    y="0"
                    className="text-sm font-semibold fill-gray-700 dark:fill-gray-300"
                    style={{ fontSize: "13px", fontWeight: "600" }}
                  >
                    Crowd Levels
                  </text>

                  <g transform="translate(0, 15)">
                    <circle cx="8" cy="5" r="5" fill={crowdLevelColors.low} />
                    <text
                      x="20"
                      y="9"
                      className="text-xs fill-gray-800 dark:fill-gray-200"
                      style={{ fontSize: "11px" }}
                    >
                      Low
                    </text>
                  </g>

                  <g transform="translate(0, 35)">
                    <circle
                      cx="8"
                      cy="5"
                      r="5"
                      fill={crowdLevelColors.medium}
                    />
                    <text
                      x="20"
                      y="9"
                      className="text-xs fill-gray-800 dark:fill-gray-200"
                      style={{ fontSize: "11px" }}
                    >
                      Medium
                    </text>
                  </g>

                  <g transform="translate(0, 55)">
                    <circle cx="8" cy="5" r="5" fill={crowdLevelColors.high} />
                    <text
                      x="20"
                      y="9"
                      className="text-xs fill-gray-800 dark:fill-gray-200"
                      style={{ fontSize: "11px" }}
                    >
                      High
                    </text>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
