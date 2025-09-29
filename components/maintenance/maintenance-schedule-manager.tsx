"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Clock, CheckCircle, XCircle, Bot } from "lucide-react"

interface MaintenanceSchedule {
  id: string
  trainNumber: string
  type: "Preventive" | "Corrective" | "Inspection"
  component: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  priority: "High" | "Medium" | "Low"
  status: "scheduled" | "pending_review" | "approved" | "rejected"
  isAIGenerated: boolean
  aiReasoning?: string
  assignedTechnician?: string
  estimatedCost?: number
}

const mockSchedules: MaintenanceSchedule[] = [
  {
    id: "MS-001",
    trainNumber: "T-007",
    type: "Preventive",
    component: "Brake System",
    scheduledDate: "2024-01-26",
    scheduledTime: "14:00",
    duration: 4,
    priority: "High",
    status: "pending_review",
    isAIGenerated: true,
    aiReasoning: "Brake pad wear detected at 78%. Preventive maintenance recommended to avoid service disruption.",
    estimatedCost: 15000,
  },
  {
    id: "MS-002",
    trainNumber: "T-003",
    type: "Inspection",
    component: "Door Mechanism",
    scheduledDate: "2024-01-27",
    scheduledTime: "09:00",
    duration: 2,
    priority: "Medium",
    status: "scheduled",
    isAIGenerated: false,
    assignedTechnician: "Tech-A1",
  },
  {
    id: "MS-003",
    trainNumber: "T-015",
    type: "Corrective",
    component: "HVAC System",
    scheduledDate: "2024-01-28",
    scheduledTime: "16:00",
    duration: 6,
    priority: "High",
    status: "pending_review",
    isAIGenerated: true,
    aiReasoning:
      "Temperature regulation anomaly detected. Immediate corrective action required to maintain passenger comfort.",
    estimatedCost: 25000,
  },
]

export function MaintenanceScheduleManager() {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>(mockSchedules)
  const [selectedSchedule, setSelectedSchedule] = useState<MaintenanceSchedule | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const [newSchedule, setNewSchedule] = useState({
    trainNumber: "",
    type: "Preventive" as const,
    component: "",
    scheduledDate: "",
    scheduledTime: "",
    duration: 2,
    priority: "Medium" as const,
    assignedTechnician: "",
  })

  const handleApproveSchedule = (scheduleId: string) => {
    setSchedules((prev) =>
      prev.map((schedule) => (schedule.id === scheduleId ? { ...schedule, status: "approved" as const } : schedule)),
    )
    setSelectedSchedule(null)
  }

  const handleRejectSchedule = (scheduleId: string, reason: string) => {
    setSchedules((prev) =>
      prev.map((schedule) => (schedule.id === scheduleId ? { ...schedule, status: "rejected" as const } : schedule)),
    )
    setSelectedSchedule(null)
    setRejectionReason("")
  }

  const handleAddManualSchedule = () => {
    const schedule: MaintenanceSchedule = {
      id: `MS-${Date.now()}`,
      ...newSchedule,
      status: "scheduled",
      isAIGenerated: false,
    }
    setSchedules((prev) => [...prev, schedule])
    setShowAddDialog(false)
    setNewSchedule({
      trainNumber: "",
      type: "Preventive",
      component: "",
      scheduledDate: "",
      scheduledTime: "",
      duration: 2,
      priority: "Medium",
      assignedTechnician: "",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending_review":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Calendar className="h-4 w-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
              {schedules.filter((s) => s.status === "pending_review").length} Pending Review
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
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Train Number</Label>
                      <Input
                        value={newSchedule.trainNumber}
                        onChange={(e) => setNewSchedule((prev) => ({ ...prev, trainNumber: e.target.value }))}
                        placeholder="T-001"
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={newSchedule.type}
                        onValueChange={(value) => setNewSchedule((prev) => ({ ...prev, type: value as any }))}
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
                    <Label>Component</Label>
                    <Input
                      value={newSchedule.component}
                      onChange={(e) => setNewSchedule((prev) => ({ ...prev, component: e.target.value }))}
                      placeholder="Brake System"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={newSchedule.scheduledDate}
                        onChange={(e) => setNewSchedule((prev) => ({ ...prev, scheduledDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={newSchedule.scheduledTime}
                        onChange={(e) => setNewSchedule((prev) => ({ ...prev, scheduledTime: e.target.value }))}
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
                          setNewSchedule((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select
                        value={newSchedule.priority}
                        onValueChange={(value) => setNewSchedule((prev) => ({ ...prev, priority: value as any }))}
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
                    <Label>Assigned Technician</Label>
                    <Input
                      value={newSchedule.assignedTechnician}
                      onChange={(e) => setNewSchedule((prev) => ({ ...prev, assignedTechnician: e.target.value }))}
                      placeholder="Tech-A1"
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
            <div key={schedule.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(schedule.status)}
                    <span className="font-semibold">{schedule.trainNumber}</span>
                    {schedule.isAIGenerated && (
                      <Badge variant="outline" className="text-xs">
                        <Bot className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    )}
                  </div>
                  <Badge className={getPriorityColor(schedule.priority)}>{schedule.priority}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {schedule.type} - {schedule.component}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <div>{schedule.scheduledDate}</div>
                    <div className="text-muted-foreground">
                      {schedule.scheduledTime} ({schedule.duration}h)
                    </div>
                  </div>
                  {schedule.status === "pending_review" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedSchedule(schedule)}>
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Review AI Maintenance Schedule</DialogTitle>
                        </DialogHeader>
                        {selectedSchedule && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>Train:</strong> {selectedSchedule.trainNumber}
                              </div>
                              <div>
                                <strong>Component:</strong> {selectedSchedule.component}
                              </div>
                              <div>
                                <strong>Type:</strong> {selectedSchedule.type}
                              </div>
                              <div>
                                <strong>Priority:</strong> {selectedSchedule.priority}
                              </div>
                              <div>
                                <strong>Date:</strong> {selectedSchedule.scheduledDate}
                              </div>
                              <div>
                                <strong>Time:</strong> {selectedSchedule.scheduledTime}
                              </div>
                            </div>

                            {selectedSchedule.aiReasoning && (
                              <div>
                                <Label>AI Reasoning</Label>
                                <p className="text-sm bg-muted p-3 rounded mt-1">{selectedSchedule.aiReasoning}</p>
                              </div>
                            )}

                            {selectedSchedule.estimatedCost && (
                              <div>
                                <Label>Estimated Cost</Label>
                                <p className="text-lg font-semibold">
                                  ₹{selectedSchedule.estimatedCost.toLocaleString()}
                                </p>
                              </div>
                            )}

                            <div>
                              <Label>Rejection Reason (if rejecting)</Label>
                              <Textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Provide reason for rejection..."
                              />
                            </div>

                            <div className="flex gap-3">
                              <Button onClick={() => handleApproveSchedule(selectedSchedule.id)} className="flex-1">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleRejectSchedule(selectedSchedule.id, rejectionReason)}
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
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
