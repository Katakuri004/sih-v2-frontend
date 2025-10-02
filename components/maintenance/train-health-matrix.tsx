"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  Wrench,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

// Mock data for 25 trains with health status for different components
const trainHealthData = Array.from({ length: 25 }, (_, i) => {
  const trainNumber = `T-${String(i + 1).padStart(3, "0")}`;
  return {
    trainNumber,
    components: {
      brakes:
        Math.random() > 0.8
          ? "critical"
          : Math.random() > 0.6
          ? "warning"
          : Math.random() > 0.3
          ? "good"
          : "excellent",
      doors:
        Math.random() > 0.8
          ? "critical"
          : Math.random() > 0.6
          ? "warning"
          : Math.random() > 0.3
          ? "good"
          : "excellent",
      hvac:
        Math.random() > 0.8
          ? "critical"
          : Math.random() > 0.6
          ? "warning"
          : Math.random() > 0.3
          ? "good"
          : "excellent",
      motor:
        Math.random() > 0.8
          ? "critical"
          : Math.random() > 0.6
          ? "warning"
          : Math.random() > 0.3
          ? "good"
          : "excellent",
      suspension:
        Math.random() > 0.8
          ? "critical"
          : Math.random() > 0.6
          ? "warning"
          : Math.random() > 0.3
          ? "good"
          : "excellent",
      signaling:
        Math.random() > 0.8
          ? "critical"
          : Math.random() > 0.6
          ? "warning"
          : Math.random() > 0.3
          ? "good"
          : "excellent",
    },
    lastMaintenance: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0],
    nextMaintenance: new Date(
      Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0],
    totalMileage: Math.floor(Math.random() * 50000) + 10000,
    serviceStatus:
      Math.random() > 0.8
        ? "maintenance"
        : Math.random() > 0.6
        ? "standby"
        : "active",
  };
});

const componentLabels = {
  brakes: "Brakes",
  doors: "Doors",
  hvac: "HVAC",
  motor: "Motor",
  suspension: "Suspension",
  signaling: "Signaling",
};

const healthColors = {
  excellent: "bg-green-500 hover:bg-green-600",
  good: "bg-blue-500 hover:bg-blue-600",
  warning: "bg-yellow-500 hover:bg-yellow-600",
  critical: "bg-red-500 hover:bg-red-600",
  maintenance: "bg-gray-500 hover:bg-gray-600",
};

const getStatusButtonColor = (status: string) => {
  switch (status) {
    case "excellent":
      return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700";
    case "good":
      return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700";
    case "warning":
      return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700";
    case "critical":
      return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700";
  }
};

const getProgressBarColor = (status: string) => {
  switch (status) {
    case "excellent":
      return "bg-green-500";
    case "good":
      return "bg-blue-500";
    case "warning":
      return "bg-yellow-500";
    case "critical":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getServiceStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700";
    case "standby":
      return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700";
    case "maintenance":
      return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700";
  }
};

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1 day";
  if (diffDays < 7) return `${diffDays} days`;
  if (diffDays < 14) return "1 week";
  if (diffDays < 21) return "2 weeks";
  if (diffDays < 30) return "3 weeks";
  if (diffDays < 60) return "1 month";
  return `${Math.floor(diffDays / 30)} months`;
};

const getRelativeTimeText = (dateString: string, isPast: boolean) => {
  const relativeTime = getRelativeTime(dateString);
  return isPast ? `${relativeTime} ago` : `in ${relativeTime}`;
};

const healthScores = {
  excellent: 95,
  good: 75,
  warning: 45,
  critical: 15,
  maintenance: 0,
};

