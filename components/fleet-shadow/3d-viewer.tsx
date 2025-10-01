"use client";
import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { mockTrains } from "./data";
import { Train3D } from "./types";
import { ShuntingPath } from "./shunting-path";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

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
  const canvasRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    // Mock train data
    const mockTrains: Train3D[] = [
      {
        id: "1",
        trainNumber: "T-001",
        position: { x: 100, y: 100, z: 0 },
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
        position: { x: 200, y: 150, z: 0 },
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
        position: { x: 300, y: 200, z: 0 },
        status: "cleaning",
        healthScore: 88,
        lastMaintenance: "2024-01-12",
        nextMaintenance: "2024-02-12",
        totalKm: 38000,
        bay: 3,
      },
    ];

    setTrains(mockTrains);

    // Mock shunting paths
    const mockPaths: ShuntingPathData[] = [
      {
        from: new THREE.Vector3(100, 0, 100),
        to: new THREE.Vector3(200, 0, 150),
      },
      {
        from: new THREE.Vector3(200, 0, 150),
        to: new THREE.Vector3(300, 0, 200),
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
      controlsRef.current.reset();
    }
  };

  return (
    <div
      ref={canvasRef}
      className={`relative bg-muted/10 rounded-lg overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50" : "w-full h-[40vh]"
      }`}
    >
      {/* Control Panel */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
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
          position: viewMode === "top" ? [0, 100, 0] : [50, 50, 50],
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
