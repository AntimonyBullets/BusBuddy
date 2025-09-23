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
      <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <div className="relative">
              <div
                className={`relative p-1.5 sm:p-2 lg:p-3 rounded-full shadow-lg ${
                  isConnected && driverStatus === "online"
                    ? "busbuddy-primary-bg"
                    : "bg-red-500"
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
                  <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-4 lg:w-4 text-amber-500" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-xs sm:text-sm">{busLocationData.speed.toFixed(0)}</div>
                  <div className="text-gray-600 text-xs">km/h</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <div className="p-1 sm:p-1.5 lg:p-2 bg-green-50 rounded-lg">
                <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-4 lg:w-4 text-green-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-xs sm:text-sm">
                  {selectedBus.connectedPassengers}/{selectedBus.capacity}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <div className="p-1 sm:p-2 bg-blue-50 rounded-lg">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900">{isConnected ? "Live" : "Offline"}</div>
              </div>
            </div>
          </div>
        </div>

        {lastUpdate && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-gray-600">
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
          <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg border border-gray-200">
            <div className="relative">
              <LeafletMap
                selectedBus={selectedBus}
                busLocation={busLocationData || undefined}
                onLocationUpdate={handleLocationUpdate}
              />
              {!isConnected && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center max-w-sm mx-auto shadow-lg">
                    <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 text-amber-500 mx-auto mb-2 sm:mb-4" />
                    <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Connection Lost</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Trying to reconnect to live updates...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Professional Live Telemetry Panel - Now below the map */}
          {busLocationData && isConnected && (
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
              {/* Header Section */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 busbuddy-primary-bg rounded-xl blur-lg opacity-50"></div>
                    <div className="relative p-2 sm:p-3 rounded-xl busbuddy-primary-bg shadow-lg">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">Live Telemetry</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Real-time vehicle data</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                  <div className="relative">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="text-xs font-medium text-green-700">Broadcasting Live</span>
                </div>
              </div>
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {/* Speed Card */}
                <div className="group bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-all duration-300">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {busLocationData.speed.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-600">Current Speed (km/h)</p>
                    </div>
                  </div>
                </div>
                
                {/* Heading Card */}
                <div className="group bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-cyan-50 group-hover:bg-cyan-100 transition-all duration-300">
                      <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-cyan-500"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">
                        {busLocationData.heading.toFixed(0)}°
                      </p>
                      <p className="text-xs text-gray-600">Compass Heading</p>
                    </div>
                  </div>
                </div>
                
                {/* Passengers Card */}
                <div className="group bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-green-50 group-hover:bg-green-100 transition-all duration-300">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                        {selectedBus.connectedPassengers}/{selectedBus.capacity}
                      </p>
                      <p className="text-xs text-gray-600">Connected Passengers</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* GPS Coordinates Section */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-medium mb-1">GPS Coordinates</p>
                      <p className="text-xs sm:text-sm font-mono text-gray-900 break-all">
                        {busLocationData.latitude.toFixed(6)}, {busLocationData.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-blue-600 font-medium">Last Updated</p>
                    <p className="text-xs sm:text-sm font-mono text-gray-900">
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
        <div className="space-y-4">
          {/* Bus Timeline Header */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 busbuddy-primary-bg rounded-xl blur-lg opacity-50"></div>
                  <div className="relative p-2 sm:p-3 busbuddy-primary-bg rounded-xl shadow-lg">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Bus Timeline</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {selectedBus.journeyDetails?.fromStop.name} to {selectedBus.journeyDetails?.toStop.name}
                  </p>
                </div>
              </div>
              <div className="busbuddy-primary-bg text-white px-3 py-1 rounded-full text-xs font-medium">Live</div>
            </div>
          </div>

          {/* Stops List */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-200">
            <div className="space-y-4">
              {mockStops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Status Icon */}
                    <div className="flex flex-col items-center">
                      {stop.status === "departed" && <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />}
                      {stop.status === "arriving" && <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />}
                      {stop.status === "upcoming" && <Circle className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />}
                      {/* Connecting line */}
                      {index < mockStops.length - 1 && (
                        <div className="w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent mt-2"></div>
                      )}
                    </div>

                    {/* Stop Details */}
                    <div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">{stop.name}</div>
                      <div
                        className={`text-xs sm:text-sm ${
                          stop.status === "departed"
                            ? "text-green-600"
                            : stop.status === "arriving"
                              ? "text-blue-600"
                              : "text-gray-500"
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
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">
                    {stop.status === "arriving" ? "Arriving" : stop.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isConnected && (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center shadow-lg border border-gray-200">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-amber-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <WifiOff className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Connecting to Live Updates</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Establishing connection with the bus tracking system...
          </p>
          <div className="flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
          <div className="mt-4 text-xs sm:text-sm text-gray-500">Make sure you have a stable internet connection</div>
        </div>
      )}
    </div>
  )
}
