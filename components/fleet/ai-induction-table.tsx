"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { useEffect, useState } from "react"

interface TrainData {
  id: string
  trainNumber: string
  currentStatus: "Service" | "Standby" | "Maintenance"
  location: string
  nextService: string
  aiRecommendation: string
  aiReasoning: string
}

const mockData: TrainData[] = [
  {
    id: "1",
    trainNumber: "T-001",
    currentStatus: "Service",
    location: "Central Station",
    nextService: "14:30",
    aiRecommendation: "Continue Service",
    aiReasoning: "Optimal performance metrics, no maintenance required",
  },
  {
    id: "2",
    trainNumber: "T-002",
    currentStatus: "Standby",
    location: "Depot A",
    nextService: "15:00",
    aiRecommendation: "Deploy to Line 2",
    aiReasoning: "High demand predicted on Line 2 based on historical patterns",
  },
  {
    id: "3",
    trainNumber: "T-003",
    currentStatus: "Maintenance",
    location: "Workshop",
    nextService: "16:45",
    aiRecommendation: "Extend Maintenance",
    aiReasoning: "Brake system requires additional inspection before return to service",
  },
  {
    id: "4",
    trainNumber: "T-004",
    currentStatus: "Service",
    location: "North Terminal",
    nextService: "14:15",
    aiRecommendation: "Continue Service",
    aiReasoning: "All systems nominal, passenger load within optimal range",
  },
]

export function AIInductionTable() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const getStatusBadge = (status: TrainData["currentStatus"]) => {
    const variants = {
      Service: "default",
      Standby: "secondary",
      Maintenance: "destructive",
    } as const

    return (
      <Badge variant={variants[status]} className="font-medium">
        {status}
      </Badge>
    )
  }

  return (
    <div className={`transition-all duration-500 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Train Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Next Service</TableHead>
            <TableHead>AI Recommendation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockData.map((train, index) => (
            <TableRow
              key={train.id}
              className={`transition-all duration-300 hover:bg-muted/50 ${isVisible ? "animate-slide-in" : "opacity-0"}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TableCell className="font-medium">{train.trainNumber}</TableCell>
              <TableCell>{getStatusBadge(train.currentStatus)}</TableCell>
              <TableCell>{train.location}</TableCell>
              <TableCell>{train.nextService}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{train.aiRecommendation}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{train.aiReasoning}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
