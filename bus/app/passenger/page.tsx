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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center safe-area-inset relative overflow-hidden">
        <div className="text-center relative z-10">
          <div className="relative mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <Bus className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">BusBuddy Passenger</h2>
            <p className="text-blue-200 text-sm sm:text-base">Preparing your journey search...</p>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 safe-area-inset relative">
      <header className="relative z-10">
        <div className="glass-card border-b border-white/10">
          <div className="p-4 sm:p-6 pwa-header safe-area-top">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="flex items-center space-x-2 sm:space-x-4">
                {viewMode === "tracking" && (
                  <button
                    onClick={handleBackToSearch}
                    className="group flex items-center text-white/80 hover:text-white transition-all duration-200"
                  >
                    <div className="p-2 sm:p-3 rounded-xl glass-effect group-hover:bg-white/20 transition-all duration-200 border border-white/20">
                      <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  </button>
                )}

                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="relative">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl sm:rounded-2xl shadow-xl">
                      <Bus className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                      {viewMode === "search" ? "Find Your Bus" : `Tracking ${selectedBus?.busNumber}`}
                    </h1>
                    <p className="text-xs sm:text-sm text-blue-200">
                      {viewMode === "search" ? "Smart Transit Search" : "Real-time Tracking"}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleLogout}
                className="px-6 py-3 bg-gradient-to-r from-red-500/90 to-pink-600/90 hover:from-red-600 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 font-medium backdrop-blur-sm animate-slide-in-right"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 p-3 sm:p-6 max-w-7xl mx-auto pb-20">
        {viewMode === "search" ? (
          <div className="space-y-4 sm:space-y-8">
            {/* Enhanced Search Section */}
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 hover-lift-enhanced animate-scale-in">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl blur-lg opacity-50 animate-glow"></div>
                  <div className="relative p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <Navigation className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-white">Smart Bus Search</h2>
                  <p className="text-sm sm:text-base text-blue-200">Find buses between any two stops</p>
                </div>
              </div>
              <BusSearch onBusSelect={handleBusSelect} />
            </div>

            {/* Enhanced Recent Searches Section */}
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-8">
                <div className="relative">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-white">Recent Searches</h2>
                  <p className="text-sm sm:text-base text-blue-200">Quick access to your previous routes</p>
                </div>
              </div>
              <RecentSearches onSearchSelect={handleRecentSearchSelect} />
            </div>

            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-8">
                <div className="relative">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-white">Quick Actions</h2>
                  <p className="text-sm sm:text-base text-blue-200">Popular routes and shortcuts</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { from: "City Center", to: "Airport", time: "45 min", color: "from-blue-500 to-cyan-600" },
                  { from: "University", to: "Mall", time: "25 min", color: "from-purple-500 to-violet-600" },
                  { from: "Station", to: "Hospital", time: "30 min", color: "from-emerald-500 to-teal-600" },
                  { from: "Downtown", to: "Beach", time: "40 min", color: "from-rose-500 to-pink-600" },
                ].map((route, index) => (
                  <div
                    key={`${route.from}-${route.to}`}
                    className="interactive-card glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 group cursor-pointer animate-scale-in"
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                    onClick={() => console.log(`Quick search: ${route.from} to ${route.to}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400 flex-shrink-0" />
                          <span className="text-white font-medium text-sm sm:text-base truncate">{route.from}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-rose-400 flex-shrink-0" />
                          <span className="text-white font-medium text-sm sm:text-base truncate">{route.to}</span>
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
          <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-8">
              <div className="relative">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-white">Live Bus Tracking</h2>
                <p className="text-sm sm:text-base text-blue-200">Real-time location and updates</p>
              </div>
            </div>
            <BusTrackingView selectedBus={selectedBus} onViewChange={setTrackingView} currentView={trackingView} />
          </div>
        ) : null}
      </main>

      {viewMode === "tracking" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/20 p-3 sm:p-6 shadow-2xl safe-area-bottom">
          <div className="flex justify-center gap-2 sm:gap-4 max-w-md mx-auto">
            <button
              onClick={() => {
                console.log("[v0] Map view clicked, current view:", trackingView)
                setTrackingView("map")
              }}
              className={`group flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-medium transition-all duration-200 ${
                trackingView === "map"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg"
                  : "glass-effect text-white/80 hover:bg-white/20 hover:text-white border border-white/20"
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
              className={`group flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-medium transition-all duration-200 ${
                trackingView === "list"
                  ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg"
                  : "glass-effect text-white/80 hover:bg-white/20 hover:text-white border border-white/20"
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
