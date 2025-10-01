"use client"

import * as React from "react"

export function MapBackground() {
  return (
    <g className="map-background">
      {/* Simple outline of Kochi */}
      <path
        d="M50 200 
           L150 100 
           L300 50 
           L450 75 
           L600 150
           L700 300
           L750 500
           L700 700
           L600 850
           L450 900
           L300 850
           L200 750
           L150 600
           L100 400
           Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.1"
        className="text-foreground"
      />
      
      {/* Main water bodies */}
      <path
        d="M50 300
           L200 350
           L300 400
           L350 500
           L300 600
           L200 650
           L100 600
           Z"
        fill="currentColor"
        opacity="0.05"
        className="text-blue-500"
      />
      
      {/* Major roads */}
      <path
        d="M200 100 L600 200"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.1"
        strokeDasharray="4 4"
        className="text-foreground"
      />
      <path
        d="M150 300 L650 400"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.1"
        strokeDasharray="4 4"
        className="text-foreground"
      />
      <path
        d="M100 500 L700 600"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.1"
        strokeDasharray="4 4"
        className="text-foreground"
      />
    </g>
  )
}