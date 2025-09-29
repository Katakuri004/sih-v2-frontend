"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState, useEffect, useRef } from "react"
import { Download } from "lucide-react"

const trainSurvivalData = {
  "T-001": {
    "Brake System": [
      { months: 0, survival: 100 },
      { months: 6, survival: 96 },
      { months: 12, survival: 92 },
      { months: 18, survival: 85 },
      { months: 24, survival: 72 },
      { months: 30, survival: 58 },
      { months: 36, survival: 38 },
      { months: 42, survival: 22 },
      { months: 48, survival: 8 },
    ],
    "Motor Assembly": [
      { months: 0, survival: 100 },
      { months: 12, survival: 94 },
      { months: 24, survival: 83 },
      { months: 36, survival: 68 },
      { months: 48, survival: 48 },
      { months: 60, survival: 28 },
      { months: 72, survival: 13 },
      { months: 84, survival: 3 },
    ],
    "Door Mechanism": [
      { months: 0, survival: 100 },
      { months: 3, survival: 93 },
      { months: 6, survival: 85 },
      { months: 9, survival: 75 },
      { months: 12, survival: 62 },
      { months: 15, survival: 47 },
      { months: 18, survival: 32 },
      { months: 21, survival: 18 },
      { months: 24, survival: 6 },
    ],
  },
  "T-007": {
    "Brake System": [
      { months: 0, survival: 100 },
      { months: 6, survival: 98 },
      { months: 12, survival: 95 },
      { months: 18, survival: 88 },
      { months: 24, survival: 75 },
      { months: 30, survival: 60 },
      { months: 36, survival: 40 },
      { months: 42, survival: 25 },
      { months: 48, survival: 10 },
    ],
    "Motor Assembly": [
      { months: 0, survival: 100 },
      { months: 12, survival: 95 },
      { months: 24, survival: 85 },
      { months: 36, survival: 70 },
      { months: 48, survival: 50 },
      { months: 60, survival: 30 },
      { months: 72, survival: 15 },
      { months: 84, survival: 5 },
    ],
    "Door Mechanism": [
      { months: 0, survival: 100 },
      { months: 3, survival: 95 },
      { months: 6, survival: 88 },
      { months: 9, survival: 78 },
      { months: 12, survival: 65 },
      { months: 15, survival: 50 },
      { months: 18, survival: 35 },
      { months: 21, survival: 20 },
      { months: 24, survival: 8 },
    ],
  },
  "T-015": {
    "Brake System": [
      { months: 0, survival: 100 },
      { months: 6, survival: 97 },
      { months: 12, survival: 93 },
      { months: 18, survival: 86 },
      { months: 24, survival: 73 },
      { months: 30, survival: 57 },
      { months: 36, survival: 37 },
      { months: 42, survival: 20 },
      { months: 48, survival: 7 },
    ],
    "Motor Assembly": [
      { months: 0, survival: 100 },
      { months: 12, survival: 96 },
      { months: 24, survival: 87 },
      { months: 36, survival: 72 },
      { months: 48, survival: 52 },
      { months: 60, survival: 32 },
      { months: 72, survival: 17 },
      { months: 84, survival: 7 },
    ],
    "Door Mechanism": [
      { months: 0, survival: 100 },
      { months: 3, survival: 94 },
      { months: 6, survival: 86 },
      { months: 9, survival: 76 },
      { months: 12, survival: 63 },
      { months: 15, survival: 48 },
      { months: 18, survival: 33 },
      { months: 21, survival: 19 },
      { months: 24, survival: 7 },
    ],
  },
}

export function SurvivalCurveChart() {
  const [selectedTrain, setSelectedTrain] = useState<keyof typeof trainSurvivalData>("T-001")
  const [selectedComponent, setSelectedComponent] = useState<keyof (typeof trainSurvivalData)["T-001"]>("Brake System")
  const [isVisible, setIsVisible] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const exportToPNG = async () => {
    if (!chartRef.current) return

    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
      })

      const link = document.createElement("a")
      link.download = `survival-curve-${selectedTrain}-${selectedComponent.replace(" ", "-")}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error("Failed to export chart:", error)
    }
  }

  return (
    <Card className={`transition-all duration-500 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Component Survival Curve</CardTitle>
          <div className="flex items-center gap-3">
            <Select
              value={selectedTrain}
              onValueChange={(value) => setSelectedTrain(value as keyof typeof trainSurvivalData)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(trainSurvivalData).map((train) => (
                  <SelectItem key={train} value={train}>
                    {train}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedComponent}
              onValueChange={(value) => setSelectedComponent(value as keyof (typeof trainSurvivalData)["T-001"])}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(trainSurvivalData[selectedTrain]).map((component) => (
                  <SelectItem key={component} value={component}>
                    {component}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={exportToPNG} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PNG
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trainSurvivalData[selectedTrain][selectedComponent]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
              <XAxis
                dataKey="months"
                stroke="rgb(var(--muted-foreground))"
                label={{ value: "Months in Service", position: "insideBottom", offset: -10 }}
              />
              <YAxis
                stroke="rgb(var(--muted-foreground))"
                label={{ value: "Survival Probability (%)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgb(var(--card))",
                  border: "1px solid rgb(var(--border))",
                  borderRadius: "8px",
                  color: "rgb(var(--card-foreground))",
                }}
                formatter={(value: number) => [`${value}%`, "Survival Probability"]}
                labelFormatter={(label: number) => `Month ${label}`}
              />
              <Line
                type="monotone"
                dataKey="survival"
                stroke="rgb(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "rgb(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "rgb(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            This curve shows the probability of {selectedComponent.toLowerCase()} in {selectedTrain} surviving without
            failure over time.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
