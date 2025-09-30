"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Viewer3D } from "./3d-viewer"
import { TrainDetailsPanel } from "./train-details-panel"
import { useState, useEffect } from "react"

interface Train3D {
  id: string
  trainNumber: string
  position: { x: number; y: number; z: number }
  status: "active" | "maintenance" | "standby"
  route: string
  passengers: number
  speed: number
}

export default function DigitalFleetShadow() {
  const [selectedTrain, setSelectedTrain] = useState<Train3D | null>(null)
  const [selectedScenario, setSelectedScenario] = useState("normal")
  const [isVisible, setIsVisible] = useState(false)
  const [viewMode, setViewMode] = useState<"top" | "isometric">("isometric")
  const [playingRollout, setPlayingRollout] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const handleScenarioChange = (scenario: string) => {
    setSelectedScenario(scenario)
    // Reset train selection when scenario changes
    setSelectedTrain(null)
    if (!enabled) {
      setSelectedTrain(null)
    }
  }

  return (
    <div className={`space-y-6 transition-all duration-500 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Digital Fleet Shadow</h1>
          <p className="text-muted-foreground mt-1">Interactive 3D visualization and simulation platform</p>
        </div>

        {/* Scenario Selector */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("top")}
              className={`px-3 py-1.5 rounded ${
                viewMode === "top" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
              }`}
            >
              Top View
            </button>
            <button
              onClick={() => setViewMode("isometric")}
              className={`px-3 py-1.5 rounded ${
                viewMode === "isometric" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
              }`}
            >
              Isometric
            </button>
          </div>
          <select
            value={selectedScenario}
            onChange={(e) => handleScenarioChange(e.target.value)}
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D Viewer */}
        <div className="lg:col-span-3 bg-card rounded-lg overflow-hidden">
          <Viewer3D
            onTrainSelect={setSelectedTrain}
            selectedTrain={selectedTrain}
            scenario={selectedScenario}
            viewMode={viewMode}
          />
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          <TrainDetailsPanel train={selectedTrain} scenario={selectedScenario} />
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="bg-card p-4 rounded-lg border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Morning Rollout Schedule</h3>
          <button
            onClick={() => setPlayingRollout(!playingRollout)}
            className={`px-4 py-2 rounded ${
              playingRollout ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
            }`}
          >
            {playingRollout ? "Stop" : "Play Animation"}
          </button>
        </div>
        
        {/* Timeline */}
        <div className="space-y-2">
          <div className="h-2 bg-muted rounded-full relative">
            <div
              className="absolute h-full bg-primary rounded-full transition-all"
              style={{ width: playingRollout ? "100%" : "0%", transitionDuration: playingRollout ? "30s" : "0s" }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>21:00</span>
            <span>22:00</span>
            <span>23:00</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded-full"></div>
          <span className="text-sm">Service Ready</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-destructive rounded-full"></div>
          <span className="text-sm">In Maintenance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-secondary rounded-full"></div>
          <span className="text-sm">Under Cleaning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span className="text-sm">Standby/Caution</span>
        </div>
      </div>
    </div>
  )
}
