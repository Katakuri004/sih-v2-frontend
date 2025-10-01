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
      setDepotBays((bays) => bays.map((b) => (b.id === 7 ? { ...b, status: "telecom-expired" } : b)));
    } else if (scenario === "cleaning") {
      setDepotBays((bays) => bays.map((b) => (b.id === 5 ? { ...b, status: "cleaning-unavailable" } : b)));
    } else if (scenario === "maintenance") {
      setDepotBays((bays) => bays.map((b) => (b.id === 3 ? { ...b, status: "maintenance" } : b)));
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
    <div className={`space-y-6 transition-all duration-500 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Digital Fleet Shadow</h1>
          <p className="text-muted-foreground mt-1">Interactive 3D visualization and simulation platform</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("top")}
              className={`px-3 py-1.5 rounded ${viewMode === "top" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>
              Top View
            </button>
            <button
              onClick={() => setViewMode("normal")}
              className={`px-3 py-1.5 rounded ${viewMode === "normal" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}>
              Isometric
            </button>
          </div>

          <select
            value={selectedScenario}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleScenarioChange(e.target.value)}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-lg overflow-hidden p-4">
          <Viewer3D
            onTrainSelect={(t) => setSelectedTrain(t)}
            selectedTrain={selectedTrain}
            scenario={selectedScenario === "maintenance" ? "maintenance" : selectedScenario === "cleaning" ? "cleaning" : undefined}
            viewMode={viewMode}
          />
        </div>

        <div className="lg:col-span-1">
          <TrainDetailsPanel train={selectedTrain} scenario={selectedScenario} />
        </div>
      </div>

      {/* Depot layout + controls full-width below */}
      <div className="mt-6 bg-card rounded-lg p-4">
        <h3 className="font-medium mb-2">Depot Layout — 25 Bays</h3>
        <div className="overflow-auto">
          <svg width="100%" viewBox="0 0 260 260">
            {Array.from({ length: 25 }).map((_, idx) => {
              const row = Math.floor(idx / 5);
              const col = idx % 5;
              const x = col * 50 + 10;
              const y = row * 50 + 10;
              const bay = depotBays[idx];
              const fill = bay?.status === "empty" ? "#f8fafc" : bay?.status === "maintenance" ? "#fee2e2" : bay?.status === "cleaning-unavailable" ? "#fff7ed" : bay?.status === "telecom-expired" ? "#fff1f2" : "#ecfccb";
              const isSelected = selectedBayIndex === idx;
              const isHovered = hoveredBayIndex === idx;
              return (
                <g key={idx}>
                  <rect
                    x={x}
                    y={y}
                    width={40}
                    height={30}
                    fill={isSelected ? "#d1fae5" : isHovered ? "#f0f9ff" : fill}
                    stroke={isSelected ? "#059669" : "#cbd5e1"}
                    rx={4}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedBayIndex(idx)}
                    onKeyDown={(e: React.KeyboardEvent<SVGRectElement>) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedBayIndex(idx);
                      }
                    }}
                    onMouseEnter={() => setHoveredBayIndex(idx)}
                    onMouseLeave={() => setHoveredBayIndex(null)}
                  />
                  <text x={x + 6} y={y + 20} fontSize={8} fill="#0f172a">Bay {idx + 1}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-3 flex gap-2">
          <Button onClick={() => applyScenario(selectedScenario)}>Apply Scenario</Button>
          <Button variant="outline" onClick={() => snapshotState("Manual snapshot")}>Snapshot</Button>
          <Button variant="ghost" onClick={() => { setDepotBays((b) => b.map((x) => ({ ...x, status: "empty" }))); snapshotState("Cleared bays"); }}>Clear Bays</Button>
        </div>

        {selectedBayIndex !== null && (
          <div className="mt-4 p-3 border rounded bg-white">
            <h4 className="font-medium">Bay {selectedBayIndex + 1}</h4>
            <p className="text-sm text-muted-foreground">Status: {depotBays[selectedBayIndex].status}</p>
            <div className="mt-2 flex gap-2">
              <Button onClick={() => { setDepotBays((b) => b.map((bay, i) => i === selectedBayIndex ? { ...bay, status: "maintenance" } : bay)); snapshotState(`Assigned maintenance to bay ${selectedBayIndex + 1}`); }}>Assign Maintenance</Button>
              <Button variant="outline" onClick={() => { setDepotBays((b) => b.map((bay, i) => i === selectedBayIndex ? { ...bay, status: "empty" } : bay)); snapshotState(`Released bay ${selectedBayIndex + 1}`); }}>Release Bay</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
