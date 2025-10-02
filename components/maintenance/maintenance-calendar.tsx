"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";

interface MaintenanceTask {
  date: Date;
  trainNumber: string;
  component: string;
  type: "Scheduled" | "Preventive" | "Emergency" | "Corrective" | "Inspection";
  duration: string;
  technician: string;
  priority?: "High" | "Medium" | "Low";
  isManual?: boolean;
}

interface MaintenanceSchedule {
  id: string;
  trainNumber: string;
  type: "Preventive" | "Corrective" | "Inspection";
  component: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  priority: "High" | "Medium" | "Low";
  status: "scheduled" | "pending_review" | "approved" | "rejected";
  isAIGenerated: boolean;
  assignedTechnician?: string;
}

interface MaintenanceCalendarProps {
  manualSchedules?: MaintenanceSchedule[];
}

const maintenanceTasks: MaintenanceTask[] = [
  {
    date: new Date(2024, 11, 25),
    trainNumber: "T-001",
    component: "Brake System",
    type: "Scheduled",
    duration: "4 hours",
    technician: "John Smith",
  },
  {
    date: new Date(2024, 11, 26),
    trainNumber: "T-003",
    component: "Door Mechanism",
    type: "Emergency",
    duration: "6 hours",
    technician: "Sarah Johnson",
  },
  {
    date: new Date(2024, 11, 28),
    trainNumber: "T-002",
    component: "Motor Assembly",
    type: "Preventive",
    duration: "8 hours",
    technician: "Mike Davis",
  },
  {
    date: new Date(2024, 11, 30),
    trainNumber: "T-004",
    component: "HVAC System",
    type: "Scheduled",
    duration: "3 hours",
    technician: "Lisa Wilson",
  },
];

export function MaintenanceCalendar({
  manualSchedules = [],
}: MaintenanceCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // Convert manual schedules to tasks (including approved ones)
  const manualTasks: MaintenanceTask[] = manualSchedules
    .filter(
      (schedule) =>
        schedule.status === "scheduled" || schedule.status === "approved"
    )
    .map((schedule) => ({
      date: new Date(schedule.scheduledDate),
      trainNumber: schedule.trainNumber,
      component: schedule.component,
      type: schedule.type as "Preventive" | "Corrective" | "Inspection",
      duration: `${schedule.duration} hours`,
      technician: schedule.assignedTechnician || "Unassigned",
      priority: schedule.priority,
      isManual: true,
    }));

  // Combine all tasks
  const allTasks = [...maintenanceTasks, ...manualTasks];

  const getTasksForDate = (date: Date) => {
    return allTasks.filter(
      (task) => task.date.toDateString() === date.toDateString()
    );
  };

  const hasTasksOnDate = (date: Date) => {
    return allTasks.some(
      (task) => task.date.toDateString() === date.toDateString()
    );
  };

  const getTaskTypeBadge = (
    type: MaintenanceTask["type"],
    isManual?: boolean
  ) => {
    const variants = {
      Scheduled: "default",
      Preventive: "secondary",
      Emergency: "destructive",
      Corrective: "destructive",
      Inspection: "outline",
    } as const;

    return (
      <div className="flex gap-1">
        <Badge variant={variants[type]} className="text-xs">
          {type}
        </Badge>
        {isManual && (
          <Badge
            variant="outline"
            className="text-xs bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700"
          >
            Manual
          </Badge>
        )}
      </div>
    );
  };

  const getPriorityBadge = (priority?: "High" | "Medium" | "Low") => {
    if (!priority) return null;

    const colors = {
      High: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
      Medium:
        "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
      Low: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
    };

    return (
      <Badge variant="outline" className={`text-xs border ${colors[priority]}`}>
        {priority}
      </Badge>
    );
  };

  return (
    <Card
      className={`transition-all duration-500 ${
        isVisible ? "animate-fade-in" : "opacity-0"
      }`}
    >
      <CardHeader>
        <CardTitle>Maintenance Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasTask: (date) => hasTasksOnDate(date),
              }}
              modifiersStyles={{
                hasTask: {
                  backgroundColor: "rgb(var(--primary))",
                  color: "rgb(var(--primary-foreground))",
                  fontWeight: "bold",
                },
              }}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              {selectedDate
                ? `Tasks for ${formatDate(selectedDate)}`
                : "Select a date"}
            </h3>

            {selectedDate && getTasksForDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
                {getTasksForDate(selectedDate).map((task, index) => (
                  <Popover key={index}>
                    <PopoverTrigger asChild>
                      <div className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            {task.trainNumber}
                          </span>
                          <div className="flex gap-1">
                            {getTaskTypeBadge(task.type, task.isManual)}
                            {getPriorityBadge(task.priority)}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{task.component}</p>
                          <p>Duration: {task.duration}</p>
                          {task.isManual && (
                            <p className="text-blue-600 dark:text-blue-400 font-medium">
                              Manually Added
                            </p>
                          )}
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">
                            {task.trainNumber} Maintenance
                          </h4>
                          <div className="flex gap-1">
                            {getTaskTypeBadge(task.type, task.isManual)}
                            {getPriorityBadge(task.priority)}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Component:</span>{" "}
                            {task.component}
                          </p>
                          <p>
                            <span className="font-medium">Duration:</span>{" "}
                            {task.duration}
                          </p>
                          <p>
                            <span className="font-medium">Technician:</span>{" "}
                            {task.technician}
                          </p>
                          <p>
                            <span className="font-medium">Date:</span>{" "}
                            {formatDate(task.date)}
                          </p>
                          {task.priority && (
                            <p>
                              <span className="font-medium">Priority:</span>{" "}
                              {task.priority}
                            </p>
                          )}
                          {task.isManual && (
                            <p className="text-blue-600 dark:text-blue-400 font-medium">
                              This is a manually added maintenance task
                            </p>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            ) : selectedDate ? (
              <p className="text-muted-foreground">
                No maintenance tasks scheduled for this date.
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
