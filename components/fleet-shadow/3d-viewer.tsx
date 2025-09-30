"use client";
import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { mockTrains } from "./data";
import { Train3D } from "./types";
import { ShuntingPath } from "./shunting-path";

interface ShuntingPathData {
  from: THREE.Vector3;
  to: THREE.Vector3;
}

interface Viewer3DProps {
  onTrainSelect: (train: Train3D) => void;
  selectedTrain: Train3D | null;
  viewMode: "normal" | "top";
  scenario?: "maintenance" | "cleaning" | null;
}

function getTrainColor(train: Train3D): string {
  switch (train.status) {
    case "maintenance":
      return "#ef4444"; // Red
    case "cleaning":
      return "#f59e0b"; // Yellow
    case "ready":
      return "#10b981"; // Green
    case "inactive":
    default:
      return "#6b7280"; // Gray
  }
}

function Train({ train, isSelected, onClick }: { train: Train3D; isSelected: boolean; onClick: () => void }) {
  const scale = isSelected ? 1.1 : 1;

  return (
    <group
      position={[train.position.x, 0, train.position.z]}
      onClick={onClick}
      scale={[scale, scale, scale]}
    >
      <mesh castShadow position={[0, 2, 0]}>
        <boxGeometry args={[12, 4, 24]} />
        <meshStandardMaterial color={getTrainColor(train)} />
      </mesh>
    </group>
  );
}

