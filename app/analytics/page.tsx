"use client"

import Layout from "@/components/kokonutui/layout"
import { CrowdHeatmap } from "@/components/analytics/crowd-heatmap"
import { RealTimeMetrics } from "@/components/analytics/real-time-metrics"
import { PassengerFlowAnalytics } from "@/components/analytics/passenger-flow-analytics"
import { CrowdPredictionChart } from "@/components/analytics/crowd-prediction-chart"
import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Crowd Analytics</h1>
            <p className="text-muted-foreground">Real-time passenger flow analysis and predictive crowd management</p>
          </div>
        </div>

        {/* Real-time Metrics */}
        <RealTimeMetrics />

        <PassengerFlowAnalytics />

        <CrowdPredictionChart />

        {/* Crowd Heatmap */}
        <CrowdHeatmap />
      </div>
    </Layout>
  )
}
