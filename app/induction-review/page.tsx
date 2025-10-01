"use client";

import { useState } from "react";
import Layout from "@/components/kokonutui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, XCircle, AlertTriangle, User } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface InductionPlan {
  id: string;
  trainNumber: string;
  date: string;
  time: string;
  recommendation: "Service" | "Standby" | "Maintenance";
  fitnessScore: number;
  aiReasoning: string;
  constraints: {
    fitnessValid: boolean;
    jobCardsClosed: boolean;
    brandingCompliant: boolean;
    mileageBalanced: boolean;
    cleaningScheduled: boolean;
    stablingOptimal: boolean;
  };
  riskFactors: string[];
  status: "pending" | "approved" | "rejected";
}

const mockInductionPlans: InductionPlan[] = [
  {
    id: "IP-001",
    trainNumber: "T-001",
    date: "2024-01-25",
    time: "05:30",
    recommendation: "Service",
    fitnessScore: 94,
    aiReasoning: "All systems optimal. Fitness certificates valid for 72 hours. No pending job cards. Branding exposure within SLA limits.",
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
    aiReasoning: "Brake system showing degraded performance. Telecom clearance expires in 18 hours. Preventive maintenance recommended.",
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
    aiReasoning: "Good overall condition but mileage imbalance detected. Recommend standby to allow T-003 higher priority service allocation.",
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
];

const nightlyOverview = {
  date: "2024-01-25",
  totalTrains: 24,
  scheduledServices: 156,
  predictedDemand: { peak: { time: "08:30", passengers: 12500 } },
  weatherImpact: { condition: "Light Rain", delayRisk: "Medium", crowdIncrease: "15%" },
  maintenanceWindows: [
    { train: "T-007", window: "23:30-04:00", type: "Preventive" },
    { train: "T-015", window: "01:00-05:30", type: "Corrective" },
  ],
  aiRecommendations: [
    "Deploy additional trains during 08:00-09:00 due to weather",
    "Extend service frequency on Blue Line evening peak",
    "Monitor T-012 brake system - approaching maintenance threshold",
  ],
};

const demandPredictionData = [
  { time: "05:00", predicted: 800, actual: 750 },
  { time: "06:00", predicted: 2100, actual: 2050 },
  { time: "07:00", predicted: 4500, actual: 4200 },
  { time: "08:00", predicted: 8200, actual: 8100 },
  { time: "09:00", predicted: 12500, actual: null },
  { time: "10:00", predicted: 6800, actual: null },
];

const riskAssessmentData = [
  { category: "Weather", risk: 65, color: "#f59e0b" },
  { category: "Maintenance", risk: 45, color: "#ef4444" },
  { category: "Demand", risk: 25, color: "#10b981" },
  { category: "Technical", risk: 35, color: "#3b82f6" },
];

export default function InductionReviewPage() {
  const [plans, setPlans] = useState<InductionPlan[]>(mockInductionPlans);
  const [selectedPlan, setSelectedPlan] = useState<InductionPlan | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const handleApprove = (planId: string) => {
    setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, status: "approved" } : p)));
    setSelectedPlan(null);
  };

  const handleReject = (planId: string, reason: string) => {
    setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, status: "rejected" } : p)));
    setSelectedPlan(null);
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "Service":
        return "bg-green-100 text-green-800";
      case "Maintenance":
        return "bg-red-100 text-red-800";
      case "Standby":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              Induction Review — Nightly Operator Console
            </h1>
            <p className="text-muted-foreground mt-1 max-w-2xl">
              Review AI-ranked induction plans (21:00–23:00 IST). Approve, reject or simulate what-if scenarios.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              {plans.filter((p) => p.status === "pending").length} Pending
            </Badge>
            <div className="text-sm text-muted-foreground">Review Window: 21:00 - 23:00 IST</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ranked Induction Plans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Button variant="ghost">Refresh Data</Button>
                  <Button variant="outline">Run Simulation</Button>
                  <div className="ml-auto text-sm text-muted-foreground">Updated: {nightlyOverview.date}</div>
                </div>

                <div className="space-y-3">
                  {plans.map((plan, idx) => (
                    <div key={plan.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="font-semibold">{idx + 1}. {plan.trainNumber}</div>
                            <Badge className={getRecommendationColor(plan.recommendation)}>{plan.recommendation}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">{plan.time} • {plan.date}</div>
                        </div>

                        <div className="text-sm text-muted-foreground mt-2">Fitness: <span className="font-medium">{plan.fitnessScore}%</span></div>
                        <div className="text-sm mt-2 text-ellipsis overflow-hidden max-h-12">{plan.aiReasoning}</div>

                        <div className="flex items-center gap-2 mt-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost" onClick={() => setSelectedPlan(plan)}>
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Detailed Review - {plan.trainNumber}</DialogTitle>
                              </DialogHeader>

                              <div className="space-y-4">
                                <div className="text-sm font-medium">AI Reasoning</div>
                                <div className="text-sm bg-muted p-3 rounded">{plan.aiReasoning}</div>

                                {plan.riskFactors.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold">Risk Factors</h4>
                                    <ul className="mt-2 space-y-1">
                                      {plan.riskFactors.map((risk, i) => (
                                        <li key={i} className="text-sm text-yellow-700">• {risk}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <div>
                                  <h4 className="font-semibold">Constraint Snapshot</h4>
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="p-2 rounded bg-muted/50">Fitness: {plan.constraints.fitnessValid ? 'Valid' : 'Expired'}</div>
                                    <div className="p-2 rounded bg-muted/50">Job Cards: {plan.constraints.jobCardsClosed ? 'Closed' : 'Open'}</div>
                                    <div className="p-2 rounded bg-muted/50">Branding: {plan.constraints.brandingCompliant ? 'Compliant' : 'At risk'}</div>
                                    <div className="p-2 rounded bg-muted/50">Mileage: {plan.constraints.mileageBalanced ? 'Balanced' : 'Imbalance'}</div>
                                    <div className="p-2 rounded bg-muted/50">Cleaning: {plan.constraints.cleaningScheduled ? 'Scheduled' : 'Not scheduled'}</div>
                                    <div className="p-2 rounded bg-muted/50">Stabling: {plan.constraints.stablingOptimal ? 'Optimal' : 'Suboptimal'}</div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold">Review Notes</h4>
                                  <Textarea placeholder="Add your review notes and reasoning..." value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} className="min-h-[100px]" />
                                </div>

                                <div className="flex gap-3 pt-4 border-t">
                                  <Button onClick={() => handleApprove(plan.id)} className="flex-1">
                                    <CheckCircle className="h-4 w-4 mr-2" /> Approve Plan
                                  </Button>
                                  <Button variant="destructive" onClick={() => handleReject(plan.id, reviewNotes)} className="flex-1">
                                    <XCircle className="h-4 w-4 mr-2" /> Reject Plan
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button size="sm" variant="outline" onClick={() => handleReject(plan.id, 'Operator reject')}>Reject</Button>
                          <Button size="sm" onClick={() => handleApprove(plan.id)}>Approve</Button>
                        </div>
                      </div>

                      <div className="w-24 text-right">
                        <div className="text-xs text-muted-foreground">Status</div>
                        <div className="font-semibold mt-1">{plan.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Constraints & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPlan ? (
                  <div className="space-y-2">
                    <div className="text-sm">Train: <span className="font-medium">{selectedPlan.trainNumber}</span></div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="p-2 rounded bg-muted/50">Fitness Certs: {selectedPlan.constraints.fitnessValid ? 'Valid' : 'Expired'}</div>
                      <div className="p-2 rounded bg-muted/50">Job Cards: {selectedPlan.constraints.jobCardsClosed ? 'Closed' : 'Open'}</div>
                      <div className="p-2 rounded bg-muted/50">Branding: {selectedPlan.constraints.brandingCompliant ? 'Compliant' : 'At risk'}</div>
                      <div className="p-2 rounded bg-muted/50">Mileage: {selectedPlan.constraints.mileageBalanced ? 'Balanced' : 'Imbalance'}</div>
                      <div className="p-2 rounded bg-muted/50">Cleaning: {selectedPlan.constraints.cleaningScheduled ? 'Scheduled' : 'Not scheduled'}</div>
                      <div className="p-2 rounded bg-muted/50">Stabling: {selectedPlan.constraints.stablingOptimal ? 'Optimal' : 'Suboptimal'}</div>
                    </div>
                    <div className="text-sm mt-3">AI Notes:</div>
                    <div className="text-sm bg-muted p-3 rounded">{selectedPlan.aiReasoning}</div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Select a plan to view constraint matrix and detailed compliance.</div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Demand Prediction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 240 }}>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={demandPredictionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" strokeWidth={2} />
                        <Line type="monotone" dataKey="actual" stroke="hsl(var(--success))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk & Maintenance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie data={riskAssessmentData} dataKey="risk" cx="50%" cy="50%" outerRadius={60}>
                          {riskAssessmentData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="mt-3 text-sm">
                      {nightlyOverview.maintenanceWindows.map((w, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>{w.train} • {w.type}</div>
                          <div className="text-muted-foreground">{w.window}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Simulation & What-if Console</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded bg-muted/50">
                    <div className="text-sm text-muted-foreground">Toggle constraint</div>
                    <div className="font-medium mt-1">Ignore Branding</div>
                  </div>
                  <div className="p-3 rounded bg-muted/50">
                    <div className="text-sm text-muted-foreground">Adjust objective</div>
                    <div className="font-medium mt-1">Prioritise Service Readiness</div>
                  </div>
                  <div className="p-3 rounded bg-muted/50">
                    <div className="text-sm text-muted-foreground">Run</div>
                    <Button className="w-full mt-2">Run What-if</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
