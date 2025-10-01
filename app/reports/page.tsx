"use client";

import { useMemo, useState, useEffect } from "react";
import Layout from "@/components/kokonutui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

// Mock ESG metrics
const envTrend = [
  { month: 'Apr', co2Saved: 120 },
  { month: 'May', co2Saved: 180 },
  { month: 'Jun', co2Saved: 150 },
  { month: 'Jul', co2Saved: 210 },
  { month: 'Aug', co2Saved: 190 },
  { month: 'Sep', co2Saved: 230 },
];

const governancePie = [
  { name: 'Auditability', value: 55, color: '#3b82f6' },
  { name: 'SLA Compliance', value: 30, color: '#10b981' },
  { name: 'Overrides', value: 15, color: '#f59e0b' },
];

const auditLogs = [
  { time: '2025-10-01 21:02', actor: 'AI', action: 'Recommended Service for T-001', note: 'Fitness OK, mileage balanced' },
  { time: '2025-10-01 21:15', actor: 'Operator A', action: 'Override - Rejected T-007', note: 'Operator requested maintenance slot' },
  { time: '2025-10-01 22:05', actor: 'AI', action: 'Predictive maintenance scheduled T-003', note: 'Brake pad threshold' },
];

export default function ReportsPage() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 3000);
    return () => clearInterval(id);
  }, []);

  const co2ThisMonth = useMemo(() => envTrend.reduce((s, r) => s + r.co2Saved, 0), []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ESG Accountability Dashboard</h1>
          <p className="text-muted-foreground mt-1">Realtime and historical ESG metrics — exportable, auditable, and actionable.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Environmental Snapshot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">CO₂ Emissions Saved (monthly)</div>
                <div className="text-2xl font-semibold mt-2">{co2ThisMonth} kg CO₂e</div>
                <div style={{ width: '100%', height: 160 }} className="mt-4">
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={envTrend}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="co2Saved" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">Component lifecycle extension and predictive maintenance metrics summarized below.</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social & Safety</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-muted/50">
                    <div className="text-sm text-muted-foreground">Punctuality</div>
                    <div className="text-lg font-semibold">99.6%</div>
                  </div>
                  <div className="p-3 rounded bg-muted/50">
                    <div className="text-sm text-muted-foreground">Service Availability (hrs)</div>
                    <div className="text-lg font-semibold">720h</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">Safety incidents prevented: <span className="font-medium">4</span></div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Governance & Auditability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div style={{ width: 360, height: 180 }}>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie data={governancePie} dataKey="value" cx="50%" cy="50%" outerRadius={60}>
                          {governancePie.map((g, i) => <Cell key={i} fill={g.color} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex-1 pl-6">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Decision Audit Logs</div>
                        <div className="text-lg font-semibold">{auditLogs.length} recent entries</div>
                      </div>
                      <div className="ml-auto">
                        <Button>Export CSV</Button>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {auditLogs.map((a, i) => (
                        <div key={i} className="p-2 rounded bg-muted/50">
                          <div className="text-xs text-muted-foreground">{a.time} • {a.actor}</div>
                          <div className="font-medium">{a.action}</div>
                          <div className="text-sm text-muted-foreground">{a.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictive vs Reactive Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Predictive maintenance ratio</div>
                    <div className="text-2xl font-semibold mt-1">72%</div>
                    <div className="text-sm text-muted-foreground mt-2">Higher predictive ratio reduces emergency shipping and lifecycle emissions.</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">SLA Compliance Rate</div>
                    <div className="text-2xl font-semibold mt-1">96%</div>
                    <div className="text-sm text-muted-foreground mt-2">Human-in-the-loop override rate: 3%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Last updated: {new Date(now).toLocaleString()}</div>
          <div>
            <Button variant="outline">Download monthly ESG report</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
