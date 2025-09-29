"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

interface MaintenanceTask {
  date: Date
  trainNumber: string
  component: string
  type: "Scheduled" | "Preventive" | "Emergency"
  duration: string
  technician: string
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
]

export function MaintenanceCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400)
    return () => clearTimeout(timer)
  }, [])

  const getTasksForDate = (date: Date) => {
    return maintenanceTasks.filter((task) => task.date.toDateString() === date.toDateString())
  }

  const hasTasksOnDate = (date: Date) => {
    return maintenanceTasks.some((task) => task.date.toDateString() === date.toDateString())
  }

  const getTaskTypeBadge = (type: MaintenanceTask["type"]) => {
    const variants = {
      Scheduled: "default",
      Preventive: "secondary",
      Emergency: "destructive",
    } as const

    return (
      <Badge variant={variants[type]} className="text-xs">
        {type}
      </Badge>
    )
  }

  return (
    <Card className={`transition-all duration-500 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
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
              {selectedDate ? `Tasks for ${selectedDate.toLocaleDateString()}` : "Select a date"}
            </h3>

            {selectedDate && getTasksForDate(selectedDate).length > 0 ? (
              <div className="space-y-3">
                {getTasksForDate(selectedDate).map((task, index) => (
                  <Popover key={index}>
                    <PopoverTrigger asChild>
                      <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{task.trainNumber}</span>
                          {getTaskTypeBadge(task.type)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{task.component}</p>
                          <p>Duration: {task.duration}</p>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{task.trainNumber} Maintenance</h4>
                          {getTaskTypeBadge(task.type)}
                        </div>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Component:</span> {task.component}
                          </p>
                          <p>
                            <span className="font-medium">Duration:</span> {task.duration}
                          </p>
                          <p>
                            <span className="font-medium">Technician:</span> {task.technician}
                          </p>
                          <p>
                            <span className="font-medium">Date:</span> {task.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            ) : selectedDate ? (
              <p className="text-muted-foreground">No maintenance tasks scheduled for this date.</p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
