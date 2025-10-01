"use client";

import { useMemo, useState, useEffect } from "react";
import Layout from "@/components/kokonutui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart3 } from "lucide-react";

interface AdvertiserContract {
  id: string;
  name: string;
  contractedHours: number; // hours per month
  exposedHours: number; // current month exposure
  revenueTarget: number;
  revenueEarned: number;
}

interface Campaign {
  id: string;
  name: string;
  advertiserId: string;
  status: "upcoming" | "ongoing" | "completed";
  achievedPercent: number; // percent of target exposure/revenue
  inCharge: string;
  adType: string;
  trains: string[];
  predictionTargetDate: string;
  alerts: string[];
}

const mockContracts: AdvertiserContract[] = [
  { id: "A-001", name: "Acme Corp", contractedHours: 720, exposedHours: 680, revenueTarget: 50000, revenueEarned: 46500 },
  { id: "A-002", name: "Transit Foods", contractedHours: 360, exposedHours: 380, revenueTarget: 28000, revenueEarned: 29000 },
  { id: "A-003", name: "MetroBank", contractedHours: 240, exposedHours: 200, revenueTarget: 20000, revenueEarned: 17000 },
];

const complianceTrend = [
  { month: "May", compliance: 92 },
  { month: "Jun", compliance: 88 },
  { month: "Jul", compliance: 90 },
  { month: "Aug", compliance: 85 },
  { month: "Sep", compliance: 89 },
  { month: "Oct", compliance: 91 },
];

const revenueRisk = [
  { name: "On Track", value: 60, color: "#10b981" },
  { name: "At Risk", value: 30, color: "#f59e0b" },
  { name: "Breached", value: 10, color: "#ef4444" },
];

const mockCampaigns: Campaign[] = [
  { id: 'C-101', name: 'Acme Winter Push', advertiserId: 'A-001', status: 'ongoing', achievedPercent: 92, inCharge: 'Ravi Kumar', adType: 'Full Wrap', trains: ['T-001','T-007'], predictionTargetDate: '2025-10-15', alerts: [] },
  { id: 'C-102', name: 'Transit Foods Q4', advertiserId: 'A-002', status: 'upcoming', achievedPercent: 0, inCharge: 'Priya Nair', adType: 'Interior Panels', trains: ['T-015'], predictionTargetDate: '2025-11-01', alerts: ['Low inventory'] },
  { id: 'C-103', name: 'MetroBank Savings', advertiserId: 'A-003', status: 'ongoing', achievedPercent: 68, inCharge: 'Ajay S', adType: 'Exterior Panels', trains: ['T-003','T-009'], predictionTargetDate: '2025-10-10', alerts: ['Exposure deficit'] },
];

