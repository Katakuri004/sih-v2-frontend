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
import { Calendar, Plus, Clock, CheckCircle, XCircle, Bot, Undo2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScheduleAlert } from "./schedule-alert"

declare namespace JSX {
  interface IntrinsicElements {
    p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
    span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    strong: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

// Types
export interface MaintenanceSchedule {
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
  rejectionReason?: string
}

type AlertType = {
  type: "approved" | "rejected" | "added" | "removed" | "undoRejection"
  id?: string
}

// Mock Data
const mockSchedules: MaintenanceSchedule[] = [
  {
    id: "T-007",
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
  // ... other mock schedules ...
]

// Component
export function MaintenanceScheduleManager() {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>(mockSchedules)
  const [selectedSchedule, setSelectedSchedule] = useState<MaintenanceSchedule | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [alert, setAlert] = useState<AlertType | null>(null)
  const [activeTab, setActiveTab] = useState<"pending" | "rejected">("pending")

  const handleApproveSchedule = (scheduleId: string) => {
    setSchedules((prev: MaintenanceSchedule[]) =>
      prev.map((schedule) =>
        schedule.id === scheduleId ? { ...schedule, status: "approved" as const } : schedule
      ),
    )
    setSelectedSchedule(null)
    setAlert({ type: "approved", id: scheduleId })
  }

  const handleRejectSchedule = (scheduleId: string, reason: string) => {
    setSchedules((prev: MaintenanceSchedule[]) => {
      const updated = prev.map((schedule) =>
        schedule.id === scheduleId 
          ? { ...schedule, status: "rejected" as const, rejectionReason: reason } 
          : schedule
      )
      return updated
    })
    setAlert({ type: "rejected", id: scheduleId })
    setRejectionReason("")
    setSelectedSchedule(null)
  }

  const handleUndoRejection = (scheduleId: string) => {
    setSchedules((prev: MaintenanceSchedule[]) => {
      const updated = prev.map((schedule) =>
        schedule.id === scheduleId
          ? { ...schedule, status: "pending_review" as const, rejectionReason: undefined }
          : schedule
      )
      return updated
    })
    setAlert({ type: "undoRejection", id: scheduleId })
  }

  const filteredSchedules = schedules.filter((schedule) => 
    activeTab === "pending" ? schedule.status === "pending_review" : schedule.status === "rejected"
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Maintenance Schedule Manager
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{filteredSchedules.length} {activeTab === "pending" ? "Pending Review" : "Rejected"}</Badge>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Manual Schedule
              </Button>
            </DialogTrigger>
            {/* Add Schedule Dialog Content will go here */}
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {alert && (
          <ScheduleAlert
            type={alert.type}
            scheduleId={alert.id}
            onClose={() => setAlert(null)}
            onUndo={alert.type === "rejected" ? () => alert.id && handleUndoRejection(alert.id) : undefined}
          />
        )}

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "pending" | "rejected")} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <div className="space-y-4">
              {filteredSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-start justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{schedule.trainNumber}</p>
                      {schedule.isAIGenerated && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Bot className="h-3 w-3" /> AI Generated
                        </Badge>
                      )}
                      <Badge variant={schedule.priority === "High" ? "destructive" : "default"}>{schedule.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {schedule.type} - {schedule.component}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {schedule.scheduledDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {schedule.scheduledTime} ({schedule.duration}h)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeTab === "pending" ? (
                      <>
                        <Button onClick={() => handleApproveSchedule(schedule.id)} size="sm" className="h-8">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => setSelectedSchedule(schedule)}
                          variant="destructive"
                          size="sm"
                          className="h-8"
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => handleUndoRejection(schedule.id)} size="sm" className="h-8">
                          <Undo2 className="mr-1 h-4 w-4" />
                          Undo Rejection
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="mt-4">
            <div className="space-y-4">
              {filteredSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-start justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{schedule.trainNumber}</p>
                      {schedule.isAIGenerated && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Bot className="h-3 w-3" /> AI Generated
                        </Badge>
                      )}
                      <Badge variant={schedule.priority === "High" ? "destructive" : "default"}>{schedule.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {schedule.type} - {schedule.component}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {schedule.scheduledDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {schedule.scheduledTime} ({schedule.duration}h)
                      </span>
                    </div>
                    {schedule.rejectionReason && (
                      <div className="mt-2 text-sm text-destructive">
                        <strong>Rejection Reason:</strong> {schedule.rejectionReason}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleUndoRejection(schedule.id)} size="sm" className="h-8">
                      <Undo2 className="mr-1 h-4 w-4" />
                      Undo Rejection
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Rejection Dialog */}
        <Dialog open={selectedSchedule !== null} onOpenChange={(open) => !open && setSelectedSchedule(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Maintenance Schedule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Rejection Reason</Label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this schedule..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedSchedule(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => selectedSchedule && handleRejectSchedule(selectedSchedule.id, rejectionReason)}
                  disabled={!rejectionReason.trim()}
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}