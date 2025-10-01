"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface GanttData {
  trainId: string;
  trainNumber: string;
  schedule: {
    time: string;
    status: "service" | "maintenance" | "standby";
    duration: number; // in hours
    location?: string;
  }[];
}

const mockGanttData: GanttData[] = [
  {
    trainId: "T-001",
    trainNumber: "T-001",
    schedule: [
      { time: "05:30", status: "service", duration: 8.5, location: "Line 1" },
      {
        time: "14:00",
        status: "maintenance",
        duration: 2,
        location: "Depot A",
      },
      { time: "16:00", status: "service", duration: 6, location: "Line 2" },
      { time: "22:00", status: "standby", duration: 2, location: "Depot A" },
    ],
  },
  {
    trainId: "T-002",
    trainNumber: "T-002",
    schedule: [
      { time: "06:00", status: "service", duration: 9, location: "Line 1" },
      { time: "15:00", status: "standby", duration: 2, location: "Depot B" },
      { time: "17:00", status: "service", duration: 5, location: "Line 2" },
      {
        time: "22:00",
        status: "maintenance",
        duration: 2,
        location: "Depot B",
      },
    ],
  },
  {
    trainId: "T-003",
    trainNumber: "T-003",
    schedule: [
      {
        time: "00:00",
        status: "maintenance",
        duration: 6,
        location: "Depot A",
      },
      { time: "06:00", status: "service", duration: 10, location: "Line 1" },
      { time: "16:00", status: "standby", duration: 2, location: "Depot A" },
      { time: "18:00", status: "service", duration: 6, location: "Line 2" },
    ],
  },
  {
    trainId: "T-007",
    trainNumber: "T-007",
    schedule: [
      { time: "05:00", status: "service", duration: 7, location: "Line 2" },
      {
        time: "12:00",
        status: "maintenance",
        duration: 4,
        location: "Depot B",
      },
      { time: "16:00", status: "service", duration: 6, location: "Line 1" },
      { time: "22:00", status: "standby", duration: 2, location: "Depot B" },
    ],
  },
  {
    trainId: "T-015",
    trainNumber: "T-015",
    schedule: [
      { time: "07:00", status: "service", duration: 8, location: "Line 1" },
      { time: "15:00", status: "standby", duration: 3, location: "Depot A" },
      { time: "18:00", status: "service", duration: 4, location: "Line 2" },
      {
        time: "22:00",
        status: "maintenance",
        duration: 2,
        location: "Depot A",
      },
    ],
  },
];

export function GanttChart() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedBars, setAnimatedBars] = useState<boolean[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Animate bars one by one
      mockGanttData.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedBars((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, index * 200);
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "service":
        return "bg-chart-1";
      case "maintenance":
        return "bg-destructive";
      case "standby":
        return "bg-chart-2";
      default:
        return "bg-muted";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "service":
        return "In Service";
      case "maintenance":
        return "Maintenance";
      case "standby":
        return "Standby";
      default:
        return "Unknown";
    }
  };

  return (
    <Card
      className={`transition-all duration-500 ${
        isVisible ? "animate-fade-in" : "opacity-0"
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>24-Hour Fleet Gantt Chart</CardTitle>
          <div className="text-sm text-muted-foreground">
            Real-time fleet scheduling • Updated:{" "}
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex text-xs text-muted-foreground border-b pb-2">
            <div className="w-20 text-left font-medium">Train</div>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="flex-1 text-center relative">
                <div className="font-medium">{String(i).padStart(2, "0")}</div>
                <div className="text-[10px] text-muted-foreground/60">00</div>
              </div>
            ))}
          </div>

          {mockGanttData.map((train, trainIndex) => (
            <div
              key={train.trainId}
              className="flex items-center group hover:bg-muted/20 rounded-lg p-1 transition-colors"
            >
              <div className="w-20 text-sm font-medium text-left">
                {train.trainNumber}
              </div>
              <div className="flex-1 relative h-10 bg-muted/10 rounded-md border overflow-hidden">
                {/* Hour grid lines */}
                {Array.from({ length: 23 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 border-l border-muted/30"
                    style={{ left: `${((i + 1) / 24) * 100}%` }}
                  />
                ))}

                {train.schedule.map((item, itemIndex) => {
                  const startHour = Number.parseInt(item.time.split(":")[0]);
                  const startMinute = Number.parseInt(item.time.split(":")[1]);
                  const startTime = startHour + startMinute / 60;
                  const endTime = startTime + item.duration;

                  // Ensure the bar doesn't extend beyond 24 hours
                  const clampedEndTime = Math.min(endTime, 24);
                  const clampedDuration = clampedEndTime - startTime;

                  const startPercent = (startTime / 24) * 100;
                  const widthPercent = (clampedDuration / 24) * 100;

                  // Don't render if the bar would be too small or start after 24 hours
                  if (startTime >= 24 || widthPercent <= 0) {
                    return null;
                  }

                  return (
                    <div
                      key={itemIndex}
                      className={`absolute top-1 bottom-1 rounded-sm transition-all duration-1000 ease-out ${getStatusColor(
                        item.status
                      )} ${
                        animatedBars[trainIndex]
                          ? "opacity-100"
                          : "opacity-0 w-0"
                      } hover:shadow-md cursor-pointer group/bar`}
                      style={{
                        left: `${startPercent}%`,
                        width: animatedBars[trainIndex]
                          ? `${widthPercent}%`
                          : "0%",
                        transitionDelay: `${itemIndex * 100}ms`,
                      }}
                      title={`${getStatusLabel(item.status)}: ${
                        item.time
                      } (${clampedDuration.toFixed(1)}h) - ${
                        item.location || "Unknown"
                      }`}
                    >
                      <div className="h-full flex items-center justify-center text-white text-xs font-medium opacity-0 group-hover/bar:opacity-100 transition-opacity">
                        {clampedDuration.toFixed(1)}h
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-chart-1 rounded"></div>
              <span className="text-sm">In Service</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-destructive rounded"></div>
              <span className="text-sm">Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-chart-2 rounded"></div>
              <span className="text-sm">Standby</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Hover over bars for detailed information
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
