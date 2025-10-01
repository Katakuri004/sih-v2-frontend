"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { kochiMetroStations } from "@/components/metro-map/interactive-map"
import { TrendingUp } from "lucide-react"

interface HeatmapData {
  stationId: string
  stationName: string
  line: "blue" | "green"
  crowdLevel: number // 0-100
  trend: "increasing" | "decreasing" | "stable"
  peakTime: string
  avgWaitTime: number
}

const generateHeatmapData = (): HeatmapData[] => {
  return kochiMetroStations.map((station) => ({
    stationId: station.id,
    stationName: station.name,
    line: station.line,
    crowdLevel: Math.floor(Math.random() * 100),
    trend: ["increasing", "decreasing", "stable"][Math.floor(Math.random() * 3)] as
      | "increasing"
      | "decreasing"
      | "stable",
    peakTime: `${Math.floor(Math.random() * 4) + 17}:${Math.floor(Math.random() * 6) * 10}`,
    avgWaitTime: Math.floor(Math.random() * 8) + 2,
  }))
}

export function CrowdHeatmap() {
  const heatmapData = generateHeatmapData()

  const getCrowdColor = (level: number) => {
    if (level < 30) return "bg-success/20 text-success border-success/30"
    if (level < 60) return "bg-warning/20 text-warning border-warning/30"
    return "bg-destructive/20 text-destructive border-destructive/30"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "↗"
      case "decreasing":
        return "↘"
      default:
        return "→"
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "text-destructive"
      case "decreasing":
        return "text-success"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          System-wide Crowd Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Blue Line */}
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--metro-blue))]" />
              Blue Line
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {heatmapData
                .filter((station) => station.line === "blue")
                .map((station) => (
                  <div key={station.stationId} className={`p-3 rounded-lg border ${getCrowdColor(station.crowdLevel)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{station.stationName}</span>
                      <span className={`text-sm ${getTrendColor(station.trend)}`}>{getTrendIcon(station.trend)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>{station.crowdLevel}% capacity</span>
                      <span>{station.avgWaitTime}min wait</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Green Line */}
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--metro-green))]" />
              Green Line
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {heatmapData
                .filter((station) => station.line === "green")
                .map((station) => (
                  <div key={station.stationId} className={`p-3 rounded-lg border ${getCrowdColor(station.crowdLevel)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{station.stationName}</span>
                      <span className={`text-sm ${getTrendColor(station.trend)}`}>{getTrendIcon(station.trend)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>{station.crowdLevel}% capacity</span>
                      <span>{station.avgWaitTime}min wait</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-success/20 border border-success/30" />
              <span className="text-xs text-muted-foreground">Low (0-30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-warning/20 border border-warning/30" />
              <span className="text-xs text-muted-foreground">Medium (30-60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-destructive/20 border border-destructive/30" />
              <span className="text-xs text-muted-foreground">High (60%+)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