export function Viewer3D({ onTrainSelect, selectedTrain, viewMode, scenario }: Viewer3DProps) {
  const [shuntingPaths, setShuntingPaths] = useState<ShuntingPathData[]>([]);

  // Update shunting paths based on scenario
  useEffect(() => {
    if (scenario === "maintenance") {
      setShuntingPaths([
        {
          from: new THREE.Vector3(mockTrains[1].position.x, 0, mockTrains[1].position.z),
          to: new THREE.Vector3(mockTrains[1].position.x, 0, mockTrains[1].position.z + 60)
        }
      ]);
    } else if (scenario === "cleaning") {
      setShuntingPaths([
        {
          from: new THREE.Vector3(mockTrains[2].position.x, 0, mockTrains[2].position.z),
          to: new THREE.Vector3(mockTrains[2].position.x + 40, 0, mockTrains[2].position.z)
        }
      ]);
    } else {
      setShuntingPaths([]);
    }
  }, [scenario]);

  return (
    <div className="w-full h-full min-h-[600px]">
      <Canvas shadows camera={{ position: viewMode === "top" ? [0, 100, 0] : [50, 50, 50], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} castShadow />
        
        {/* Depot floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[40, -1.5, 60]} receiveShadow>
          <planeGeometry args={[120, 180]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>

        {/* Bay markers */}
        {mockTrains.map((train, index) => (
          <mesh
            key={`bay-${index}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[train.position.x, -1.4, train.position.z]}
          >
            <planeGeometry args={[15, 28]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        ))}

        {/* Trains */}
        {mockTrains.map((train) => (
          <Train
            key={train.id}
            train={train}
            isSelected={selectedTrain?.id === train.id}
            onClick={() => onTrainSelect(train)}
          />
        ))}

        {/* Shunting Paths */}
        {shuntingPaths.map((path, index) => (
          <ShuntingPath key={index} from={path.from} to={path.to} />
        ))}

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={30}
          maxDistance={200}
          maxPolarAngle={viewMode === "top" ? Math.PI / 2.5 : Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface Train3D {
  id: string
  trainNumber: string
  position: { x: number; y: number; z: number }
  status: "ready" | "maintenance" | "cleaning" | "standby"
  healthScore: number
  lastMaintenance: string
  nextMaintenance: string
  totalKm: number
  bay: number
}

interface Viewer3DProps {
  onTrainSelect: (train: Train3D | null) => void
  selectedTrain: Train3D | null
  viewMode: "top" | "isometric"
  scenario: string
}

const mockTrains: Train3D[] = Array.from({ length: 25 }, (_, index) => ({
  id: (index + 1).toString(),
  trainNumber: `T-${(index + 1).toString().padStart(3, '0')}`,
  position: {
    x: (index % 5) * 20,
    y: 0,
    z: Math.floor(index / 5) * 30
  },
  status: index % 4 === 0 ? "ready" :
         index % 4 === 1 ? "maintenance" :
         index % 4 === 2 ? "cleaning" : "standby",
  healthScore: 70 + Math.floor(Math.random() * 30),
  lastMaintenance: "2023-09-15",
  nextMaintenance: "2023-10-15",
  totalKm: 150000 + Math.floor(Math.random() * 20000),
  bay: index + 1
}));

function Train({ train, isSelected, onClick }: { train: Train3D; isSelected: boolean; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const getTrainColor = (status: Train3D["status"]) => {
    switch (status) {
      case "ready":
        return "#34a85a"; // Primary color
      case "maintenance":
        return "#ef4444"; // Destructive color
      case "cleaning":
        return "#4682b4"; // Secondary color
      case "standby":
        return "#eab308"; // Yellow color
      default:
        return "#71717a"; // Muted color
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={[train.position.x, train.position.y, train.position.z]}
      onClick={onClick}
      scale={isSelected ? 1.1 : 1}
    >
      <boxGeometry args={[10, 3, 25]} /> {/* Train dimensions */}
      <meshStandardMaterial color={getTrainColor(train.status)} />
    </mesh>
  );
}

function ShuntingPath({ from, to }: { from: THREE.Vector3; to: THREE.Vector3 }) {
  const points = [from, to];
  const curve = new THREE.LineCurve3(from, to);
  
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([from.x, from.y, from.z, to.x, to.y, to.z])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#34a85a" linewidth={2} />
    </line>
  );
}

export function Viewer3D({ onTrainSelect, selectedTrain, viewMode, scenario }: Viewer3DProps) {
  const [shuntingPaths, setShuntingPaths] = useState<ShuntingPathData[]>([]);

  // Update shunting paths based on scenario
  useEffect(() => {
    if (scenario === "maintenance") {
      setShuntingPaths([
        {
          from: new THREE.Vector3(mockTrains[1].position.x, 0, mockTrains[1].position.z),
          to: new THREE.Vector3(mockTrains[1].position.x, 0, mockTrains[1].position.z + 60)
        }
      ]);
    } else if (scenario === "cleaning") {
      setShuntingPaths([
        {
          from: new THREE.Vector3(mockTrains[2].position.x, 0, mockTrains[2].position.z),
          to: new THREE.Vector3(mockTrains[2].position.x + 40, 0, mockTrains[2].position.z)
        }
      ]);
    } else {
      setShuntingPaths([]);
    }
  }, [scenario]);
  const [shuntingPaths, setShuntingPaths] = useState<ShuntingPathData[]>([]);

  // Update shunting paths based on scenario
  useEffect(() => {
    if (scenario === "maintenance") {
      setShuntingPaths([
        {
          from: new THREE.Vector3(mockTrains[1].position.x, 0, mockTrains[1].position.z),
          to: new THREE.Vector3(mockTrains[1].position.x, 0, mockTrains[1].position.z + 60)
        }
      ]);
    } else if (scenario === "cleaning") {
      setShuntingPaths([
        {
          from: new THREE.Vector3(mockTrains[2].position.x, 0, mockTrains[2].position.z),
          to: new THREE.Vector3(mockTrains[2].position.x + 40, 0, mockTrains[2].position.z)
        }
      ]);
    } else {
      setShuntingPaths([]);
    }
  }, [scenario]);
  const [shuntingPaths, setShuntingPaths] = useState<{ from: THREE.Vector3; to: THREE.Vector3 }[]>([]);
  // Effect to update shunting paths based on scenario
  useEffect(() => {
    if (scenario === 'maintenance') {
      setShuntingPaths([
        {
          from: new THREE.Vector3(mockTrains[6].position.x, 0, mockTrains[6].position.z),
          to: new THREE.Vector3(mockTrains[6].position.x, 0, mockTrains[6].position.z + 60)
        }
      ]);
    } else if (scenario === 'cleaning') {
      setShuntingPaths([
        {
          from: new THREE.Vector3(mockTrains[2].position.x, 0, mockTrains[2].position.z),
          to: new THREE.Vector3(mockTrains[2].position.x + 40, 0, mockTrains[2].position.z)
        }
      ]);
    } else {
      setShuntingPaths([]);
    }
  }, [scenario]);

  return (
    <div className="w-full h-full min-h-[600px]">
      <Canvas shadows camera={{ position: viewMode === "top" ? [0, 100, 0] : [50, 50, 50], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} castShadow />
        
        {/* Depot floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[40, -1.5, 60]} receiveShadow>
          <planeGeometry args={[120, 180]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>

        {/* Bay markers */}
        {mockTrains.map((train, index) => (
          <mesh
            key={`bay-${index}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[train.position.x, -1.4, train.position.z]}
          >
            <planeGeometry args={[15, 28]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        ))}

        {/* Trains */}
        {mockTrains.map((train) => (
          <Train
            key={train.id}
            train={train}
            isSelected={selectedTrain?.id === train.id}
            onClick={() => onTrainSelect(train)}
          />
        ))}

        {/* Shunting Paths */}
        {shuntingPaths.map((path, index) => (
          <ShuntingPath key={index} from={path.from} to={path.to} />
        ))}

        {/* Shunting Paths */}
        {shuntingPaths.map((path, index) => (
          <ShuntingPath key={index} from={path.from} to={path.to} />
        ))}

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={30}
          maxDistance={200}
          maxPolarAngle={viewMode === "top" ? Math.PI / 2.5 : Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
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
