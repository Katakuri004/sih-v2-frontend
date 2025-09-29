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
  const [simulationMode, setSimulationMode] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const handleSimulationToggle = (enabled: boolean) => {
    setSimulationMode(enabled)
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

        <div className="flex items-center space-x-2">
          <Switch id="simulation-mode" checked={simulationMode} onCheckedChange={handleSimulationToggle} />
          <Label htmlFor="simulation-mode" className="text-sm font-medium">
            What-If Simulation Mode
          </Label>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          {simulationMode
            ? "Click and drag trains to simulate position changes. Watch real-time updates in energy costs and operational metrics."
            : "Click on any train to view detailed information. Enable simulation mode to interact with train positions."}
        </p>
      </div>

      {/* 3D Viewer */}
      <div className="relative">
        <Viewer3D onTrainSelect={setSelectedTrain} selectedTrain={selectedTrain} simulationMode={simulationMode} />

        <TrainDetailsPanel train={selectedTrain} isVisible={!!selectedTrain} simulationMode={simulationMode} />
      </div>

      {/* Legend */}
      <div className="flex gap-6 p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-chart-1 rounded"></div>
          <span className="text-sm">Active Service</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-destructive rounded"></div>
          <span className="text-sm">Maintenance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-chart-2 rounded"></div>
          <span className="text-sm">Standby</span>
        </div>
      </div>
    </div>
  )
}
