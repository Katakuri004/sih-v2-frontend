"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Viewer3D } from "./3d-viewer";
import { TrainDetailsPanel } from "./train-details-panel";
import { Train3D } from "./types";

export default function DigitalFleetShadow() {
  const [selectedTrain, setSelectedTrain] = useState<Train3D | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>("normal");
  const [isVisible, setIsVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"normal" | "top">("normal");
  const [playingRollout, setPlayingRollout] = useState(false);

  const [depotBays, setDepotBays] = useState(() => {
    const bays: { id: number; trainId?: string; status: string }[] = [];
    for (let i = 1; i <= 25; i++) bays.push({ id: i, status: "empty" });
    return bays;
  });

  const [selectedBayIndex, setSelectedBayIndex] = useState<number | null>(null);
  const [hoveredBayIndex, setHoveredBayIndex] = useState<number | null>(null);
  const [depotScenario, setDepotScenario] = useState<string>("normal");
  const [history, setHistory] = useState<{ ts: number; state: any }[]>(() => {
    try {
      const raw = localStorage.getItem("depot-history");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("depot-history", JSON.stringify(history));
    } catch {}
  }, [history]);

  const handleScenarioChange = (scenario: string) => {
    setSelectedScenario(scenario);
    setSelectedTrain(null);
  };

  function snapshotState(note?: string) {
    const snap = { depotBays, selectedScenario, note };
    const entry = { ts: Date.now(), state: snap };
    setHistory((h) => [entry, ...h].slice(0, 20));
  }

  function applyScenario(scenario: string) {
    if (scenario === "telecom") {
      setDepotBays((bays) =>
        bays.map((b) => (b.id === 7 ? { ...b, status: "telecom-expired" } : b))
      );
    } else if (scenario === "cleaning") {
      setDepotBays((bays) =>
        bays.map((b) =>
          b.id === 5 ? { ...b, status: "cleaning-unavailable" } : b
        )
      );
    } else if (scenario === "maintenance") {
      setDepotBays((bays) =>
        bays.map((b) => (b.id === 3 ? { ...b, status: "maintenance" } : b))
      );
    }
    snapshotState(`Applied ${scenario}`);
  }

  function rollbackTo(ts: number) {
    const e = history.find((h) => h.ts === ts);
    if (!e) return;
    setDepotBays(e.state.depotBays);
    setSelectedScenario(e.state.selectedScenario);
    snapshotState(`Rollback to ${new Date(ts).toLocaleString()}`);
  }

  return (
    <div
      className={`space-y-6 transition-all duration-500 ${
        isVisible ? "animate-fade-in" : "opacity-0"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Digital Fleet Shadow
          </h1>
          <p className="text-muted-foreground mt-1">
            Interactive 3D visualization and simulation platform
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("top")}
              className={`px-3 py-1.5 rounded ${
                viewMode === "top"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-muted"
              }`}
            >
              Top View
            </button>
            <button
              onClick={() => setViewMode("normal")}
              className={`px-3 py-1.5 rounded ${
                viewMode === "normal"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-muted"
              }`}
            >
              Isometric
            </button>
          </div>

          <select
            value={selectedScenario}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleScenarioChange(e.target.value)
            }
            className="bg-card border rounded px-3 py-1.5"
          >
            <option value="normal">Normal Operations</option>
            <option value="maintenance">Trainset 07 Maintenance</option>
            <option value="cleaning">Cleaning Bay Unavailable</option>
            <option value="telecom">Telecom Clearance Expiry</option>
            <option value="peak">Peak Hour Adjustment</option>
          </select>
        </div>
      </div>

      {/* Main two-column area: Viewer + Train details */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-7 bg-card rounded-lg overflow-hidden p-2 h-[700px] border border-border flex items-center justify-center">
          <Viewer3D
            onTrainSelect={(t) => setSelectedTrain(t)}
            selectedTrain={selectedTrain}
            scenario={
              selectedScenario === "maintenance"
                ? "maintenance"
                : selectedScenario === "cleaning"
                ? "cleaning"
                : undefined
            }
            viewMode={viewMode}
          />
        </div>

        <div className="lg:col-span-3 h-[700px] border border-border rounded-lg">
          <TrainDetailsPanel
            train={selectedTrain}
            scenario={selectedScenario}
          />
        </div>
      </div>

      {/* Depot layout + controls horizontal layout */}
      <div className="mt-6 bg-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Depot Layout — 25 Bays</h3>
          <select
            value={depotScenario}
            onChange={(e) => setDepotScenario(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm min-w-[200px]"
          >
            <option value="normal">Normal Operations</option>
            <option value="maintenance">Trainset 07 Maintenance</option>
            <option value="cleaning">Cleaning Bay Unavailable</option>
            <option value="telecom">Telecom Clearance Expiry</option>
            <option value="peak">Peak Hour Adjustment</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Bays Section - 70% width */}
          <div className="lg:col-span-7">
            <div className="bg-muted/20 rounded-lg p-6 border border-border">
              <svg width="100%" viewBox="0 0 450 300" className="h-96">
                {Array.from({ length: 25 }).map((_, idx) => {
                  const row = Math.floor(idx / 5);
                  const col = idx % 5;
                  const x = col * 85 + 10;
                  const y = row * 55 + 10;
                  const bay = depotBays[idx];
                  const fill =
                    bay?.status === "empty"
                      ? "#f1f5f9"
                      : bay?.status === "maintenance"
                      ? "#dc2626"
                      : bay?.status === "cleaning-unavailable"
                      ? "#f59e0b"
                      : bay?.status === "telecom-expired"
                      ? "#8b5cf6"
                      : bay?.status === "occupied"
                      ? "#22c55e"
                      : "#ecfccb";
                  const isSelected = selectedBayIndex === idx;
                  const isHovered = hoveredBayIndex === idx;
                  return (
                    <g key={idx}>
                      <rect
                        x={x}
                        y={y}
                        width={70}
                        height={45}
                        fill={isHovered && !isSelected ? "#f0f9ff" : fill}
                        stroke={isSelected ? "#059669" : "#cbd5e1"}
                        strokeWidth={isSelected ? 3 : 2}
                        rx={6}
                        className="cursor-pointer"
                        onClick={() => setSelectedBayIndex(idx)}
                        onMouseEnter={() => setHoveredBayIndex(idx)}
                        onMouseLeave={() => setHoveredBayIndex(null)}
                      />
                      <text
                        x={x + 35}
                        y={y + 28}
                        fontSize={12}
                        fill="#0f172a"
                        textAnchor="middle"
                        className="pointer-events-none font-medium"
                      >
                        {idx + 1}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border-2"
                    style={{
                      backgroundColor: "#f1f5f9",
                      borderColor: "#64748b",
                    }}
                  />
                  <span className="font-medium">Empty</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border-2"
                    style={{
                      backgroundColor: "#dc2626",
                      borderColor: "#991b1b",
                    }}
                  />
                  <span className="font-medium">Maintenance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border-2"
                    style={{
                      backgroundColor: "#f59e0b",
                      borderColor: "#d97706",
                    }}
                  />
                  <span className="font-medium">Cleaning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border-2"
                    style={{
                      backgroundColor: "#8b5cf6",
                      borderColor: "#7c3aed",
                    }}
                  />
                  <span className="font-medium">Telecom Issue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border-2"
                    style={{
                      backgroundColor: "#22c55e",
                      borderColor: "#16a34a",
                    }}
                  />
                  <span className="font-medium">Occupied</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Section - 30% width */}
          <div className="lg:col-span-3">
            <div className="h-96 flex flex-col">
              {/* Action Buttons */}
              <div className="bg-muted/20 rounded-lg p-4 border border-border mb-4">
                <h4 className="font-medium mb-3">Actions</h4>
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      if (selectedBayIndex !== null) {
                        setDepotBays((prev) => {
                          const updated = [...prev];
                          let newStatus = "empty";

                          // Map depot scenario to bay status
                          switch (depotScenario) {
                            case "maintenance":
                              newStatus = "maintenance";
                              break;
                            case "cleaning":
                              newStatus = "cleaning-unavailable";
                              break;
                            case "telecom":
                              newStatus = "telecom-expired";
                              break;
                            case "peak":
                              newStatus = "occupied";
                              break;
                            case "normal":
                            default:
                              newStatus = "empty";
                              break;
                          }

                          updated[selectedBayIndex] = {
                            ...updated[selectedBayIndex],
                            status: newStatus,
                          };
                          return updated;
                        });
                        snapshotState(
                          `Applied ${depotScenario} to Bay ${
                            selectedBayIndex + 1
                          }`
                        );
                      }
                    }}
                    className="w-full"
                    disabled={selectedBayIndex === null}
                  >
                    Apply Scenario
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => snapshotState("Manual snapshot")}
                    className="w-full"
                  >
                    Snapshot
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setDepotBays((b) =>
                        b.map((x) => ({ ...x, status: "empty" }))
                      );
                      setSelectedBayIndex(null);
                      snapshotState("Cleared bays");
                    }}
                    className="w-full"
                  >
                    Clear Bays
                  </Button>
                </div>
              </div>

              {/* Selected Bay Info */}
              {selectedBayIndex !== null ? (
                <div className="bg-muted/20 rounded-lg p-4 border border-border flex-1">
                  <h4 className="font-medium mb-3">
                    Bay {selectedBayIndex + 1}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Current Status:
                      </span>
                      <div className="font-medium capitalize mt-1">
                        {depotBays[selectedBayIndex].status.replace("-", " ")}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Selected Scenario:
                      </span>
                      <div className="font-medium capitalize mt-1">
                        {depotScenario.replace("-", " ")}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        className="w-full bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700 dark:hover:bg-orange-900/50"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDepotBays((b) =>
                            b.map((bay, i) =>
                              i === selectedBayIndex
                                ? { ...bay, status: "maintenance" }
                                : bay
                            )
                          );
                          snapshotState(
                            `Assigned maintenance to bay ${
                              selectedBayIndex + 1
                            }`
                          );
                        }}
                      >
                        Assign Maintenance
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setDepotBays((b) =>
                            b.map((bay, i) =>
                              i === selectedBayIndex
                                ? { ...bay, status: "empty" }
                                : bay
                            )
                          );
                          snapshotState(`Released bay ${selectedBayIndex + 1}`);
                        }}
                      >
                        Release Bay
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/20 rounded-lg p-4 border border-border flex-1">
                  <h4 className="font-medium mb-2">Bay Status</h4>
                  <p className="text-sm text-muted-foreground">
                    Click on a bay to view details and perform actions
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
