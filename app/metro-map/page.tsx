"use client"

import { useState } from "react"
import { InteractiveMap, kochiMetroStations, type Station } from "@/components/metro-map/interactive-map"
import { StationDetailTabs } from "@/components/metro-map/station-detail-tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Map, TrendingUp } from "lucide-react"

export default function MetroMapPage() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)

  const handleStationClick = (station: Station) => {
    setSelectedStation(station)
  }

  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Map className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kochi Metro Map</h1>
          <p className="text-muted-foreground">Interactive station monitoring and crowd analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Interactive Map */}
        <div className="xl:col-span-2">
          <InteractiveMap onStationClick={handleStationClick} />
        </div>

        {/* Station Details Panel */}
        <div className="space-y-6">
          {selectedStation ? (
            <StationDetailTabs station={selectedStation} />
          ) : (
            <>
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Map className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Station</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Click on any station on the map to view detailed information, crowd analytics, and train schedules.
                  </p>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5" />
                    <h3 className="font-semibold">System Overview</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Stations</span>
                      <span className="font-semibold">{kochiMetroStations.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Trains</span>
                      <span className="font-semibold">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">On-Time Performance</span>
                      <span className="font-semibold">87%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Daily Passengers</span>
                      <span className="font-semibold">45,678</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
