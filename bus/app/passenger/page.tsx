"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { BusSearch } from "@/components/passenger/bus-search"
import { RecentSearches } from "@/components/passenger/recent-searches"
import { BusTrackingView } from "@/components/map/bus-tracking-view"
import type { BusSearchResult } from "@/lib/bus-api"
import { Bus, ArrowLeft, Map, List, Navigation, Clock, MapPin, Zap } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"

export default function PassengerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBus, setSelectedBus] = useState<BusSearchResult | null>(null)
  const [viewMode, setViewMode] = useState<"search" | "tracking">("search")
  const [trackingView, setTrackingView] = useState<"map" | "list">("map")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const authService = AuthService.getInstance()
    const authenticated = authService.isAuthenticated()
    setIsAuthenticated(authenticated)
    setIsLoading(false)

    if (!authenticated) {
      router.push("/auth")
    }
  }, [router])

  const handleBusSelect = (bus: BusSearchResult) => {
    setSelectedBus(bus)
    setViewMode("tracking")
    setTrackingView("map") // Default to map view

    // Add to recent searches if available
    if (bus.journeyDetails && (window as any).addRecentSearch) {
      ;(window as any).addRecentSearch(bus.journeyDetails.fromStop.name, bus.journeyDetails.toStop.name)
    }
  }

  const handleBackToSearch = () => {
    setSelectedBus(null)
    setViewMode("search")
  }

  const handleRecentSearchSelect = (fromStop: string, toStop: string) => {
    // This would trigger a new search with the selected stops
    console.log("Selected recent search:", fromStop, "to", toStop)
  }

  const handleLogout = async () => {
    const authService = AuthService.getInstance()
    await authService.logout()
    router.push("/auth")
  }

  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center safe-area-inset relative overflow-hidden">
        <div className="text-center relative z-10">
          <div className="relative mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto shadow-2xl busbuddy-primary-bg">
              <Bus className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold busbuddy-primary-color">BusBuddy Passenger</h2>
            <p className="text-gray-600 text-sm sm:text-base">Preparing your journey search...</p>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full animate-bounce busbuddy-primary-bg"></div>
                <div className="w-2 h-2 rounded-full animate-bounce busbuddy-primary-bg" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce busbuddy-primary-bg" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 safe-area-inset relative">
      <header className="relative z-10">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="pwa-header safe-area-top" style={{ padding: '16px' }}>
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="flex items-center space-x-2 sm:space-x-4">
                {viewMode === "tracking" && (
                  <button
                    onClick={handleBackToSearch}
                    className="group flex items-center busbuddy-primary-color hover:opacity-75 transition-all duration-200"
                  >
                    <div className="p-2 sm:p-3 rounded-xl bg-gray-100 group-hover:bg-gray-200 transition-all duration-200 border border-gray-200">
                      <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  </button>
                )}

                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl blur-sm opacity-50 busbuddy-primary-bg"></div>
                    <div className="relative p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl busbuddy-primary-bg">
                      <Bus className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                      {viewMode === "search" ? "Find Your Bus" : `Tracking ${selectedBus?.busNumber}`}
                    </h1>
                    <p className="text-xs sm:text-sm busbuddy-primary-color">
                      {viewMode === "search" ? "Smart Transit Search" : "Real-time Tracking"}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleLogout}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 font-medium text-sm sm:text-base"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-20">
        {viewMode === "search" ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Enhanced Search Section */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl blur-lg opacity-50 busbuddy-primary-bg"></div>
                  <div className="relative p-2 sm:p-3 rounded-xl shadow-lg busbuddy-primary-bg">
                    <Navigation className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Smart Bus Search</h2>
                  <p className="text-sm sm:text-base text-gray-600">Find buses between any two stops</p>
                </div>
              </div>
              <BusSearch onBusSelect={handleBusSelect} />
            </div>

            {/* Enhanced Recent Searches Section */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
                <div className="relative">
                  <div className="p-2 sm:p-3 rounded-xl shadow-lg busbuddy-primary-bg">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Recent Searches</h2>
                  <p className="text-sm sm:text-base text-gray-600">Quick access to your previous routes</p>
                </div>
              </div>
              <RecentSearches onSearchSelect={handleRecentSearchSelect} />
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
                <div className="relative">
                  <div className="p-2 sm:p-3 rounded-xl shadow-lg busbuddy-primary-bg">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Quick Actions</h2>
                  <p className="text-sm sm:text-base text-gray-600">Popular routes and shortcuts</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { from: "City Center", to: "Airport", time: "45 min", color: "from-blue-400 to-blue-600" },
                  { from: "University", to: "Mall", time: "25 min", color: "from-indigo-400 to-indigo-600" },
                  { from: "Station", to: "Hospital", time: "30 min", color: "from-blue-500 to-indigo-500" },
                  { from: "Downtown", to: "Beach", time: "40 min", color: "from-cyan-400 to-blue-500" },
                ].map((route, index) => (
                  <div
                    key={`${route.from}-${route.to}`}
                    className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 group cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                    onClick={() => console.log(`Quick search: ${route.from} to ${route.to}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-900 font-medium text-sm sm:text-base truncate">{route.from}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                          <span className="text-gray-900 font-medium text-sm sm:text-base truncate">{route.to}</span>
                        </div>
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <div
                          className={`px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r ${route.color} text-white text-xs sm:text-sm font-medium shadow-lg group-hover:scale-105 transition-transform duration-300`}
                        >
                          {route.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : selectedBus ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300" style={{ border: '1px solid #1f1d4d' }}>
            <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
              <div className="relative">
                <div className="p-2 sm:p-3 rounded-xl shadow-lg busbuddy-primary-bg">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Live Bus Tracking</h2>
                <p className="text-sm sm:text-base text-gray-600">Real-time location and updates</p>
              </div>
            </div>
            <BusTrackingView selectedBus={selectedBus} onViewChange={setTrackingView} currentView={trackingView} />
          </div>
        ) : null}
      </main>

      {viewMode === "tracking" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 backdrop-blur-md bg-opacity-95 p-4 sm:p-6 shadow-2xl">
          <div className="flex justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <button
              onClick={() => {
                console.log("[v0] Map view clicked, current view:", trackingView)
                setTrackingView("map")
              }}
              className={`group flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-medium transition-all duration-200 shadow-lg ${
                trackingView === "map"
                  ? "busbuddy-primary-bg text-white shadow-xl scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
              }`}
            >
              <div className="flex items-center justify-center">
                <Map className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                <span className="text-sm sm:text-base">Map View</span>
              </div>
            </button>
            <button
              onClick={() => {
                console.log("[v0] List view clicked, current view:", trackingView)
                setTrackingView("list")
                console.log("[v0] List view set, new view should be: list")
              }}
              className={`group flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-medium transition-all duration-200 shadow-lg ${
                trackingView === "list"
                  ? "busbuddy-primary-bg text-white shadow-xl scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
              }`}
            >
              <div className="flex items-center justify-center">
                <List className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                <span className="text-sm sm:text-base">List</span>
              </div>
            </button>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  )
}
