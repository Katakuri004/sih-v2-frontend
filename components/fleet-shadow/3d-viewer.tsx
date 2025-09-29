"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"

interface Train3D {
  id: string
  trainNumber: string
  position: { x: number; y: number; z: number }
  status: "active" | "maintenance" | "standby"
  route: string
  passengers: number
  speed: number
}

const mockTrains: Train3D[] = [
  {
    id: "1",
    trainNumber: "T-001",
    position: { x: 100, y: 50, z: 0 },
    status: "active",
    route: "Line 1 - Central",
    passengers: 245,
    speed: 65,
  },
  {
    id: "2",
    trainNumber: "T-002",
    position: { x: 300, y: 150, z: 0 },
    status: "standby",
    route: "Line 2 - North",
    passengers: 0,
    speed: 0,
  },
  {
    id: "3",
    trainNumber: "T-003",
    position: { x: 200, y: 250, z: 0 },
    status: "maintenance",
    route: "Depot",
    passengers: 0,
    speed: 0,
  },
  {
    id: "4",
    trainNumber: "T-004",
    position: { x: 400, y: 100, z: 0 },
    status: "active",
    route: "Line 3 - South",
    passengers: 189,
    speed: 72,
  },
]

interface Viewer3DProps {
  onTrainSelect: (train: Train3D | null) => void
  selectedTrain: Train3D | null
  simulationMode: boolean
}

export function Viewer3D({ onTrainSelect, selectedTrain, simulationMode }: Viewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [trains, setTrains] = useState(mockTrains)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      canvas.style.width = rect.width + "px"
      canvas.style.height = rect.height + "px"
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const drawTrain = (train: Train3D, isSelected: boolean) => {
      const { x, y } = train.position

      // Train body
      ctx.fillStyle = isSelected ? "rgb(var(--primary))" : getTrainColor(train.status)
      ctx.fillRect(x - 20, y - 8, 40, 16)

      // Train outline
      ctx.strokeStyle = isSelected ? "rgb(var(--primary-foreground))" : "rgb(var(--border))"
      ctx.lineWidth = isSelected ? 3 : 1
      ctx.strokeRect(x - 20, y - 8, 40, 16)

      // Train number
      ctx.fillStyle = "rgb(var(--foreground))"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(train.trainNumber, x, y - 15)

      // Status indicator
      ctx.fillStyle = getStatusColor(train.status)
      ctx.beginPath()
      ctx.arc(x + 15, y - 15, 4, 0, 2 * Math.PI)
      ctx.fill()

      // Selection highlight
      if (isSelected) {
        ctx.strokeStyle = "rgb(var(--primary))"
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.strokeRect(x - 25, y - 13, 50, 26)
        ctx.setLineDash([])
      }
    }

    const getTrainColor = (status: string) => {
      switch (status) {
        case "active":
          return "rgb(var(--chart-1))"
        case "maintenance":
          return "rgb(var(--destructive))"
        case "standby":
          return "rgb(var(--chart-2))"
        default:
          return "rgb(var(--muted))"
      }
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case "active":
          return "rgb(var(--chart-1))"
        case "maintenance":
          return "rgb(var(--destructive))"
        case "standby":
          return "rgb(var(--chart-2))"
        default:
          return "rgb(var(--muted))"
      }
    }

    const drawGrid = () => {
      ctx.strokeStyle = "rgb(var(--border))"
      ctx.lineWidth = 0.5

      const gridSize = 50
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
    }

    const drawSimulationOverlay = () => {
      if (simulationMode) {
        ctx.strokeStyle = "rgb(var(--accent))"
        ctx.lineWidth = 3
        ctx.setLineDash([10, 10])
        const width = canvas.width / window.devicePixelRatio
        const height = canvas.height / window.devicePixelRatio
        ctx.strokeRect(5, 5, width - 10, height - 10)
        ctx.setLineDash([])

        // Simulation mode indicator
        ctx.fillStyle = "rgba(var(--accent), 0.1)"
        ctx.fillRect(0, 0, width, height)
      }
    }

    const render = () => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      ctx.clearRect(0, 0, width, height)

      // Background
      ctx.fillStyle = "rgb(var(--background))"
      ctx.fillRect(0, 0, width, height)

      drawGrid()
      drawSimulationOverlay()

      trains.forEach((train) => {
        drawTrain(train, selectedTrain?.id === train.id)
      })
    }

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const clickedTrain = trains.find((train) => {
        const dx = x - train.position.x
        const dy = y - train.position.y
        return Math.sqrt(dx * dx + dy * dy) < 25
      })

      onTrainSelect(clickedTrain || null)
    }

    const handleMouseDown = (event: MouseEvent) => {
      if (!simulationMode) return

      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const clickedTrain = trains.find((train) => {
        const dx = x - train.position.x
        const dy = y - train.position.y
        return Math.sqrt(dx * dx + dy * dy) < 25
      })

      if (clickedTrain) {
        setIsDragging(true)
        setDragStart({ x, y })
        onTrainSelect(clickedTrain)
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !selectedTrain || !simulationMode) return

      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      setTrains((prev) =>
        prev.map((train) =>
          train.id === selectedTrain.id ? { ...train, position: { ...train.position, x, y } } : train,
        ),
      )
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    canvas.addEventListener("click", handleClick)
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)

    const animationFrame = requestAnimationFrame(function animate() {
      render()
      requestAnimationFrame(animate)
    })

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("click", handleClick)
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseup", handleMouseUp)
      cancelAnimationFrame(animationFrame)
    }
  }, [trains, selectedTrain, simulationMode, isDragging, onTrainSelect])

  return (
    <Card className="relative h-96 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        style={{ background: "rgb(var(--background))" }}
      />
      {simulationMode && (
        <div className="absolute top-4 left-4 bg-accent/90 text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
          Simulation Mode Active
        </div>
      )}
    </Card>
  )
}
