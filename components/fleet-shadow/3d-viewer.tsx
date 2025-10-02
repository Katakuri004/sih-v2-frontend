"use client";
import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { mockTrains } from "./data";
import { Train3D } from "./types";
import { ShuntingPath } from "./shunting-path";
import { Button } from "@/components/ui/button";
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Hand,
} from "lucide-react";

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

function Train({
  train,
  isSelected,
  onClick,
}: {
  train: Train3D;
  isSelected: boolean;
  onClick: () => void;
}) {
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

export function Viewer3D({
  onTrainSelect,
  selectedTrain,
  viewMode,
  scenario,
}: Viewer3DProps) {
  const [trains, setTrains] = useState<Train3D[]>([]);
  const [shuntingPaths, setShuntingPaths] = useState<ShuntingPathData[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    // Mock train data - tightly centered and visible
    const mockTrains: Train3D[] = [
      {
        id: "1",
        trainNumber: "T-001",
        position: { x: -15, y: 0, z: 0 },
        status: "ready",
        healthScore: 95,
        lastMaintenance: "2024-01-15",
        nextMaintenance: "2024-02-15",
        totalKm: 45000,
        bay: 1,
      },
      {
        id: "2",
        trainNumber: "T-002",
        position: { x: 0, y: 0, z: 0 },
        status: "maintenance",
        healthScore: 78,
        lastMaintenance: "2024-01-10",
        nextMaintenance: "2024-01-25",
        totalKm: 52000,
        bay: 2,
      },
      {
        id: "3",
        trainNumber: "T-003",
        position: { x: 15, y: 0, z: 0 },
        status: "cleaning",
        healthScore: 88,
        lastMaintenance: "2024-01-12",
        nextMaintenance: "2024-02-12",
        totalKm: 38000,
        bay: 3,
      },
    ];

    setTrains(mockTrains);

    // Mock shunting paths - tightly centered
    const mockPaths: ShuntingPathData[] = [
      {
        from: new THREE.Vector3(-15, 0, 0),
        to: new THREE.Vector3(0, 0, 0),
      },
      {
        from: new THREE.Vector3(0, 0, 0),
        to: new THREE.Vector3(15, 0, 0),
      },
    ];

    setShuntingPaths(mockPaths);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(0.5);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(0.5);
      controlsRef.current.update();
    }
  };

  const handleReset = () => {
    if (controlsRef.current) {
      // Reset to centered view of trains
      const controls = controlsRef.current;
      controls.target.set(0, 0, 0);
      controls.object.position.set(
        viewMode === "top" ? 0 : 30,
        viewMode === "top" ? 60 : 30,
        viewMode === "top" ? 0 : 30
      );
      controls.update();
    }
  };

  const toggleDragMode = () => {
    setIsDragMode(!isDragMode);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDragMode) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && isDragMode && controlsRef.current) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const controls = controlsRef.current;
      const camera = controls.object;

      // Get camera's right and up vectors for proper movement
      const right = new THREE.Vector3();
      const up = new THREE.Vector3();

      camera.getWorldDirection(new THREE.Vector3()); // This updates the camera's matrix
      right.setFromMatrixColumn(camera.matrix, 0); // Right vector
      up.setFromMatrixColumn(camera.matrix, 1); // Up vector

      // Movement sensitivity
      const moveSensitivity = 0.1;
      const rotationSensitivity = 0.005;

      // Left/Right movement = move camera and target along camera's right vector
      const rightMovement = right
        .clone()
        .multiplyScalar(-deltaX * moveSensitivity);

      // Up/Down movement for Y axis = move camera and target along camera's up vector
      const upMovement = up.clone().multiplyScalar(deltaY * moveSensitivity);

      // Apply movement to both camera position and target
      camera.position.add(rightMovement).add(upMovement);
      controls.target.add(rightMovement).add(upMovement);

      // Optional: Add rotation based on vertical movement
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        camera.rotateZ(deltaY * rotationSensitivity);
      }

      controls.update();
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={canvasRef}
      className={`relative bg-muted/10 rounded-lg overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50" : "w-full h-[40vh]"
      } ${
        isDragMode
          ? isDragging
            ? "cursor-grabbing"
            : "cursor-grab"
          : "cursor-default"
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Control Panel */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          size="sm"
          variant={isDragMode ? "default" : "secondary"}
          onClick={toggleDragMode}
          className="h-8 w-8 p-0"
          title="Hand Drag Mode"
        >
          <Hand className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomIn}
          className="h-8 w-8 p-0"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomOut}
          className="h-8 w-8 p-0"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleReset}
          className="h-8 w-8 p-0"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={toggleFullscreen}
          className="h-8 w-8 p-0"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Canvas
        camera={{
          position: viewMode === "top" ? [0, 60, 0] : [30, 30, 30],
          fov: 75,
        }}
        shadows
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Ground plane */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[500, 500]} />
          <meshStandardMaterial color="#f3f4f6" />
        </mesh>

        {/* Trains */}
        {trains.map((train) => (
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
          ref={controlsRef}
          target={[0, 0, 0]}
          enabled={!isDragging}
          enableDamping
          dampingFactor={0.05}
          minDistance={20}
          maxDistance={100}
          maxPolarAngle={viewMode === "top" ? Math.PI / 2.5 : Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
