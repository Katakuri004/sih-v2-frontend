"use client";
import React, { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";

interface ShuntingPathProps {
  from: THREE.Vector3;
  to: THREE.Vector3;
}

export function ShuntingPath({ from, to }: ShuntingPathProps) {
  const points = useMemo(() => {
    // Create a curve for smooth path
    const curve = new THREE.CatmullRomCurve3([
      from,
      new THREE.Vector3((from.x + to.x) / 2, from.y, (from.z + to.z) / 2),
      to
    ], false);
    
    // Get points along the curve
    return curve.getPoints(50);
  }, [from, to]);

  return (
    <>
      {/* Animated path line */}
      <Line
        points={points}
        color="#60a5fa" // Blue color for path
        lineWidth={3}
        dashed={true}
        dashScale={3} // Length of the dashes
        dashSize={0.5} // Size of the dashes
        gapSize={0.2} // Size of the gaps
      />
      
      {/* Direction arrow at destination */}
      <mesh position={to.clone().add(new THREE.Vector3(0, 1, 0))}>
        <coneGeometry args={[0.5, 2, 8]} />
        <meshStandardMaterial color="#60a5fa" />
      </mesh>
    </>
  );
}