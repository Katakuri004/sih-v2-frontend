"use client"
import { TrainHealthMatrix } from "./train-health-matrix"
import { SurvivalCurveChart } from "./survival-curve-chart"
import { MaintenanceCalendar } from "./maintenance-calendar"
import { MaintenanceScheduleManager } from "./maintenance-schedule-manager"
import { Wrench } from "lucide-react"

export default function MaintenanceHub() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            Predictive Maintenance Hub
          </h1>
          <p className="text-muted-foreground mt-1">Advanced analytics for component health and maintenance planning</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-success">All Systems Monitored</span>
          </div>
          <div className="text-sm text-muted-foreground">Last analysis: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      <TrainHealthMatrix />

      <SurvivalCurveChart />

      <MaintenanceScheduleManager />

      {/* Maintenance Calendar */}
      <MaintenanceCalendar />
    </div>
  )
}
