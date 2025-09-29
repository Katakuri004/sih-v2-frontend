"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle, XCircle, Clock, AlertTriangle, FileText, User, TrendingUp, Calendar, Train } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface InductionPlan {
  id: string
  trainNumber: string
  date: string
  time: string
  recommendation: "Service" | "Standby" | "Maintenance"
  fitnessScore: number
  aiReasoning: string
  constraints: {
    fitnessValid: boolean
    jobCardsClosed: boolean
    brandingCompliant: boolean
    mileageBalanced: boolean
    cleaningScheduled: boolean
    stablingOptimal: boolean
  }
  riskFactors: string[]
  status: "pending" | "approved" | "rejected"
}

const mockInductionPlans: InductionPlan[] = [
  {
    id: "IP-001",
    trainNumber: "T-001",
    date: "2024-01-25",
    time: "05:30",
    recommendation: "Service",
    fitnessScore: 94,
    aiReasoning:
      "All systems optimal. Fitness certificates valid for 72 hours. No pending job cards. Branding exposure within SLA limits.",
    constraints: {
      fitnessValid: true,
      jobCardsClosed: true,
      brandingCompliant: true,
      mileageBalanced: true,
      cleaningScheduled: true,
      stablingOptimal: true,
    },
    riskFactors: [],
    status: "pending",
  },
  {
    id: "IP-002",
    trainNumber: "T-007",
    date: "2024-01-25",
    time: "06:00",
    recommendation: "Maintenance",
    fitnessScore: 67,
    aiReasoning:
      "Brake system showing degraded performance. Telecom clearance expires in 18 hours. Preventive maintenance recommended.",
    constraints: {
      fitnessValid: true,
      jobCardsClosed: false,
      brandingCompliant: true,
      mileageBalanced: false,
      cleaningScheduled: true,
      stablingOptimal: true,
    },
    riskFactors: ["Brake pad wear at 78%", "Telecom cert expires soon"],
    status: "pending",
  },
  {
    id: "IP-003",
    trainNumber: "T-015",
    date: "2024-01-25",
    time: "07:15",
    recommendation: "Standby",
    fitnessScore: 82,
    aiReasoning:
      "Good overall condition but mileage imbalance detected. Recommend standby to allow T-003 higher priority service allocation.",
    constraints: {
      fitnessValid: true,
      jobCardsClosed: true,
      brandingCompliant: false,
      mileageBalanced: false,
      cleaningScheduled: true,
      stablingOptimal: true,
    },
    riskFactors: ["Branding SLA breach risk"],
    status: "pending",
  },
]

const nightlyOverview = {
  date: "2024-01-25",
  totalTrains: 24,
  scheduledServices: 156,
  predictedDemand: {
    peak: { time: "08:30", passengers: 12500 },
    offPeak: { time: "14:00", passengers: 3200 },
    evening: { time: "18:45", passengers: 11800 },
  },
  weatherImpact: {
    condition: "Light Rain",
    delayRisk: "Medium",
    crowdIncrease: "15%",
  },
  maintenanceWindows: [
    { train: "T-007", window: "23:30-04:00", type: "Preventive" },
    { train: "T-015", window: "01:00-05:30", type: "Corrective" },
  ],
  aiRecommendations: [
    "Deploy additional trains during 08:00-09:00 due to weather",
    "Extend service frequency on Blue Line evening peak",
    "Monitor T-012 brake system - approaching maintenance threshold",
  ],
}

const demandPredictionData = [
  { time: "05:00", predicted: 800, actual: 750, confidence: 95 },
  { time: "06:00", predicted: 2100, actual: 2050, confidence: 92 },
  { time: "07:00", predicted: 4500, actual: 4200, confidence: 88 },
  { time: "08:00", predicted: 8200, actual: 8100, confidence: 94 },
  { time: "09:00", predicted: 12500, actual: null, confidence: 87 },
  { time: "10:00", predicted: 6800, actual: null, confidence: 91 },
  { time: "11:00", predicted: 4200, actual: null, confidence: 89 },
]

const trainUtilizationData = [
  { train: "T-001", utilization: 94, status: "Optimal" },
  { train: "T-003", utilization: 87, status: "Good" },
  { train: "T-007", utilization: 67, status: "Maintenance" },
  { train: "T-012", utilization: 91, status: "Optimal" },
  { train: "T-015", utilization: 82, status: "Standby" },
]

const riskAssessmentData = [
  { category: "Weather", risk: 65, color: "#f59e0b" },
  { category: "Maintenance", risk: 45, color: "#ef4444" },
  { category: "Demand", risk: 25, color: "#10b981" },
  { category: "Technical", risk: 35, color: "#3b82f6" },
]

