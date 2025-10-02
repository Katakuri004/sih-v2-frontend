"use client";

import React, { useState } from "react";
import { InteractiveMap } from "@/components/metro-map/interactive-map-new";
import { StationDetailTabs } from "@/components/metro-map/station-detail-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, TrendingUp, Train } from "lucide-react";
import { kochiMetroStations, type Station } from "@/types/metro";

export default function MetroMapPage() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div className="flex items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Map className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Kochi Metro Map
            </h1>
            <p className="text-muted-foreground">
              Interactive station monitoring and crowd analytics
            </p>
          </div>
        </div>
      </div>

      {/* 
      OLD LAYOUT (BACKUP):
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-1 xl:col-span-2 space-y-4">
          <Card className="p-0 overflow-hidden border-2">
            <div className="relative">
              <InteractiveMap onStationClick={handleStationClick} stations={kochiMetroStations} />
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          {selectedStation ? <StationDetailTabs station={selectedStation} /> : (...)}
        </div>
      </div>
      */}

      {/* NEW HORIZONTAL LAYOUT */}
      <div className="space-y-6 mt-8">
        {/* Interactive Map - Full Width */}
        <Card className="p-0 overflow-hidden border-2">
          <div className="relative">
            <InteractiveMap
              onStationClick={handleStationClick}
              stations={kochiMetroStations}
            />
          </div>
        </Card>

        {/* Station Details or Default Content */}
        {selectedStation ? (
          <div className="space-y-6">
            {/* Station Name Header */}
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Train className="h-7 w-7" />
                  {selectedStation.name} Station
                </CardTitle>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Badge
                    variant="outline"
                    className={`px-3 py-1 ${
                      selectedStation.line === "Blue"
                        ? "bg-blue-100 text-blue-800 border-blue-300"
                        : selectedStation.line === "AquaLine"
                        ? "bg-cyan-100 text-cyan-800 border-cyan-300"
                        : selectedStation.line === "Purple"
                        ? "bg-purple-100 text-purple-800 border-purple-300"
                        : "bg-gray-100 text-gray-800 border-gray-300"
                    }`}
                  >
                    {selectedStation.line === "Blue"
                      ? "Blue Line"
                      : selectedStation.line === "AquaLine"
                      ? "Aqua Line"
                      : selectedStation.line === "Purple"
                      ? "Purple Line"
                      : selectedStation.line}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`px-3 py-1 ${
                      selectedStation.crowdLevel === "low"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : selectedStation.crowdLevel === "medium"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                        : selectedStation.crowdLevel === "high"
                        ? "bg-red-100 text-red-800 border-red-300"
                        : "bg-gray-100 text-gray-800 border-gray-300"
                    }`}
                  >
                    {selectedStation.crowdLevel.charAt(0).toUpperCase() +
                      selectedStation.crowdLevel.slice(1)}{" "}
                    crowd
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Horizontal Info Boxes */}
            <StationDetailTabs station={selectedStation} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Map className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Station</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Click on any station on the map to view detailed information,
                  crowd analytics, and train schedules.
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
                    <span className="text-sm text-muted-foreground">
                      Total Stations
                    </span>
                    <span className="font-semibold">
                      {kochiMetroStations.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Active Trains
                    </span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      On-Time Performance
                    </span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Daily Passengers
                    </span>
                    <span className="font-semibold">45,678</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
