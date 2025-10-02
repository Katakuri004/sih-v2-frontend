"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "recharts";
import {
  Activity,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  Zap,
} from "lucide-react";

interface MetricData {
  timestamp: string;
  totalPassengers: number;
  systemLoad: number;
  avgWaitTime: number;
  onTimePerformance: number;
}

const generateRealtimeData = (): MetricData[] => {
  const now = new Date();
  const data: MetricData[] = [];

  for (let i = 29; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000); // Every minute for last 30 minutes
    data.push({
      timestamp: time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      totalPassengers: Math.floor(Math.random() * 2000) + 3000,
      systemLoad: Math.floor(Math.random() * 40) + 60,
      avgWaitTime: Math.random() * 3 + 2,
      onTimePerformance: Math.floor(Math.random() * 20) + 80,
    });
  }

  return data;
};

export function RealTimeMetrics() {
  const [data, setData] = useState<MetricData[]>(generateRealtimeData());
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData.slice(1)];
        const now = new Date();
        newData.push({
          timestamp: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          totalPassengers: Math.floor(Math.random() * 2000) + 3000,
          systemLoad: Math.floor(Math.random() * 40) + 60,
          avgWaitTime: Math.random() * 3 + 2,
          onTimePerformance: Math.floor(Math.random() * 20) + 80,
        });
        return newData;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const currentMetrics = data[data.length - 1];

  const getSystemHealthColor = (load: number) => {
    if (load < 70) return "success";
    if (load < 85) return "warning";
    return "destructive";
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "success";
    if (performance >= 80) return "warning";
    return "destructive";
  };

  const getSystemLoadColor = (load: number) => {
    if (load < 70) return "bg-green-500"; // Low load - green
    if (load < 85) return "bg-yellow-500"; // Medium load - yellow
    return "bg-red-500"; // High load - red
  };

  return (
    <div className="space-y-6">
      {/* Live Status Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-Time System Metrics
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isLive ? "bg-success animate-pulse" : "bg-muted"
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {isLive ? "Live" : "Paused"}
              </span>
              <button
                onClick={() => setIsLive(!isLive)}
                className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20"
              >
                {isLive ? "Pause" : "Resume"}
              </button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Current Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {currentMetrics?.totalPassengers.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Passengers
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Zap className="h-5 w-5 text-warning" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold">
                  {currentMetrics?.systemLoad}%
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  System Load
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 border border-gray-300 dark:border-gray-600">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getSystemLoadColor(
                        currentMetrics?.systemLoad || 0
                      )}`}
                      style={{ width: `${currentMetrics?.systemLoad || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {currentMetrics?.avgWaitTime.toFixed(1)}m
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg Wait Time
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {currentMetrics?.onTimePerformance}%
                </div>
                <div className="text-sm text-muted-foreground">
                  On-Time Performance
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Passenger Flow (Last 30 min)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" />
                  <XAxis dataKey="timestamp" tick={{ fill: "#374151" }} />
                  <YAxis tick={{ fill: "#374151" }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="totalPassengers"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                    name="Passengers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" />
                  <XAxis dataKey="timestamp" tick={{ fill: "#374151" }} />
                  <YAxis tick={{ fill: "#374151" }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="systemLoad"
                    stroke="#ea580c"
                    strokeWidth={2}
                    dot={false}
                    name="System Load (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="onTimePerformance"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={false}
                    name="On-Time Performance (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Alerts & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentMetrics?.systemLoad > 85 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div>
                  <div className="font-medium text-destructive">
                    High System Load Detected
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Consider deploying additional trains on high-traffic routes
                  </div>
                </div>
                <Badge variant="destructive">Critical</Badge>
              </div>
            )}

            {currentMetrics?.avgWaitTime > 4 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <div className="font-medium text-warning">
                    Extended Wait Times
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average wait time exceeds 4 minutes at multiple stations
                  </div>
                </div>
                <Badge variant="secondary">Warning</Badge>
              </div>
            )}

            {currentMetrics?.onTimePerformance < 85 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <TrendingUp className="h-5 w-5 text-warning" />
                <div>
                  <div className="font-medium text-warning">
                    Performance Below Target
                  </div>
                  <div className="text-sm text-muted-foreground">
                    On-time performance is below the 85% threshold
                  </div>
                </div>
                <Badge variant="secondary">Advisory</Badge>
              </div>
            )}

            {currentMetrics?.systemLoad < 70 &&
              currentMetrics?.onTimePerformance > 90 && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <div>
                    <div className="font-medium text-success">
                      Optimal System Performance
                    </div>
                    <div className="text-sm text-muted-foreground">
                      All metrics are within optimal ranges
                    </div>
                  </div>
                  <Badge variant="default">Normal</Badge>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
