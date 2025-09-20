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
    <div className="space-y-4 sm:space-y-6">
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 animate-slide-down">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-full blur-lg opacity-50 animate-glow ${
                  isConnected && driverStatus === "online" ? "bg-green-400" : "bg-red-400"
                }`}
              ></div>
              <div
                className={`relative p-2 sm:p-3 rounded-full shadow-lg ${
                  isConnected && driverStatus === "online"
                    ? "bg-gradient-to-br from-green-500 to-emerald-600"
                    : "bg-gradient-to-br from-red-500 to-rose-600"
                }`}
              >
                {isConnected && driverStatus === "online" ? (
                  <Wifi className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                ) : (
                  <WifiOff className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                )}
              </div>
            </div>
            <div>
              <div className={`text-sm sm:text-base font-bold ${getConnectionColor()}`}>{getConnectionStatus()}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:flex sm:items-center gap-3 sm:gap-6">
            {busLocationData && (
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <div className="p-1 sm:p-2 bg-amber-500/20 rounded-lg">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" />
                </div>
                <div>
                  <div className="font-bold text-white">{busLocationData.speed.toFixed(0)}</div>
                  <div className="text-blue-200">km/h</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <div className="p-1 sm:p-2 bg-green-500/20 rounded-lg">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
              </div>
              <div>
                <div className="font-bold text-white">
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
        <div className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden animate-scale-in">
          <div className="h-[400px] sm:h-[500px] lg:h-[600px] relative">
            <LeafletMap
              selectedBus={selectedBus}
              busLocation={busLocationData || undefined}
              onLocationUpdate={handleLocationUpdate}
            />
            {!isConnected && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <div className="glass-card rounded-2xl p-6 text-center max-w-sm mx-4">
                  <AlertCircle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Connection Lost</h3>
                  <p className="text-sm text-blue-200">Trying to reconnect to live updates...</p>
                </div>
              </div>
            )}
          </div>
        </div>
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
