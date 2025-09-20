"use client"

import { useState } from "react"
import { LeafletMap } from "./index"
import { useBusTracking } from "@/hooks/use-socket"
import type { BusSearchResult } from "@/lib/bus-api"
import { Clock, Users, Wifi, WifiOff, Zap, AlertCircle, CheckCircle, ArrowRight, Circle } from "lucide-react"

interface BusTrackingViewProps {
  selectedBus: BusSearchResult
  onViewChange: (view: "map" | "list") => void
  currentView: "map" | "list"
}

export function BusTrackingView({ selectedBus, onViewChange, currentView }: BusTrackingViewProps) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)

  console.log("[v0] BusTrackingView rendered with currentView:", currentView)

  const { busLocation, driverStatus, lastUpdate, isConnected } = useBusTracking(selectedBus.busId)

  const busLocationData = busLocation
    ? {
        latitude: busLocation.location.latitude,
        longitude: busLocation.location.longitude,
        speed: busLocation.speed,
        heading: busLocation.heading,
        lastUpdated: busLocation.timestamp,
      }
    : null

  const handleLocationUpdate = (location: { latitude: number; longitude: number }) => {
    setUserLocation(location)
  }

  const getConnectionStatus = () => {
    return isConnected && driverStatus === "online" ? "Connected" : "Disconnected"
  }

  const getConnectionColor = () => {
    return isConnected && driverStatus === "online" ? "text-green-600" : "text-red-600"
  }

  const mockStops = [
    { id: 1, name: "Thob", status: "departed", time: "14:06", type: "start" },
    { id: 2, name: "Bambhuon Ki Dhani", status: "departed", time: "14:08", type: "intermediate" },
    { id: 3, name: "Dhaundaara", status: "arriving", time: "Arriving Now", speed: "0 km/h", type: "current" },
    { id: 4, name: "Basni", status: "upcoming", time: "6 min", type: "upcoming" },
  ]

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <div className="glass-card rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <div className="relative">
              <div
                className={`relative p-1.5 sm:p-2 lg:p-3 rounded-full shadow-lg ${
                  isConnected && driverStatus === "online"
                    ? "bg-gradient-to-br from-green-500 to-emerald-600"
                    : "bg-gradient-to-br from-red-500 to-rose-600"
                }`}
              >
                {isConnected && driverStatus === "online" ? (
                  <Wifi className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                ) : (
                  <WifiOff className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                )}
              </div>
            </div>
            <div>
              <div className={`text-xs sm:text-sm lg:text-base font-bold ${getConnectionColor()}`}>{getConnectionStatus()}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 sm:gap-3 lg:gap-6">
            {busLocationData && (
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <div className="p-1 sm:p-1.5 lg:p-2 bg-amber-500/20 rounded-lg">
                  <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-4 lg:w-4 text-amber-400" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs sm:text-sm">{busLocationData.speed.toFixed(0)}</div>
                  <div className="text-blue-200 text-xs">km/h</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <div className="p-1 sm:p-1.5 lg:p-2 bg-green-500/20 rounded-lg">
                <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-4 lg:w-4 text-green-400" />
              </div>
              <div>
                <div className="font-bold text-white text-xs sm:text-sm">
                  {selectedBus.connectedPassengers}/{selectedBus.capacity}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <div className="p-1 sm:p-2 bg-blue-500/20 rounded-lg">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
              </div>
              <div>
                <div className="font-bold text-white">{isConnected ? "Live" : "Offline"}</div>
              </div>
            </div>
          </div>
        </div>

        {lastUpdate && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-blue-200">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Last update: {new Date(lastUpdate).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {currentView === "map" && (
        <>
          {/* Map Container - Now at the top */}
          <div className="glass-card rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden">
            <div className="relative">
              <LeafletMap
                selectedBus={selectedBus}
                busLocation={busLocationData || undefined}
                onLocationUpdate={handleLocationUpdate}
              />
              {!isConnected && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
                  <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center max-w-sm mx-auto">
                    <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 text-amber-400 mx-auto mb-2 sm:mb-4" />
                    <h3 className="text-sm sm:text-lg font-bold text-white mb-1 sm:mb-2">Connection Lost</h3>
                    <p className="text-xs sm:text-sm text-blue-200">Trying to reconnect to live updates...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Professional Live Telemetry Panel - Now below the map */}
          {busLocationData && isConnected && (
            <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in border border-white/20 backdrop-blur-md">
              {/* Header Section */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-xl blur-lg opacity-50 animate-glow"></div>
                    <div className="relative p-2 sm:p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-lg">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">Live Telemetry</h3>
                    <p className="text-xs sm:text-sm text-emerald-300">Real-time vehicle data</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 glass-effect px-3 py-1.5 rounded-full border border-emerald-400/30">
                  <div className="relative">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="text-xs font-medium text-emerald-300">Broadcasting Live</span>
                </div>
              </div>
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {/* Speed Card */}
                <div className="group glass-effect rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/20 group-hover:from-purple-500/30 group-hover:to-violet-500/30 transition-all duration-300">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                        {busLocationData.speed.toFixed(1)}
                      </p>
                      <p className="text-xs text-white/60">Current Speed (km/h)</p>
                    </div>
                  </div>
                </div>
                
                {/* Heading Card */}
                <div className="group glass-effect rounded-xl p-4 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                      <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {busLocationData.heading.toFixed(0)}°
                      </p>
                      <p className="text-xs text-white/60">Compass Heading</p>
                    </div>
                  </div>
                </div>
                
                {/* Passengers Card */}
                <div className="group glass-effect rounded-xl p-4 border border-white/10 hover:border-green-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg sm:text-xl font-bold text-white group-hover:text-green-300 transition-colors">
                        {selectedBus.connectedPassengers}/{selectedBus.capacity}
                      </p>
                      <p className="text-xs text-white/60">Connected Passengers</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* GPS Coordinates Section */}
              <div className="glass-effect rounded-xl p-4 border border-white/10 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-300 font-medium mb-1">GPS Coordinates</p>
                      <p className="text-xs sm:text-sm font-mono text-white/90 break-all">
                        {busLocationData.latitude.toFixed(6)}, {busLocationData.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-blue-300 font-medium">Last Updated</p>
                    <p className="text-xs sm:text-sm font-mono text-white/90">
                      {new Date(busLocationData.lastUpdated).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {currentView === "list" && (
        <div className="space-y-4 animate-scale-in">
          {/* Bus Timeline Header */}
          <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl blur-lg opacity-50 animate-glow"></div>
                  <div className="relative p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Bus Timeline</h3>
                  <p className="text-xs sm:text-sm text-blue-200">
                    {selectedBus.journeyDetails?.fromStop.name} to {selectedBus.journeyDetails?.toStop.name}
                  </p>
                </div>
              </div>
              <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium">Live</div>
            </div>
          </div>

          {/* Stops List */}
          <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6">
            <div className="space-y-4">
              {mockStops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="flex items-center justify-between p-3 sm:p-4 hover:bg-white/5 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Status Icon */}
                    <div className="flex flex-col items-center">
                      {stop.status === "departed" && <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />}
                      {stop.status === "arriving" && <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />}
                      {stop.status === "upcoming" && <Circle className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />}
                      {/* Connecting line */}
                      {index < mockStops.length - 1 && (
                        <div className="w-0.5 h-8 bg-gradient-to-b from-white/20 to-transparent mt-2"></div>
                      )}
                    </div>

                    {/* Stop Details */}
                    <div>
                      <div className="font-medium text-white text-sm sm:text-base">{stop.name}</div>
                      <div
                        className={`text-xs sm:text-sm ${
                          stop.status === "departed"
                            ? "text-green-400"
                            : stop.status === "arriving"
                              ? "text-blue-400"
                              : "text-gray-400"
                        }`}
                      >
                        {stop.status === "departed" && "Departed"}
                        {stop.status === "arriving" && `Arriving Now • ${stop.speed}`}
                        {stop.status === "upcoming" && stop.time}
                        {stop.type === "start" && " • Start"}
                      </div>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="text-xs sm:text-sm text-blue-200 font-medium">
                    {stop.status === "arriving" ? "Arriving" : stop.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isConnected && (
        <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center animate-fade-in">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-amber-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <WifiOff className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Connecting to Live Updates</h3>
          <p className="text-sm sm:text-base text-blue-200 mb-4">
            Establishing connection with the bus tracking system...
          </p>
          <div className="flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
          <div className="mt-4 text-xs sm:text-sm text-blue-300">Make sure you have a stable internet connection</div>
        </div>
      )}
    </div>
  )
}