export default function BrandingMonitorPage() {
  const [contracts] = useState<AdvertiserContract[]>(mockContracts);
  const [now, setNow] = useState(() => Date.now());
  const [selectedContract, setSelectedContract] = useState<AdvertiserContract | null>(null);
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);

  const exposureSummary = useMemo(() => {
    const totalContracted = contracts.reduce((s, c) => s + c.contractedHours, 0);
    const totalExposed = contracts.reduce((s, c) => s + c.exposedHours, 0);
    const percent = Math.round((totalExposed / Math.max(1, totalContracted)) * 100);
    return { totalContracted, totalExposed, percent };
  }, [contracts]);

  // live clock to simulate real-time updates/animations
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 2000);
    return () => clearInterval(id);
  }, []);

  // small helper: render simple sparkline from an array of numbers as inline SVG
  function Sparkline({ values }: { values: number[] }) {
    if (!values || values.length === 0) return null;
    const w = 120;
    const h = 28;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const points = values
      .map((v, i) => {
        const x = (i / (values.length - 1)) * w;
        const y = h - ((v - min) / Math.max(1, max - min)) * h;
        return `${x},${y}`;
      })
      .join(" ");
    return (
      <svg width={w} height={h} className="inline-block">
        <polyline fill="none" stroke="#3b82f6" strokeWidth={2} points={points} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  function AnimatedCounter({ value, label }: { value: number; label?: string }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
      let start = Date.now();
      const dur = 800;
      const from = display;
      const to = value;
      const id = setInterval(() => {
        const t = Math.min(1, (Date.now() - start) / dur);
        const v = Math.round(from + (to - from) * t);
        setDisplay(v);
        if (t === 1) clearInterval(id);
      }, 40);
      return () => clearInterval(id);
    }, [value]);
    return (
      <div className="text-center">
        <div className="text-2xl font-semibold">{display}</div>
        {label && <div className="text-xs text-muted-foreground">{label}</div>}
      </div>
    );
  }

  // Simple Gantt: render train activity across 24h as segments
  function GanttChart({ trains }: { trains: string[] }) {
    // mock schedule segments per train [{start:hour, end:hour, state}]
    const mockSchedule = (train: string) => {
      const base = train.endsWith('1') ? 1 : 3;
      return [
        { start: 0 + base, end: 4 + base, state: 'maintenance' },
        { start: 4 + base, end: 14 + base, state: 'active' },
        { start: 14 + base, end: 24, state: 'off' },
      ];
    };

    const width = 600;
    const height = trains.length * 28 + 20;
    return (
      <svg width={width} height={height} className="rounded bg-white/5 border border-border">
        {trains.map((t, idx) => {
          const y = 10 + idx * 28;
          const segments = mockSchedule(t);
          return (
            <g key={t}>
              <text x={6} y={y + 12} fontSize={12} fill="#111">{t}</text>
              {segments.map((s, i) => {
                const x = 100 + (s.start / 24) * (width - 120);
                const w = ((s.end - s.start) / 24) * (width - 120);
                const fill = s.state === 'active' ? '#10b981' : s.state === 'maintenance' ? '#f59e0b' : '#94a3b8';
                return <rect key={i} x={x} y={y} width={w} height={12} rx={3} fill={fill} />;
              })}
            </g>
          );
        })}
        <g>
          {Array.from({ length: 25 }, (_, i) => i).map((h) => {
            const x = 100 + (h / 24) * (width - 120);
            return <line key={h} x1={x} x2={x} y1={4} y2={height - 4} stroke="#eee" strokeWidth={0.4} />;
          })}
        </g>
      </svg>
    );
  }

  function CampaignDetailsDialog() {
    if (!activeCampaign) return null;
    return (
      <Dialog open={!!activeCampaign} onOpenChange={(open) => !open && setActiveCampaign(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeCampaign.name} — Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">In charge: {activeCampaign.inCharge}</div>
                <div className="text-sm text-muted-foreground">Type: {activeCampaign.adType} • Target: {activeCampaign.predictionTargetDate}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{activeCampaign.achievedPercent}%</div>
                <div className="text-sm text-muted-foreground">Alerts: {activeCampaign.alerts.join(', ') || 'None'}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Train Activity (24h)</h4>
              <GanttChart trains={activeCampaign.trains} />
            </div>

            <div>
              <h4 className="font-semibold mb-2">Prediction & Trend</h4>
              <div style={{ width: '100%', height: 160 }}>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={complianceTrend}>
                    <XAxis dataKey="month" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="compliance" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Branding & Revenue Compliance Monitor</h1>
              <p className="text-sm text-muted-foreground">Contract Fulfillment Tracker — Advertiser SLAs and revenue risk alerts</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline">Contracts: {contracts.length}</Badge>
            <Button variant="ghost">Run Exposure Recalc</Button>
            <Button>Export Report</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advertiser SLA Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Exposure</div>
                    <div className="text-2xl font-semibold">{exposureSummary.totalExposed}h</div>
                    <div className="text-sm text-muted-foreground">of {exposureSummary.totalContracted}h committed ({exposureSummary.percent}%)</div>
                  </div>
                  <div style={{ width: 120, height: 80 }}>
                    <ResponsiveContainer width="100%" height={80}>
                      <LineChart data={complianceTrend}>
                        <XAxis dataKey="month" />
                        <YAxis domain={[60, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="compliance" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {contracts.map((c) => {
                    const pct = Math.round((c.exposedHours / Math.max(1, c.contractedHours)) * 100);
                    // mock small history for sparkline
                    const history = Array.from({ length: 8 }, (_, i) => Math.max(0, c.exposedHours - (7 - i) * 5 + (i % 2 ? 3 : -2)));
                    return (
                      <div key={c.id} className="flex items-center justify-between gap-3 p-2 rounded bg-muted/50">
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.exposedHours}h / {c.contractedHours}h ({pct}%)</div>
                          <div className="mt-1"><Sparkline values={history} /></div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${c.revenueEarned.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Target ${c.revenueTarget.toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Risk Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Automated alerts for contracts approaching revenue shortfall or exposure deficits.</div>
                  <div className="mt-3 space-y-2">
                    {contracts.map((c) => {
                      const pct = Math.round((c.exposedHours / Math.max(1, c.contractedHours)) * 100);
                      const isAtRisk = pct < 90 || c.revenueEarned < c.revenueTarget * 0.9;
                      return (
                        <div key={c.id} className={`flex items-center justify-between p-2 rounded ${isAtRisk ? (pct < 80 ? 'bg-red-50' : 'bg-yellow-50') : ''}`}>
                          <div className="text-sm">{c.name} — Exposure at {pct}%</div>
                          <div className={`text-sm font-semibold ${isAtRisk ? (pct < 80 ? 'text-red-600' : 'text-yellow-700') : 'text-green-700'}`}>{isAtRisk ? (pct < 80 ? 'Breach Risk' : 'At Risk') : 'On Track'}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Optimal Wrap Rotation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">AI-suggested rotation maximizing exposure while balancing ad fatigue.</div>
                  <div className="mt-3 space-y-2">
                    <div className="p-3 rounded bg-muted/50">Next Rotation: Swap Acme Corp with Transit Foods at 02:00</div>
                    <div className="p-3 rounded bg-muted/50">Projected exposure gain: 6%</div>
                    <Button className="mt-3">Apply Rotation</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={revenueRisk} dataKey="value" cx="50%" cy="50%" outerRadius={60}>
                          {revenueRisk.map((r, i) => (
                            <Cell key={i} fill={r.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">Revenue impact: Dashboard shows historical compliance vs revenue earned per advertiser.</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>What-if Simulation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded bg-muted/50">
                    <div className="text-sm text-muted-foreground">Adjust rotation aggressiveness</div>
                    <div className="font-medium mt-1">Moderate</div>
                  </div>
                  <div className="p-3 rounded bg-muted/50">
                    <div className="text-sm text-muted-foreground">Prioritise</div>
                    <div className="font-medium mt-1">High Revenue Contracts</div>
                  </div>
                  <div className="p-3 rounded bg-muted/50">
                    <div className="text-sm text-muted-foreground">Run</div>
                    <Button className="w-full mt-2">Run Simulation</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="current">
                  <TabsList>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="current">Current</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  </TabsList>

                  <TabsContent value="past">
                    <div className="space-y-2">
                      {campaigns.filter(c => c.status === 'completed').map(c => (
                        <div key={c.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <div>
                            <div className="font-medium">{c.name} <span className="text-xs text-muted-foreground">({c.status})</span></div>
                            <div className="text-xs text-muted-foreground">In charge: {c.inCharge} • Type: {c.adType}</div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-sm font-semibold">{c.achievedPercent}%</div>
                            <Button size="sm" variant="ghost" onClick={() => setActiveCampaign(c)}>Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="current">
                    <div className="space-y-2">
                      {campaigns.filter(c => c.status === 'ongoing').map(c => (
                        <div key={c.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <div>
                            <div className="font-medium">{c.name} <span className="text-xs text-muted-foreground">({c.status})</span></div>
                            <div className="text-xs text-muted-foreground">In charge: {c.inCharge} • Type: {c.adType}</div>
                            <div className="text-xs text-muted-foreground">Trains: {c.trains.join(", ")}</div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-sm font-semibold">{c.achievedPercent}%</div>
                            <Button size="sm" variant="ghost" onClick={() => setActiveCampaign(c)}>Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="upcoming">
                    <div className="space-y-2">
                      {campaigns.filter(c => c.status === 'upcoming').map(c => (
                        <div key={c.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <div>
                            <div className="font-medium">{c.name} <span className="text-xs text-muted-foreground">({c.status})</span></div>
                            <div className="text-xs text-muted-foreground">In charge: {c.inCharge} • Type: {c.adType}</div>
                            <div className="text-xs text-muted-foreground">Target: {c.predictionTargetDate}</div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-sm font-semibold">{c.achievedPercent}%</div>
                            <Button size="sm" variant="ghost" onClick={() => setActiveCampaign(c)}>Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
