"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useRef, useState } from 'react'
import * as THREE from 'three'

const DepotModel = () => {
  // Depot dimensions
  const depotWidth = 100
  const depotLength = 200
  const bayWidth = 15
  const bayLength = 30

  return (
    <>
      {/* Depot floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[depotWidth, depotLength]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>

      {/* Stabling bays */}
      {Array.from({ length: 25 }).map((_, index) => {
        const row = Math.floor(index / 5)
        const col = index % 5
        const x = (col - 2) * (bayWidth + 2)
        const z = (row - 2) * (bayLength + 2)

        return (
          <mesh key={index} position={[x, 0, z]}>
            <boxGeometry args={[bayWidth, 0.1, bayLength]} />
            <meshStandardMaterial color="#3a3a3a" />
          </mesh>
        )
      })}

      {/* Ambient light for general illumination */}
      <ambientLight intensity={0.5} />
      
      {/* Directional light for shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  )
}

export default function DepotViewer() {
  const [viewMode, setViewMode] = useState<'top' | 'isometric'>('isometric')

  return (
    <div className="relative w-full h-[calc(100vh-10rem)] bg-card rounded-lg overflow-hidden">
      <Canvas shadows>
        <PerspectiveCamera
          makeDefault
          position={viewMode === 'top' ? [0, 50, 0] : [50, 50, 50]}
          fov={50}
        />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={10}
          maxDistance={100}
          maxPolarAngle={viewMode === 'top' ? Math.PI / 2 : Math.PI / 2}
        />
        <DepotModel />
      </Canvas>
      
      {/* View controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setViewMode('top')}
          className={`px-4 py-2 rounded-md ${
            viewMode === 'top'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          Top View
        </button>
        <button
          onClick={() => setViewMode('isometric')}
          className={`px-4 py-2 rounded-md ${
            viewMode === 'isometric'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          Isometric
        </button>
      </div>
    </div>
  )
}