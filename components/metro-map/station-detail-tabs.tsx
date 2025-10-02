"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Users,
  Clock,
  Train,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import type { Station } from "@/types/metro";

interface StationDetailTabsProps {
  station: Station;
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
];

const weeklyTrendData = [
  { day: "Mon", passengers: 4200, predicted: 4150 },
  { day: "Tue", passengers: 4500, predicted: 4480 },
  { day: "Wed", passengers: 4300, predicted: 4320 },
  { day: "Thu", passengers: 4600, predicted: 4580 },
  { day: "Fri", passengers: 5200, predicted: 5180 },
  { day: "Sat", passengers: 3800, predicted: 3850 },
  { day: "Sun", passengers: 2900, predicted: 2920 },
];

export function StationDetailTabs({ station }: StationDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Get colors that work well in both light and dark modes
  const getChartColors = () => {
    return {
      actual: isDarkMode ? "#60a5fa" : "#2563eb", // Blue - lighter in dark mode, darker in light mode
      predicted: isDarkMode ? "#fb923c" : "#ea580c", // Orange - more visible than yellow in both modes
    };
  };

  const chartColors = getChartColors();

  // Monitor theme changes
  useEffect(() => {
    const checkTheme = () => {
      const isDark =
        typeof window !== "undefined" &&
        (document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDarkMode(isDark);
    };

    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    if (typeof window !== "undefined") {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => observer.disconnect();
  }, []);

  const getCurrentCrowdData = () => {
    const baseCount =
      station.crowdLevel === "low"
        ? 142
        : station.crowdLevel === "medium"
        ? 287
        : 456;
    return {
      current: baseCount,
      capacity: 600,
      percentage: Math.round((baseCount / 600) * 100),
      waitingOnPlatform: Math.round(baseCount * 0.3),
      inTransit: Math.round(baseCount * 0.7),
    };
  };

  const getUpcomingTrains = () => [
    {
      id: "M101",
      destination:
        station.line === "Blue"
          ? "Ernakulam South"
          : station.line === "AquaLine"
          ? "Elamkulam"
          : "Tripunithura",
      arrival: "2 min",
      status: station.status === "delayed" ? "delayed" : "on-time",
      crowdLevel: "medium",
      cars: 3,
    },
    {
      id: "M102",
      destination:
        station.line === "Blue"
          ? "Aluva"
          : station.line === "AquaLine"
          ? "Kakkanad"
          : "Ernakulam South",
      arrival: "8 min",
      status: "on-time",
      crowdLevel: "low",
      cars: 3,
    },
    {
      id: "M103",
      destination:
        station.line === "Blue"
          ? "Ernakulam South"
          : station.line === "AquaLine"
          ? "Elamkulam"
          : "Tripunithura",
      arrival: "15 min",
      status: "on-time",
      crowdLevel: "high",
      cars: 3,
    },
  ];

  const crowdData = getCurrentCrowdData();
  const upcomingTrains = getUpcomingTrains();

  const getCrowdBadgeVariant = (level: string) => {
    switch (level) {
      case "low":
        return "default";
      case "medium":
        return "secondary";
      case "high":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-time":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "delayed":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "approaching":
        return <Train className="h-4 w-4 text-info" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 
      OLD STATION HEADER (BACKUP - now moved to main page):
      <Card>
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Train className="h-6 w-6" />
            {station.name} Station
          </CardTitle>
          <div className="flex flex-wrap gap-3 mt-4">
            <Badge variant="outline" className="...">...</Badge>
            <Badge variant="outline" className="...">...</Badge>
          </div>
        </CardHeader>
      </Card>
      */}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="arrivals">Arrivals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Horizontal Info Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Current Crowd */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Current Crowd
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    {crowdData.current}
                  </div>
                  <div className="text-sm text-muted-foreground">people</div>
                </div>
                <Progress
                  value={crowdData.percentage}
                  className={`w-full h-2 ${
                    station.crowdLevel === "low"
                      ? "[&>div]:bg-green-500"
                      : station.crowdLevel === "medium"
                      ? "[&>div]:bg-yellow-500"
                      : station.crowdLevel === "high"
                      ? "[&>div]:bg-red-500"
                      : "[&>div]:bg-primary"
                  }`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{crowdData.percentage}% capacity</span>
                  <span>{crowdData.capacity} max</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">
                      Platform
                    </div>
                    <div className="text-lg font-semibold">
                      {crowdData.waitingOnPlatform}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Transit</div>
                    <div className="text-lg font-semibold">
                      {crowdData.inTransit}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Train */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  Next Train
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge
                    variant="outline"
                    className={`mb-2 ${
                      station.line === "Blue"
                        ? "bg-blue-100 text-blue-800 border-blue-300"
                        : station.line === "AquaLine"
                        ? "bg-cyan-100 text-cyan-800 border-cyan-300"
                        : station.line === "Purple"
                        ? "bg-purple-100 text-purple-800 border-purple-300"
                        : "bg-gray-100 text-gray-800 border-gray-300"
                    }`}
                  >
                    {station.line === "Blue"
                      ? "Blue Line"
                      : station.line === "AquaLine"
                      ? "Aqua Line"
                      : station.line === "Purple"
                      ? "Purple Line"
                      : station.line}
                  </Badge>
                  <div className="text-xs text-muted-foreground mb-2">
                    Train {upcomingTrains[0].id}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getStatusIcon(upcomingTrains[0].status)}
                    <span className="text-xs capitalize font-medium">
                      {upcomingTrains[0].status}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      upcomingTrains[0].crowdLevel === "low"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : upcomingTrains[0].crowdLevel === "medium"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                        : upcomingTrains[0].crowdLevel === "high"
                        ? "bg-red-100 text-red-800 border-red-300"
                        : "bg-gray-100 text-gray-800 border-gray-300"
                    }`}
                  >
                    {upcomingTrains[0].crowdLevel.charAt(0).toUpperCase() +
                      upcomingTrains[0].crowdLevel.slice(1)}{" "}
                    crowd
                  </Badge>
                </div>
                <div className="pt-3 border-t text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    Destination
                  </div>
                  <div className="text-sm font-semibold">
                    {upcomingTrains[0].destination}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Station Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Station Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-xl font-bold text-primary mb-1">
                      4.2k
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Daily Avg
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-xl font-bold text-success mb-1">
                      94%
                    </div>
                    <div className="text-xs text-muted-foreground">On-Time</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-xl font-bold text-info mb-1">2.3</div>
                    <div className="text-xs text-muted-foreground">
                      Avg Wait
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-xl font-bold text-warning mb-1">
                      12
                    </div>
                    <div className="text-xs text-muted-foreground">Peak Hr</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Today's Crowd Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={crowdTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" />
                    <XAxis
                      dataKey="time"
                      fontSize={12}
                      tick={{ fill: "#374151" }}
                    />
                    <YAxis fontSize={12} tick={{ fill: "#374151" }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="passengers"
                      stroke={chartColors.actual}
                      strokeWidth={2}
                      name="Actual"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Weekly Passenger Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" />
                    <XAxis
                      dataKey="day"
                      fontSize={12}
                      tick={{ fill: "#374151" }}
                    />
                    <YAxis fontSize={12} tick={{ fill: "#374151" }} />
                    <Tooltip />
                    <Bar
                      dataKey="passengers"
                      fill={chartColors.actual}
                      name="Passengers"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-4 w-4" />
                AI Crowd Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={crowdTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" />
                    <XAxis
                      dataKey="time"
                      fontSize={12}
                      tick={{ fill: "#374151" }}
                    />
                    <YAxis fontSize={12} tick={{ fill: "#374151" }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="passengers"
                      stroke={chartColors.actual}
                      strokeWidth={2}
                      name="Actual"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke={chartColors.predicted}
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
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Next Hour</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl font-bold mb-1">+15%</div>
                <p className="text-xs text-muted-foreground mb-2">
                  Expected increase in crowd density
                </p>
                <Badge variant="secondary" className="text-xs">
                  Rush Hour Approaching
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Peak Time</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl font-bold mb-1">18:30</div>
                <p className="text-xs text-muted-foreground mb-2">
                  Predicted peak crowd time today
                </p>
                <Badge variant="destructive" className="text-xs">
                  High Density
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl font-bold mb-1">16:45</div>
                <p className="text-xs text-muted-foreground mb-2">
                  Best time to travel (low crowd)
                </p>
                <Badge variant="default" className="text-xs">
                  Optimal Window
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="arrivals" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Train className="h-4 w-4" />
                Upcoming Trains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTrains.map((train, index) => (
                  <div
                    key={train.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      index === 0 ? "bg-primary/5 border-primary/20" : "bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-base font-bold">
                          {train.arrival}
                        </div>
                        <div className="text-xs text-muted-foreground">ETA</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          Train {train.id}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          → {train.destination}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {train.cars} cars
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(train.status)}
                        <span className="text-xs capitalize">
                          {train.status}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          train.crowdLevel === "low"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : train.crowdLevel === "medium"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : train.crowdLevel === "high"
                            ? "bg-red-100 text-red-800 border-red-300"
                            : "bg-gray-100 text-gray-800 border-gray-300"
                        }`}
                      >
                        {train.crowdLevel.charAt(0).toUpperCase() +
                          train.crowdLevel.slice(1)}{" "}
                        crowd
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Service Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">
                    Operating Hours
                  </h4>
                  <div className="space-y-1 text-xs">
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
                  <h4 className="font-semibold mb-2 text-sm">
                    Station Facilities
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-success" />
                      <span>Elevator Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-success" />
                      <span>Parking Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-success" />
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
  );
}