export default function InductionReviewPage() {
  const [plans, setPlans] = useState<InductionPlan[]>(mockInductionPlans)
  const [selectedPlan, setSelectedPlan] = useState<InductionPlan | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const handleApprove = (planId: string) => {
    setPlans((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, status: "approved" as const } : plan)))
    setSelectedPlan(null)
    setReviewNotes("")
  }

  const handleReject = (planId: string, reason: string) => {
    setPlans((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, status: "rejected" as const } : plan)))
    setSelectedPlan(null)
    setReviewNotes("")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "Service":
        return "bg-green-100 text-green-800"
      case "Maintenance":
        return "bg-red-100 text-red-800"
      case "Standby":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            Maintenance Officer Review
          </h1>
          <p className="text-muted-foreground mt-1">
            Nightly overview and manual review of AI-generated induction plans
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            {plans.filter((p) => p.status === "pending").length} Pending Reviews
          </Badge>
          <div className="text-sm text-muted-foreground">Review Window: 21:00 - 23:00 IST</div>
        </div>
      </div>

      {/* Comprehensive Tabs for Nightly Overview, Predictions, and Manual Review */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Nightly Overview</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          <TabsTrigger value="review">Manual Review</TabsTrigger>
          <TabsTrigger value="schedule">Tomorrow's Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Trains</p>
                    <p className="text-2xl font-bold">{nightlyOverview.totalTrains}</p>
                  </div>
                  <Train className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Scheduled Services</p>
                    <p className="text-2xl font-bold">{nightlyOverview.scheduledServices}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Peak Demand</p>
                    <p className="text-2xl font-bold">
                      {nightlyOverview.predictedDemand.peak.passengers.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">at {nightlyOverview.predictedDemand.peak.time}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Weather Impact</p>
                    <p className="text-lg font-bold">{nightlyOverview.weatherImpact.condition}</p>
                    <p className="text-xs text-muted-foreground">
                      +{nightlyOverview.weatherImpact.crowdIncrease} crowd
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Train Utilization Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Train Utilization Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trainUtilizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="train" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="utilization" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations for Tomorrow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nightlyOverview.aiRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {/* Demand Prediction Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Passenger Demand Prediction vs Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={demandPredictionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Predicted"
                  />
                  <Line type="monotone" dataKey="actual" stroke="hsl(var(--success))" strokeWidth={2} name="Actual" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskAssessmentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="risk"
                    label={({ category, risk }) => `${category}: ${risk}%`}
                  >
                    {riskAssessmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          {/* Induction Plans Grid */}
          <div className="grid gap-4">
            {plans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(plan.status)}
                        <span className="font-semibold text-lg">{plan.trainNumber}</span>
                      </div>
                      <Badge className={getRecommendationColor(plan.recommendation)}>{plan.recommendation}</Badge>
                      <div className="text-sm text-muted-foreground">
                        {plan.date} at {plan.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Fitness Score</div>
                        <div className="text-2xl font-bold">{plan.fitnessScore}%</div>
                      </div>
                      {plan.status === "pending" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => setSelectedPlan(plan)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detailed Review - {plan.trainNumber}</DialogTitle>
                            </DialogHeader>

                            {selectedPlan && (
                              <div className="space-y-6">
                                {/* AI Reasoning */}
                                <div>
                                  <h3 className="font-semibold mb-2">AI Analysis & Reasoning</h3>
                                  <p className="text-sm bg-muted p-3 rounded-lg">{selectedPlan.aiReasoning}</p>
                                </div>

                                {/* Constraints Check */}
                                <div>
                                  <h3 className="font-semibold mb-3">System Constraints Validation</h3>
                                  <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(selectedPlan.constraints).map(([key, value]) => (
                                      <div key={key} className="flex items-center gap-2">
                                        {value ? (
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className="text-sm capitalize">
                                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Risk Factors */}
                                {selectedPlan.riskFactors.length > 0 && (
                                  <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                      Risk Factors
                                    </h3>
                                    <ul className="space-y-1">
                                      {selectedPlan.riskFactors.map((risk, index) => (
                                        <li key={index} className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                                          • {risk}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Review Notes */}
                                <div>
                                  <h3 className="font-semibold mb-2">Review Notes</h3>
                                  <Textarea
                                    placeholder="Add your review notes and reasoning..."
                                    value={reviewNotes}
                                    onChange={(e) => setReviewNotes(e.target.value)}
                                    className="min-h-[100px]"
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4 border-t">
                                  <Button onClick={() => handleApprove(selectedPlan.id)} className="flex-1">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve Plan
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleReject(selectedPlan.id, reviewNotes)}
                                    className="flex-1"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject Plan
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>

                  {/* Quick Summary */}
                  <div className="text-sm text-muted-foreground">{plan.aiReasoning.substring(0, 120)}...</div>

                  {plan.riskFactors.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-yellow-700">
                        {plan.riskFactors.length} risk factor{plan.riskFactors.length > 1 ? "s" : ""} identified
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          {/* Tomorrow's Schedule Overview */}
          <Card>
            <CardHeader>
              <CardTitle>
                Tomorrow's Operational Schedule - {new Date(Date.now() + 86400000).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">18</div>
                    <div className="text-sm text-green-700">Active Service</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">4</div>
                    <div className="text-sm text-yellow-700">Standby</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">2</div>
                    <div className="text-sm text-red-700">Maintenance</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Maintenance Windows</h4>
                  <div className="space-y-2">
                    {nightlyOverview.maintenanceWindows.map((window, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{window.train}</Badge>
                          <span className="text-sm">{window.type} Maintenance</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{window.window}</div>
                      </div>
                    ))}
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
