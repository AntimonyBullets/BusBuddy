"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDriverSocket, useGeolocation } from "@/hooks/use-driver"
import {
  Play,
  Square,
  Navigation,
  Wifi,
  WifiOff,
  Zap,
  Users,
  Clock,
  Gauge,
  Compass,
  MapPin,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TripControlsProps {
  busId: string
  token: string
  driverName: string
  onTripEnd: () => void
}

export function TripControls({ busId, token, driverName, onTripEnd }: TripControlsProps) {
  const [isTripActive, setIsTripActive] = useState(false)
  const [connectedPassengers, setConnectedPassengers] = useState(0)
  const [tripStartTime, setTripStartTime] = useState<Date | null>(null)

  const { isConnected, isAuthenticated, connectAsDriver, joinAsDriver, sendLocationUpdate, goOffline } =
    useDriverSocket()
  const { location, isTracking, error, retryCount, maxRetries, startTracking, stopTracking, retryTracking } =
    useGeolocation()
  const { toast } = useToast()

  // Connect as driver on component mount
  useEffect(() => {
    const connect = async () => {
      try {
        await connectAsDriver(token, busId)
      } catch (error) {
        toast({
          title: "Connection failed",
          description: "Failed to connect to the server",
          variant: "destructive",
        })
      }
    }
    connect()
  }, [connectAsDriver, token, busId, toast])

  // Join as driver once authenticated
  useEffect(() => {
    if (isAuthenticated && !isTripActive) {
      joinAsDriver(busId, { name: driverName })
    }
  }, [isAuthenticated, busId, driverName, joinAsDriver, isTripActive])

  // Send location updates when tracking
  useEffect(() => {
    if (location && isTripActive && isConnected) {
      sendLocationUpdate(
        busId,
        { latitude: location.latitude, longitude: location.longitude },
        location.speed,
        location.heading,
      )
    }
  }, [location, isTripActive, isConnected, busId, sendLocationUpdate])

  const handleStartTrip = () => {
    if (!isConnected || !isAuthenticated) {
      toast({
        title: "Not connected",
        description: "Please wait for connection to establish",
        variant: "destructive",
      })
      return
    }

    const cleanup = startTracking()
    setIsTripActive(true)
    setTripStartTime(new Date())

    toast({
      title: "Trip started",
      description: "You are now sharing your location with passengers",
    })

    return cleanup
  }

  const handleEndTrip = () => {
    stopTracking()
    setIsTripActive(false)
    setTripStartTime(null)

    goOffline(busId, "Trip completed")

    toast({
      title: "Trip ended",
      description: "Location sharing has been stopped",
    })

    onTripEnd()
  }

  const getTripDuration = () => {
    if (!tripStartTime) return "00:00:00"

    const now = new Date()
    const diff = now.getTime() - tripStartTime.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const getConnectionStatus = () => {
    if (isConnected && isAuthenticated) return "Connected"
    if (isConnected) return "Authenticating"
    return "Disconnected"
  }

  const getConnectionColor = () => {
    if (isConnected && isAuthenticated) return "text-green-400"
    if (isConnected) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="space-y-6">
      <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              {isConnected && isAuthenticated ? (
                <Wifi className="h-4 w-4 text-green-400" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">System Status</p>
              <p className={`text-xs ${getConnectionColor()}`}>{getConnectionStatus()}</p>
            </div>
          </div>

          <Badge
            variant={isTripActive ? "default" : "secondary"}
            className={`${
              isTripActive
                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 text-green-300"
                : "bg-white/10 border-white/20 text-white/70"
            } font-medium`}
          >
            {isTripActive ? (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Trip Active</span>
              </div>
            ) : (
              "Trip Inactive"
            )}
          </Badge>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-400/20 rounded-xl backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-300 mb-1">Location Error</h4>
                <p className="text-xs text-red-200 mb-3">{error}</p>

                {error.includes("denied") && (
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-400/20 mb-3">
                    <p className="text-xs text-red-200 font-medium mb-2">🔧 Quick Fix:</p>
                    <ul className="text-xs text-red-200 space-y-1 list-disc list-inside">
                      <li>Click the location icon 📍 in your browser address bar</li>
                      <li>Select "Always allow" for location access</li>
                      <li>Refresh the page and try again</li>
                    </ul>
                  </div>
                )}

                {retryCount < maxRetries && !error.includes("denied") && (
                  <Button
                    onClick={retryTracking}
                    size="sm"
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30"
                  >
                    Retry Location ({retryCount}/{maxRetries})
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <Navigation className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Mission Control</h3>
        </div>

        {!isTripActive ? (
          <Button
            onClick={handleStartTrip}
            className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group"
            disabled={!isConnected || !isAuthenticated}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
                <Play className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-bold">Start Trip</p>
                <p className="text-xs opacity-90">Begin location sharing</p>
              </div>
            </div>
          </Button>
        ) : (
          <Button
            onClick={handleEndTrip}
            className="w-full h-14 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
                <Square className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="font-bold">End Trip</p>
                <p className="text-xs opacity-90">Stop location sharing</p>
              </div>
            </div>
          </Button>
        )}

        {isTripActive && (
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Clock className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white font-mono">{getTripDuration()}</p>
                  <p className="text-xs text-white/60">Trip Duration</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Users className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{connectedPassengers}</p>
                  <p className="text-xs text-white/60">Passengers</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {location && isTripActive && (
        <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
              <MapPin className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Live Telemetry</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Gauge className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{location.speed.toFixed(1)} km/h</p>
                  <p className="text-xs text-white/60">Current Speed</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Compass className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{location.heading.toFixed(0)}°</p>
                  <p className="text-xs text-white/60">Heading</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-300 font-medium mb-1">GPS Coordinates</p>
                <p className="text-xs text-white/70 font-mono">
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-green-300">Broadcasting Live</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isTripActive && (
        <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <Zap className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Quick Start Guide</h3>
          </div>

          <div className="space-y-3">
            {[
              "Ensure GPS is enabled on your device",
              "Click 'Start Trip' to begin sharing location",
              "Passengers will see your real-time location",
              "Click 'End Trip' when your route is complete",
            ].map((instruction, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-xs font-bold text-blue-300">
                  {index + 1}
                </div>
                <p className="text-sm text-white/80">{instruction}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
