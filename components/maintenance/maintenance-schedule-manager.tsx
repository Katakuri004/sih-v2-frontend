"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Plus, Clock, CheckCircle, XCircle, Bot } from "lucide-react";
import { formatDate } from "@/lib/utils";

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
  aiReasoning?: string;
  assignedTechnician?: string;
  estimatedCost?: number;
}

// Generate maintenance schedules that align with train health data
const generateMaintenanceSchedules = () => {
  const schedules: MaintenanceSchedule[] = [];
  const components = [
    "Brake System",
    "Door Mechanism",
    "HVAC System",
    "Motor Assembly",
    "Suspension",
    "Signaling",
  ];
  const types: ("Preventive" | "Corrective" | "Inspection")[] = [
    "Preventive",
    "Corrective",
    "Inspection",
  ];

  // Generate schedules for the next 30 days based on train health data
  for (let i = 0; i < 5; i++) {
    const trainNumber = `T-${String(
      Math.floor(Math.random() * 25) + 1
    ).padStart(3, "0")}`;
    const component = components[Math.floor(Math.random() * components.length)];
    const type = types[Math.floor(Math.random() * types.length)];

    // Generate dates that align with the health overview (next 30 days)
    const scheduledDate = new Date(
      Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000
    );
    const scheduledTime = `${String(
      Math.floor(Math.random() * 12) + 8
    ).padStart(2, "0")}:00`;

    schedules.push({
      id: `MS-${String(i + 1).padStart(3, "0")}`,
      trainNumber,
      type,
      component,
      scheduledDate: scheduledDate.toISOString().split("T")[0],
      scheduledTime,
      duration: Math.floor(Math.random() * 6) + 2,
      priority:
        Math.random() > 0.7 ? "High" : Math.random() > 0.4 ? "Medium" : "Low",
      status: Math.random() > 0.6 ? "pending_review" : "scheduled",
      isAIGenerated: Math.random() > 0.3,
      aiReasoning:
        Math.random() > 0.5
          ? `${component} requires attention based on predictive analysis. Maintenance recommended to prevent service disruption.`
          : undefined,
      assignedTechnician:
        Math.random() > 0.5
          ? `Tech-${String.fromCharCode(65 + Math.floor(Math.random() * 3))}${
              Math.floor(Math.random() * 9) + 1
            }`
          : undefined,
      estimatedCost:
        Math.random() > 0.5
          ? Math.floor(Math.random() * 30000) + 10000
          : undefined,
    });
  }

  return schedules;
};

const mockSchedules: MaintenanceSchedule[] = generateMaintenanceSchedules();

interface MaintenanceScheduleManagerProps {
  onScheduleAdded?: (schedule: MaintenanceSchedule) => void;
  onSchedulesUpdated?: (schedules: MaintenanceSchedule[]) => void;
}