export function TrainHealthMatrix() {
  const [selectedTrain, setSelectedTrain] = useState<
    (typeof trainHealthData)[0] | null
  >(null);

  const getOverallHealth = (components: any) => {
    const scores = Object.values(components).map(
      (status) => healthScores[status as keyof typeof healthScores]
    );
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const getHealthIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (score >= 60) return <Clock className="h-4 w-4 text-blue-500" />;
    if (score >= 40)
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <Wrench className="h-4 w-4 text-red-500" />;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Train Health Matrix
            <Badge variant="secondary" className="ml-2">
              25 Trains
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Color-coded health status for all train components. Click on train
            names for detailed view.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Legend */}
            <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                <span className="text-sm">Excellent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                <span className="text-sm">Good</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
                <span className="text-sm">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                <span className="text-sm">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded-sm"></div>
                <span className="text-sm">Maintenance</span>
              </div>
            </div>

            {/* Matrix Header */}
            <div className="grid grid-cols-8 gap-2 items-center">
              <div className="font-medium text-sm">Train</div>
              {Object.values(componentLabels).map((label) => (
                <div key={label} className="font-medium text-sm text-center">
                  {label}
                </div>
              ))}
              <div className="font-medium text-sm text-center">Overall</div>
            </div>

            {/* Matrix Rows */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {trainHealthData.map((train) => {
                const overallHealth = getOverallHealth(train.components);
                return (
                  <div
                    key={train.trainNumber}
                    className="grid grid-cols-8 gap-2 items-center py-1"
                  >
                    <button
                      onClick={() => setSelectedTrain(train)}
                      className="text-sm font-medium text-left hover:text-primary transition-colors cursor-pointer"
                    >
                      {train.trainNumber}
                    </button>
                    {Object.entries(train.components).map(
                      ([component, status]) => (
                        <div
                          key={component}
                          className={`train-health-cell ${
                            healthColors[status as keyof typeof healthColors]
                          } mx-auto`}
                          title={`${
                            componentLabels[
                              component as keyof typeof componentLabels
                            ]
                          }: ${status}`}
                        />
                      )
                    )}
                    <div className="flex items-center justify-center gap-1">
                      {getHealthIcon(overallHealth)}
                      <span className="text-xs font-medium">
                        {overallHealth}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Train View Dialog */}
      <Dialog
        open={!!selectedTrain}
        onOpenChange={() => setSelectedTrain(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              {selectedTrain?.trainNumber} - Detailed Health Overview
            </DialogTitle>
          </DialogHeader>

          {selectedTrain && (
            <div className="space-y-6">
              {/* Overall Status */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="border-2 border-gray-300 dark:border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Last Maintenance
                      </span>
                    </div>
                    <p className="text-lg font-semibold mt-1">
                      {formatDate(selectedTrain.lastMaintenance)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getRelativeTimeText(selectedTrain.lastMaintenance, true)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-gray-300 dark:border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Next Maintenance
                      </span>
                    </div>
                    <p className="text-lg font-semibold mt-1">
                      {formatDate(selectedTrain.nextMaintenance)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getRelativeTimeText(
                        selectedTrain.nextMaintenance,
                        false
                      )}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-gray-300 dark:border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total Mileage</span>
                    </div>
                    <p className="text-lg font-semibold mt-1">
                      {selectedTrain.totalMileage.toLocaleString()} km
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Component Health Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Component Health Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedTrain.components).map(
                    ([component, status]) => {
                      const score =
                        healthScores[status as keyof typeof healthScores];
                      return (
                        <Card
                          key={component}
                          className="border-2 border-gray-300 dark:border-gray-600"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">
                                {
                                  componentLabels[
                                    component as keyof typeof componentLabels
                                  ]
                                }
                              </span>
                              <Badge
                                className={`border ${getStatusButtonColor(
                                  status
                                )}`}
                                variant="outline"
                              >
                                {status}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="relative">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 border border-gray-300 dark:border-gray-600">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(
                                      status
                                    )}`}
                                    style={{ width: `${score}%` }}
                                  />
                                </div>
                              </div>
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Health Score</span>
                                <span>{score}%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Service Status */}
              <Card className="border-2 border-gray-300 dark:border-gray-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Current Service Status</span>
                    <Badge
                      className={`border ${getServiceStatusColor(
                        selectedTrain.serviceStatus
                      )}`}
                      variant="outline"
                    >
                      {selectedTrain.serviceStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
