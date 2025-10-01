"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Users, Clock, Train, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import type { Station } from "./interactive-map"

interface StationDetailTabsProps {
  station: Station
}

// Mock data for crowd trends
const crowdTrendData = [
  { time: "06:00", passengers: 45, predicted: 52 },
  { time: "07:00", passengers: 120, predicted: 115 },
  { time: "08:00", passengers: 280, predicted: 290 },
  { time: "09:00", passengers: 350, predicted: 340 },
  { time: "10:00", passengers: 220, predicted: 230 },
  { time: "11:00", passengers: 180, predicted: 175 },
  { time: "12:00", passengers: 240, predicted: 250 },
  { time: "13:00", passengers: 290, predicted: 285 },
  { time: "14:00", passengers: 260, predicted: 270 },
  { time: "15:00", passengers: 200, predicted: 195 },
  { time: "16:00", passengers: 180, predicted: 185 },
  { time: "17:00", passengers: 320, predicted: 330 },
  { time: "18:00", passengers: 380, predicted: 375 },
  { time: "19:00", passengers: 290, predicted: 295 },
  { time: "20:00", passengers: 180, predicted: 175 },
  { time: "21:00", passengers: 120, predicted: 125 },
  { time: "22:00", passengers: 80, predicted: 85 },
]

const weeklyTrendData = [
  { day: "Mon", passengers: 4200, predicted: 4150 },
  { day: "Tue", passengers: 4500, predicted: 4480 },
  { day: "Wed", passengers: 4300, predicted: 4320 },
  { day: "Thu", passengers: 4600, predicted: 4580 },
  { day: "Fri", passengers: 5200, predicted: 5180 },
  { day: "Sat", passengers: 3800, predicted: 3850 },
  { day: "Sun", passengers: 2900, predicted: 2920 },
]

export function StationDetailTabs({ station }: StationDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getCurrentCrowdData = () => {
    const baseCount = station.crowdLevel === "low" ? 142 : station.crowdLevel === "medium" ? 287 : 456
    return {
      current: baseCount,
      capacity: 600,
      percentage: Math.round((baseCount / 600) * 100),
      waitingOnPlatform: Math.round(baseCount * 0.3),
      inTransit: Math.round(baseCount * 0.7),
    }
  }

  const getUpcomingTrains = () => [
    {
      id: station.nextTrain,
      destination: station.line === "blue" ? "Ernakulam South" : "Elamkulam",
      arrival: "2 min",
      status: station.trainStatus,
      crowdLevel: "medium",
      cars: 3,
    },
    {
      id: `M${Number.parseInt(station.nextTrain.slice(1)) + 1}`,
      destination: station.line === "blue" ? "Aluva" : "Thykoodam",
      arrival: "8 min",
      status: "on-time",
      crowdLevel: "low",
      cars: 3,
    },
    {
      id: `M${Number.parseInt(station.nextTrain.slice(1)) + 2}`,
      destination: station.line === "blue" ? "Ernakulam South" : "Elamkulam",
      arrival: "15 min",
      status: "on-time",
      crowdLevel: "high",
      cars: 3,
    },
  ]

  const crowdData = getCurrentCrowdData()
  const upcomingTrains = getUpcomingTrains()

  const getCrowdBadgeVariant = (level: string) => {
    switch (level) {
      case "low":
        return "default"
      case "medium":
        return "secondary"
      case "high":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-time":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "delayed":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "approaching":
        return <Train className="h-4 w-4 text-info" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Train className="h-5 w-5" />
            {station.name} Station
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant={station.line === "blue" ? "default" : "secondary"}>
              {station.line === "blue" ? "Blue Line" : "Green Line"}
            </Badge>
            <Badge variant={getCrowdBadgeVariant(station.crowdLevel)}>{station.crowdLevel} crowd</Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="arrivals">Arrivals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Current Crowd
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">{crowdData.current} people</div>
                <Progress value={crowdData.percentage} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{crowdData.percentage}% of capacity</span>
                  <span>{crowdData.capacity} max</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="text-sm text-muted-foreground">On Platform</div>
                    <div className="text-lg font-semibold">{crowdData.waitingOnPlatform}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">In Transit</div>
                    <div className="text-lg font-semibold">{crowdData.inTransit}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  Next Train
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{upcomingTrains[0].arrival}</div>
                    <div className="text-sm text-muted-foreground">Train {upcomingTrains[0].id}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(upcomingTrains[0].status)}
                      <span className="text-sm capitalize">{upcomingTrains[0].status}</span>
                    </div>
                    <Badge variant={getCrowdBadgeVariant(upcomingTrains[0].crowdLevel)} className="text-xs">
                      {upcomingTrains[0].crowdLevel} crowd
                    </Badge>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-sm text-muted-foreground">Destination</div>
                  <div className="font-medium">{upcomingTrains[0].destination}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Station Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.2k</div>
                  <div className="text-sm text-muted-foreground">Daily Average</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">94%</div>
                  <div className="text-sm text-muted-foreground">On-Time Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-info">2.3</div>
                  <div className="text-sm text-muted-foreground">Avg Wait (min)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">12</div>
                  <div className="text-sm text-muted-foreground">Peak Hour</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Crowd Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={crowdTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="passengers"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Actual"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Passenger Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="passengers" fill="hsl(var(--primary))" name="Passengers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI Crowd Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={crowdTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="passengers"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Actual"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">+15%</div>
                <p className="text-sm text-muted-foreground">Expected increase in crowd density</p>
                <Badge variant="secondary" className="mt-2">
                  Rush Hour Approaching
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Peak Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">18:30</div>
                <p className="text-sm text-muted-foreground">Predicted peak crowd time today</p>
                <Badge variant="destructive" className="mt-2">
                  High Density
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">16:45</div>
                <p className="text-sm text-muted-foreground">Best time to travel (low crowd)</p>
                <Badge variant="default" className="mt-2">
                  Optimal Window
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="arrivals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Train className="h-5 w-5" />
                Upcoming Trains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTrains.map((train, index) => (
                  <div
                    key={train.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      index === 0 ? "bg-primary/5 border-primary/20" : "bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">{train.arrival}</div>
                        <div className="text-xs text-muted-foreground">ETA</div>
                      </div>
                      <div>
                        <div className="font-semibold">Train {train.id}</div>
                        <div className="text-sm text-muted-foreground">→ {train.destination}</div>
                        <div className="text-xs text-muted-foreground">{train.cars} cars</div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(train.status)}
                        <span className="text-sm capitalize">{train.status}</span>
                      </div>
                      <Badge variant={getCrowdBadgeVariant(train.crowdLevel)} className="text-xs">
                        {train.crowdLevel} crowd
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Operating Hours</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Weekdays:</span>
                      <span>05:30 - 23:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekends:</span>
                      <span>06:00 - 23:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frequency:</span>
                      <span>3-5 minutes</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Station Facilities</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Elevator Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Parking Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>WiFi Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
