"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"

interface Train3D {
  id: string
  trainNumber: string
  position: { x: number; y: number; z: number }
  status: "ready" | "maintenance" | "cleaning" | "standby"
  healthScore: number
  lastMaintenance: string
  nextMaintenance: string
  totalKm: number
  bay: number
}

interface TrainDetailsPanelProps {
  train: Train3D | null
  scenario: string
}

const getStatusInfo = (status: Train3D["status"]) => {
  switch (status) {
    case "ready":
      return { label: "Service Ready", color: "bg-primary text-primary-foreground" }
    case "maintenance":
      return { label: "In Maintenance", color: "bg-destructive text-destructive-foreground" }
    case "cleaning":
      return { label: "Under Cleaning", color: "bg-secondary text-secondary-foreground" }
    case "standby":
      return { label: "Standby", color: "bg-yellow-500 text-white" }
    default:
      return { label: "Unknown", color: "bg-muted text-muted-foreground" }
  }
}
  trainNumber: string
  position: { x: number; y: number; z: number }
  status: "active" | "maintenance" | "standby"
  route: string
  passengers: number
  speed: number
}

interface TrainDetailsPanelProps {
  train: Train3D | null
  isVisible: boolean
  simulationMode: boolean
}

export function TrainDetailsPanel({ train, scenario }: TrainDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<"info" | "maintenance" | "simulation">("info")

  if (!train) {
    return (
      <Card className="h-full flex items-center justify-center p-6 text-muted-foreground">
        <p>Select a train to view details</p>
      </Card>
    )
  }

  const statusInfo = getStatusInfo(train.status)

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Train {train.trainNumber}</h2>
          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">Bay {train.bay}</div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b px-6">
        <div className="flex space-x-6">
          {["info", "maintenance", "simulation"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 overflow-auto">
        {activeTab === "info" && (
          <div className="space-y-6">
            {/* Health Score */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Health</span>
                <span className="font-medium">{train.healthScore}%</span>
              </div>
              <Progress value={train.healthScore} className="h-2" />
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="text-2xl font-bold">{(train.totalKm / 1000).toFixed(1)}k</div>
                <div className="text-sm text-muted-foreground">Total KM</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold">98.5%</div>
                <div className="text-sm text-muted-foreground">Availability</div>
              </Card>
            </div>

            {/* Component Health */}
            <div className="space-y-4">
              <h3 className="font-medium">Component Health</h3>
              <div className="space-y-3">
                {[
                  { name: "Traction Motors", health: 95 },
                  { name: "Brake System", health: 88 },
                  { name: "Door Mechanisms", health: 92 },
                  { name: "HVAC System", health: 85 },
                  { name: "Battery Systems", health: 90 },
                ].map((component) => (
                  <div key={component.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{component.name}</span>
                      <span className="font-medium">{component.health}%</span>
                    </div>
                    <Progress value={component.health} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "maintenance" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span>Last Service</span>
                <span className="text-muted-foreground">{train.lastMaintenance}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Next Service</span>
                <span className="text-muted-foreground">{train.nextMaintenance}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Service Interval</span>
                <span className="text-muted-foreground">30 days</span>
              </div>
            </div>

            <Card className="p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Recent Maintenance</h4>
              <div className="space-y-2 text-sm">
                <p>✓ Full inspection completed</p>
                <p>✓ Brake system maintenance</p>
                <p>✓ Door mechanism calibration</p>
                <p>✓ HVAC system service</p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "simulation" && (
          <div className="space-y-6">
            <Card className="p-4 bg-destructive/10 border-destructive/20">
              <h4 className="font-medium text-destructive mb-2">Impact Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Simulating maintenance delay would affect 3 peak hour services.
              </p>
            </Card>

            <div className="space-y-4">
              <h4 className="font-medium">Alternative Scenarios</h4>
              <div className="space-y-2">
                <Card className="p-3 cursor-pointer hover:bg-muted/50">
                  <div className="font-medium">Reschedule to Night Shift</div>
                  <p className="text-sm text-muted-foreground">No service impact</p>
                </Card>
                <Card className="p-3 cursor-pointer hover:bg-muted/50">
                  <div className="font-medium">Use Backup Train</div>
                  <p className="text-sm text-muted-foreground">15 min preparation needed</p>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
        {labels[status]}
      </Badge>
    )
  }

  const getCapacityColor = (passengers: number) => {
    const percentage = (passengers / 300) * 100
    if (percentage > 80) return "text-destructive"
    if (percentage > 60) return "text-secondary"
    return "text-chart-1"
  }

  return (
    <div
      className={`fixed top-20 right-6 w-80 z-50 transition-all duration-500 ease-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{train.trainNumber}</CardTitle>
            {getStatusBadge(train.status)}
          </div>
          <p className="text-sm text-muted-foreground">{train.route}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Speed</p>
              <p
                className={`text-2xl font-bold transition-all duration-300 ${
                  simulationMode ? "text-accent" : "text-foreground"
                }`}
              >
                {animatedValues.speed} km/h
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Passengers</p>
              <p
                className={`text-2xl font-bold transition-all duration-300 ${getCapacityColor(
                  animatedValues.passengers,
                )}`}
              >
                {animatedValues.passengers}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Capacity</span>
                <span>{Math.round((animatedValues.passengers / 300) * 100)}%</span>
              </div>
              <Progress value={(animatedValues.passengers / 300) * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Position</p>
                <p className="font-medium">
                  {Math.round(train.position.x)}, {Math.round(train.position.y)}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Energy Cost</p>
                <p
                  className={`font-medium transition-all duration-300 ${
                    simulationMode ? "text-accent" : "text-foreground"
                  }`}
                >
                  ${animatedValues.energyCost}/hr
                </p>
              </div>
            </div>
          </div>

          {simulationMode && (
            <>
              <Separator />
              <div className="bg-accent/10 p-3 rounded-lg">
                <p className="text-sm font-medium text-accent mb-1">Simulation Active</p>
                <p className="text-xs text-muted-foreground">
                  Drag the train to simulate position changes and see real-time impact on energy costs.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
