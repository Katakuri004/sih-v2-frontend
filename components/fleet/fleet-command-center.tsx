"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KPICard } from "./kpi-card"
import { AIInductionTable } from "./ai-induction-table"
import { GanttChart } from "./gantt-chart"
import { Activity, Clock, AlertTriangle, CheckCircle } from "lucide-react"

export default function FleetCommandCenter() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Fleet Command Center</h1>
              <p className="text-muted-foreground">Real-time operations dashboard for metro fleet management</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-success">System Online</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard
          title="Fleet Readiness"
          value="92%"
          change="+2.1% from yesterday"
          changeType="positive"
          color="metro-blue"
          delay={0}
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <KPICard
          title="Punctuality (OTP)"
          value="87%"
          change="+0.8% from yesterday"
          changeType="positive"
          color="metro-teal"
          delay={100}
          icon={<Clock className="h-5 w-5" />}
        />
        <KPICard
          title="Active Trains"
          value="24"
          change="2 more than usual"
          changeType="positive"
          color="metro-green"
          delay={200}
          icon={<Activity className="h-5 w-5" />}
        />
        <KPICard
          title="Critical Alerts"
          value="3"
          change="2 resolved today"
          changeType="negative"
          color="metro-red"
          delay={300}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* AI Induction Plan Table - Takes 2 columns on xl screens */}
        <div className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Activity className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="text-lg font-semibold">AI Induction Plan</div>
                  <div className="text-sm font-normal text-muted-foreground">
                    Intelligent fleet deployment recommendations
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AIInductionTable />
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Distance Today</span>
                <span className="font-semibold">2,847 km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Energy Consumption</span>
                <span className="font-semibold">1,234 kWh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Passengers Served</span>
                <span className="font-semibold">45,678</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Speed</span>
                <span className="font-semibold">42 km/h</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Signaling System</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-sm font-medium text-success">Optimal</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Power Supply</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-sm font-medium text-success">Normal</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Communication</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning" />
                  <span className="text-sm font-medium text-warning">Degraded</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">24-Hour Fleet Schedule</h2>
        <GanttChart />
      </div>
    </div>
  )
}
