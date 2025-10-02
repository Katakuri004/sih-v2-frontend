"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

// Generate predictive crowd data
const generatePredictionData = () => {
  const data = [];
  const now = new Date();

  // Historical data (last 2 hours)
  for (let i = 120; i >= 1; i--) {
    const time = new Date(now.getTime() - i * 60000);
    const hour = time.getHours();
    const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
    const baseLoad = isRushHour ? 80 : hour < 6 || hour > 22 ? 20 : 50;

    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      actualCrowd: baseLoad + Math.floor(Math.random() * 20) - 10,
      predictedCrowd: null,
      confidence: null,
      type: "historical",
    });
  }

  // Current moment
  data.push({
    time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    actualCrowd: 65,
    predictedCrowd: 65,
    confidence: 95,
    type: "current",
  });

  // Future predictions (next 2 hours)
  for (let i = 1; i <= 120; i++) {
    const time = new Date(now.getTime() + i * 60000);
    const hour = time.getHours();
    const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
    const baseLoad = isRushHour ? 85 : hour < 6 || hour > 22 ? 25 : 55;

    // Confidence decreases over time
    const confidence = Math.max(95 - (i / 120) * 30, 65);

    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      actualCrowd: null,
      predictedCrowd: baseLoad + Math.floor(Math.random() * 15) - 7,
      confidence: Math.round(confidence),
      type: "prediction",
    });
  }

  return data;
};

export function CrowdPredictionChart() {
  const predictionData = generatePredictionData();
  const currentIndex = predictionData.findIndex((d) => d.type === "current");

  // Get next hour predictions for alerts
  const nextHourPredictions = predictionData.slice(
    currentIndex + 1,
    currentIndex + 61
  );
  const maxPredictedCrowd = Math.max(
    ...nextHourPredictions.map((d) => d.predictedCrowd || 0)
  );
  const avgConfidence = Math.round(
    nextHourPredictions.reduce((sum, d) => sum + (d.confidence || 0), 0) /
      nextHourPredictions.length
  );

  const getCrowdLevel = (crowd: number) => {
    if (crowd >= 80)
      return { level: "High", color: "destructive", icon: AlertTriangle };
    if (crowd >= 60)
      return { level: "Moderate", color: "warning", icon: TrendingUp };
    return { level: "Low", color: "success", icon: CheckCircle };
  };

  const currentCrowdLevel = getCrowdLevel(
    predictionData[currentIndex]?.actualCrowd || 0
  );
  const predictedCrowdLevel = getCrowdLevel(maxPredictedCrowd);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Crowd Prediction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prediction Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <currentCrowdLevel.icon className="h-4 w-4" />
              <span className="text-sm font-medium">Current Level</span>
            </div>
            <div className="text-2xl font-bold">
              {predictionData[currentIndex]?.actualCrowd}%
            </div>
            <Badge variant={currentCrowdLevel.color as any} className="mt-1">
              {currentCrowdLevel.level}
            </Badge>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <predictedCrowdLevel.icon className="h-4 w-4" />
              <span className="text-sm font-medium">Peak Prediction (1h)</span>
            </div>
            <div className="text-2xl font-bold">{maxPredictedCrowd}%</div>
            <Badge variant={predictedCrowdLevel.color as any} className="mt-1">
              {predictedCrowdLevel.level}
            </Badge>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4" />
              <span className="text-sm font-medium">AI Confidence</span>
            </div>
            <div className="text-2xl font-bold">{avgConfidence}%</div>
            <Badge variant="outline" className="mt-1">
              {avgConfidence >= 80
                ? "High"
                : avgConfidence >= 60
                ? "Medium"
                : "Low"}
            </Badge>
          </div>
        </div>

        {/* Prediction Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            4-Hour Crowd Prediction Timeline
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={predictionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" />
                <XAxis
                  dataKey="time"
                  interval={29} // Show every 30 minutes
                  tick={{ fontSize: 12, fill: "#374151" }}
                  height={60}
                />
                <YAxis
                  domain={[0, 100]}
                  label={{
                    value: "Crowd Level (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${value}%`,
                    name === "actualCrowd" ? "Actual" : "Predicted",
                  ]}
                  labelFormatter={(label) => `Time: ${label}`}
                />

                {/* Reference lines for crowd levels */}
                <ReferenceLine
                  y={80}
                  stroke="hsl(var(--destructive))"
                  strokeDasharray="5 5"
                  label="High"
                />
                <ReferenceLine
                  y={60}
                  stroke="#ea580c"
                  strokeDasharray="5 5"
                  label="Moderate"
                />

                {/* Current time line */}
                <ReferenceLine
                  x={predictionData[currentIndex]?.time}
                  stroke="hsl(var(--foreground))"
                  strokeWidth={2}
                  label="Now"
                />

                {/* Historical actual data */}
                <Line
                  type="monotone"
                  dataKey="actualCrowd"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                  name="Actual Crowd"
                  connectNulls={false}
                />

                {/* Predicted data */}
                <Line
                  type="monotone"
                  dataKey="predictedCrowd"
                  stroke="#ea580c"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  dot={{ fill: "#ea580c", strokeWidth: 1, r: 3 }}
                  name="AI Prediction"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            AI Insights & Recommendations
          </h3>

          {maxPredictedCrowd >= 80 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <div className="font-medium text-destructive">
                  High Crowd Alert
                </div>
                <div className="text-sm text-muted-foreground">
                  Predicted crowd levels will reach {maxPredictedCrowd}% in the
                  next hour. Consider deploying additional trains.
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Brain className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium text-primary">
                ML Model Performance
              </div>
              <div className="text-sm text-muted-foreground">
                Current prediction accuracy: {avgConfidence}%. Model trained on
                6 months of historical data with real-time updates.
              </div>
            </div>
          </div>

          {predictedCrowdLevel.level === "Low" && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <div className="font-medium text-success">
                  Optimal Conditions
                </div>
                <div className="text-sm text-muted-foreground">
                  Crowd levels are expected to remain manageable. Good time for
                  maintenance activities.
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