export function MaintenanceScheduleManager({
  onScheduleAdded,
  onSchedulesUpdated,
}: MaintenanceScheduleManagerProps) {
  const [schedules, setSchedules] =
    useState<MaintenanceSchedule[]>(mockSchedules);
  const [selectedSchedule, setSelectedSchedule] =
    useState<MaintenanceSchedule | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reviewedSchedules, setReviewedSchedules] = useState<{
    [key: string]: { status: string; reason?: string };
  }>({});

  // Pass initial schedules to parent component
  useEffect(() => {
    onSchedulesUpdated?.(schedules);
  }, [onSchedulesUpdated]); // Only run when onSchedulesUpdated changes

  const [newSchedule, setNewSchedule] = useState({
    trainNumber: "",
    type: "Preventive" as const,
    component: "",
    scheduledDate: "",
    scheduledTime: "",
    duration: 2,
    priority: "Medium" as const,
    assignedTechnician: "",
  });

  const handleApproveSchedule = (scheduleId: string) => {
    const updatedSchedules = schedules.map((schedule) =>
      schedule.id === scheduleId
        ? { ...schedule, status: "approved" as const }
        : schedule
    );
    setSchedules(updatedSchedules);
    onSchedulesUpdated?.(updatedSchedules);
    setReviewedSchedules((prev) => ({
      ...prev,
      [scheduleId]: { status: "approved" },
    }));
    setSelectedSchedule(null);
  };

  const handleRejectSchedule = (scheduleId: string, reason: string) => {
    if (!reason.trim()) {
      alert("Please provide a rejection reason before rejecting the schedule.");
      return;
    }

    const updatedSchedules = schedules.map((schedule) =>
      schedule.id === scheduleId
        ? { ...schedule, status: "rejected" as const }
        : schedule
    );
    setSchedules(updatedSchedules);
    onSchedulesUpdated?.(updatedSchedules);
    setReviewedSchedules((prev) => ({
      ...prev,
      [scheduleId]: { status: "rejected", reason },
    }));
    setSelectedSchedule(null);
    setRejectionReason("");
  };

  const handleAddManualSchedule = () => {
    // Validation - check if all required fields are filled
    if (
      !newSchedule.trainNumber ||
      !newSchedule.component ||
      !newSchedule.scheduledDate ||
      !newSchedule.scheduledTime ||
      !newSchedule.assignedTechnician
    ) {
      alert("Please fill in all required fields before adding the schedule.");
      return;
    }

    const schedule: MaintenanceSchedule = {
      id: `MS-${Date.now()}`,
      ...newSchedule,
      status: "scheduled",
      isAIGenerated: false,
    };
    const updatedSchedules = [...schedules, schedule];
    setSchedules(updatedSchedules);
    onScheduleAdded?.(schedule);
    onSchedulesUpdated?.(updatedSchedules);
    setShowAddDialog(false);
    setNewSchedule({
      trainNumber: "",
      type: "Preventive",
      component: "",
      scheduledDate: "",
      scheduledTime: "",
      duration: 2,
      priority: "Medium",
      assignedTechnician: "",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending_review":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Calendar className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Maintenance Schedule Manager
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge variant="outline">
              {schedules.filter((s) => s.status === "pending_review").length}{" "}
              Pending Review
            </Badge>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Manual Schedule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Manual Maintenance Schedule</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Train Number *</Label>
                      <Input
                        value={newSchedule.trainNumber}
                        onChange={(e) =>
                          setNewSchedule((prev) => ({
                            ...prev,
                            trainNumber: e.target.value,
                          }))
                        }
                        placeholder="T-001"
                        className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                        required
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={newSchedule.type}
                        onValueChange={(value) =>
                          setNewSchedule((prev) => ({
                            ...prev,
                            type: value as any,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Preventive">Preventive</SelectItem>
                          <SelectItem value="Corrective">Corrective</SelectItem>
                          <SelectItem value="Inspection">Inspection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Component *</Label>
                    <Input
                      value={newSchedule.component}
                      onChange={(e) =>
                        setNewSchedule((prev) => ({
                          ...prev,
                          component: e.target.value,
                        }))
                      }
                      placeholder="Brake System"
                      className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date *</Label>
                      <Input
                        type="date"
                        value={newSchedule.scheduledDate}
                        onChange={(e) =>
                          setNewSchedule((prev) => ({
                            ...prev,
                            scheduledDate: e.target.value,
                          }))
                        }
                        className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                        required
                      />
                    </div>
                    <div>
                      <Label>Time *</Label>
                      <Input
                        type="time"
                        value={newSchedule.scheduledTime}
                        onChange={(e) =>
                          setNewSchedule((prev) => ({
                            ...prev,
                            scheduledTime: e.target.value,
                          }))
                        }
                        className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Duration (hours)</Label>
                      <Input
                        type="number"
                        value={newSchedule.duration}
                        onChange={(e) =>
                          setNewSchedule((prev) => ({
                            ...prev,
                            duration: Number.parseInt(e.target.value),
                          }))
                        }
                        className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select
                        value={newSchedule.priority}
                        onValueChange={(value) =>
                          setNewSchedule((prev) => ({
                            ...prev,
                            priority: value as any,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Assigned Technician *</Label>
                    <Input
                      value={newSchedule.assignedTechnician}
                      onChange={(e) =>
                        setNewSchedule((prev) => ({
                          ...prev,
                          assignedTechnician: e.target.value,
                        }))
                      }
                      placeholder="Tech-A1"
                      className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      required
                    />
                  </div>
                  <Button onClick={handleAddManualSchedule} className="w-full">
                    Add Schedule
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(schedule.status)}
                    <span className="font-semibold">
                      {schedule.trainNumber}
                    </span>
                    {schedule.isAIGenerated && (
                      <Badge variant="outline" className="text-xs">
                        <Bot className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    )}
                  </div>
                  <Badge className={getPriorityColor(schedule.priority)}>
                    {schedule.priority}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {schedule.type} - {schedule.component}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <div>{formatDate(schedule.scheduledDate)}</div>
                    <div className="text-muted-foreground">
                      {schedule.scheduledTime} ({schedule.duration}h)
                    </div>
                  </div>
                  {(schedule.status === "pending_review" ||
                    reviewedSchedules[schedule.id]) && (
                    <div className="flex items-center gap-2">
                      {reviewedSchedules[schedule.id] && (
                        <Badge
                          className={`border ${
                            reviewedSchedules[schedule.id].status === "approved"
                              ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                              : "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700"
                          }`}
                          variant="outline"
                        >
                          {reviewedSchedules[schedule.id].status}
                        </Badge>
                      )}
                      <Dialog
                        open={selectedSchedule?.id === schedule.id}
                        onOpenChange={(open) =>
                          !open && setSelectedSchedule(null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSchedule(schedule)}
                          >
                            {reviewedSchedules[schedule.id]
                              ? "Re-Review"
                              : "Review"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Review AI Maintenance Schedule
                            </DialogTitle>
                          </DialogHeader>
                          {selectedSchedule && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <strong>Train:</strong>{" "}
                                  {selectedSchedule.trainNumber}
                                </div>
                                <div>
                                  <strong>Component:</strong>{" "}
                                  {selectedSchedule.component}
                                </div>
                                <div>
                                  <strong>Type:</strong> {selectedSchedule.type}
                                </div>
                                <div>
                                  <strong>Priority:</strong>{" "}
                                  {selectedSchedule.priority}
                                </div>
                                <div>
                                  <strong>Date:</strong>{" "}
                                  {formatDate(selectedSchedule.scheduledDate)}
                                </div>
                                <div>
                                  <strong>Time:</strong>{" "}
                                  {selectedSchedule.scheduledTime}
                                </div>
                              </div>

                              {selectedSchedule.aiReasoning && (
                                <div>
                                  <Label>AI Reasoning</Label>
                                  <p className="text-sm bg-muted p-3 rounded mt-1">
                                    {selectedSchedule.aiReasoning}
                                  </p>
                                </div>
                              )}

                              {selectedSchedule.estimatedCost && (
                                <div>
                                  <Label>Estimated Cost</Label>
                                  <p className="text-lg font-semibold">
                                    ₹
                                    {selectedSchedule.estimatedCost.toLocaleString()}
                                  </p>
                                </div>
                              )}

                              <div>
                                <Label>Rejection Reason (if rejecting) *</Label>
                                <Textarea
                                  value={rejectionReason}
                                  onChange={(e) =>
                                    setRejectionReason(e.target.value)
                                  }
                                  placeholder="Provide reason for rejection..."
                                  className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                                />
                              </div>

                              <div className="flex gap-3">
                                <Button
                                  onClick={() =>
                                    handleApproveSchedule(selectedSchedule.id)
                                  }
                                  className="flex-1"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleRejectSchedule(
                                      selectedSchedule.id,
                                      rejectionReason
                                    )
                                  }
                                  className="flex-1"
                                  disabled={!rejectionReason.trim()}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
