"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, Clock, Calendar, CalendarDays } from "lucide-react"

// Generate mock data for different time periods
const generate30MinData = () => {
  const data = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000)
    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      passengers: Math.floor(Math.random() * 500) + 200,
      inbound: Math.floor(Math.random() * 250) + 100,
      outbound: Math.floor(Math.random() * 250) + 100,
    })
  }
  return data
}

const generate24HourData = () => {
  const data = []
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0") + ":00"
    const basePassengers = i < 6 || i > 22 ? 100 : (i >= 7 && i <= 9) || (i >= 17 && i <= 19) ? 800 : 400
    data.push({
      time: hour,
      passengers: basePassengers + Math.floor(Math.random() * 200),
      inbound: Math.floor((basePassengers + Math.random() * 200) * 0.6),
      outbound: Math.floor((basePassengers + Math.random() * 200) * 0.4),
    })
  }
  return data
}

const generate7DayData = () => {
  const data = []
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  days.forEach((day, index) => {
    const isWeekend = index >= 5
    const basePassengers = isWeekend ? 15000 : 25000
    data.push({
      time: day,
      passengers: basePassengers + Math.floor(Math.random() * 5000),
      inbound: Math.floor((basePassengers + Math.random() * 5000) * 0.55),
      outbound: Math.floor((basePassengers + Math.random() * 5000) * 0.45),
    })
  })
  return data
}

export function PassengerFlowAnalytics() {
  const [activeTab, setActiveTab] = useState("30min")

  const data30Min = generate30MinData()
  const data24Hour = generate24HourData()
  const data7Day = generate7DayData()

  const getDataForTab = (tab: string) => {
    switch (tab) {
      case "30min":
        return data30Min
      case "24hour":
        return data24Hour
      case "7day":
        return data7Day
      default:
        return data30Min
    }
  }

  const getCurrentTotal = (tab: string) => {
    const data = getDataForTab(tab)
    const latest = data[data.length - 1]
    return latest?.passengers || 0
  }

  const getTimeLabel = (tab: string) => {
    switch (tab) {
      case "30min":
        return "Last 30 Minutes"
      case "24hour":
        return "Last 24 Hours"
      case "7day":
        return "Last 7 Days"
      default:
        return "Real-time"
    }
  }

  const getIcon = (tab: string) => {
    switch (tab) {
      case "30min":
        return Clock
      case "24hour":
        return Calendar
      case "7day":
        return CalendarDays
      default:
        return TrendingUp
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Passenger Flow Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="30min" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              30 Minutes
            </TabsTrigger>
            <TabsTrigger value="24hour" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              24 Hours
            </TabsTrigger>
            <TabsTrigger value="7day" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />7 Days
            </TabsTrigger>
          </TabsList>

          <TabsContent value="30min" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Real-time Flow - Last 30 Minutes</h3>
                <p className="text-sm text-muted-foreground">Live passenger movement data updated every minute</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{getCurrentTotal("30min").toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Current passengers</div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data30Min}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="inbound"
                    stackId="1"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                    name="Inbound"
                  />
                  <Area
                    type="monotone"
                    dataKey="outbound"
                    stackId="1"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.6}
                    name="Outbound"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="24hour" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Daily Pattern - Last 24 Hours</h3>
                <p className="text-sm text-muted-foreground">Hourly passenger flow showing peak and off-peak periods</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{getCurrentTotal("24hour").toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total today</div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data24Hour}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="passengers"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    name="Total Passengers"
                  />
                  <Line
                    type="monotone"
                    dataKey="inbound"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Inbound"
                  />
                  <Line
                    type="monotone"
                    dataKey="outbound"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Outbound"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="7day" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Weekly Trends - Last 7 Days</h3>
                <p className="text-sm text-muted-foreground">
                  Daily passenger totals showing weekday vs weekend patterns
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{(getCurrentTotal("7day") * 7).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Weekly total</div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data7Day}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="passengers"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={3}
                    name="Total Passengers"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
