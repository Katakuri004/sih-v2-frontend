"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface ComponentData {
  id: string;
  componentName: string;
  trainNumber: string;
  healthScore: number;
  lastMaintenance: string;
  nextMaintenance: string;
  status: "Good" | "Warning" | "Critical";
  predictedFailure: string;
}

const mockComponentData: ComponentData[] = [
  {
    id: "1",
    componentName: "Brake System",
    trainNumber: "T-001",
    healthScore: 85,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-02-15",
    status: "Good",
    predictedFailure: "6 months",
  },
  {
    id: "2",
    componentName: "Motor Assembly",
    trainNumber: "T-002",
    healthScore: 45,
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-01",
    status: "Warning",
    predictedFailure: "2 months",
  },
  {
    id: "3",
    componentName: "Door Mechanism",
    trainNumber: "T-003",
    healthScore: 15,
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-01-25",
    status: "Critical",
    predictedFailure: "2 weeks",
  },
  {
    id: "4",
    componentName: "HVAC System",
    trainNumber: "T-001",
    healthScore: 72,
    lastMaintenance: "2024-01-12",
    nextMaintenance: "2024-02-12",
    status: "Good",
    predictedFailure: "4 months",
  },
  {
    id: "5",
    componentName: "Suspension",
    trainNumber: "T-004",
    healthScore: 38,
    lastMaintenance: "2024-01-08",
    nextMaintenance: "2024-01-28",
    status: "Warning",
    predictedFailure: "6 weeks",
  },
];

export function ComponentHealthTable() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const getHealthColor = (score: number) => {
    if (score > 50) return "text-chart-1";
    if (score > 20) return "text-secondary";
    return "text-destructive";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusBadge = (status: ComponentData["status"]) => {
    const variants = {
      Good: "default",
      Warning: "secondary",
      Critical: "destructive",
    } as const;

    return (
      <Badge variant={variants[status]} className="font-medium">
        {status}
      </Badge>
    );
  };

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? "animate-fade-in" : "opacity-0"
      }`}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead>Train</TableHead>
            <TableHead>Health Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Maintenance</TableHead>
            <TableHead>Next Maintenance</TableHead>
            <TableHead>Predicted Failure</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockComponentData.map((component, index) => (
            <TableRow
              key={component.id}
              className={`transition-all duration-300 hover:bg-muted/50 border-b border-gray-300 dark:border-gray-600 ${
                isVisible ? "animate-slide-in" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TableCell className="font-medium">
                {component.componentName}
              </TableCell>
              <TableCell>{component.trainNumber}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative w-20">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 border border-gray-300 dark:border-gray-600">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                          component.healthScore
                        )}`}
                        style={{ width: `${component.healthScore}%` }}
                      />
                    </div>
                  </div>
                  <span
                    className={`text-sm font-medium ${getHealthColor(
                      component.healthScore
                    )}`}
                  >
                    {component.healthScore}%
                  </span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(component.status)}</TableCell>
              <TableCell>{formatDate(component.lastMaintenance)}</TableCell>
              <TableCell>{formatDate(component.nextMaintenance)}</TableCell>
              <TableCell className="text-muted-foreground">
                {component.predictedFailure}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
