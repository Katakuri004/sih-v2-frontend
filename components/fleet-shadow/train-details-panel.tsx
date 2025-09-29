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

export function TrainDetailsPanel({ train, isVisible, simulationMode }: TrainDetailsPanelProps) {
  const [animatedValues, setAnimatedValues] = useState({
    passengers: 0,
    speed: 0,
    energyCost: 0,
  })

  useEffect(() => {
    if (!train) return

    const animateValue = (target: number, key: keyof typeof animatedValues) => {
      let current = animatedValues[key]
      const increment = (target - current) / 20

      const interval = setInterval(() => {
        current += increment
        if (Math.abs(current - target) < Math.abs(increment)) {
          current = target
          clearInterval(interval)
        }
        setAnimatedValues((prev) => ({ ...prev, [key]: Math.round(current) }))
      }, 50)
    }

    animateValue(train.passengers, "passengers")
    animateValue(train.speed, "speed")
    animateValue(train.passengers * 0.15 + train.speed * 0.8, "energyCost")
  }, [train])

  if (!train) return null

  const getStatusBadge = (status: Train3D["status"]) => {
    const variants = {
      active: "default",
      maintenance: "destructive",
      standby: "secondary",
    } as const

    const labels = {
      active: "Active",
      maintenance: "Maintenance",
      standby: "Standby",
    }

    return (
      <Badge variant={variants[status]} className="font-medium">
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
