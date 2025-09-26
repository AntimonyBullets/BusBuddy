"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { BusSearch } from "@/components/passenger/bus-search"
import { RecentSearches } from "@/components/passenger/recent-searches"
import { BusTrackingView } from "@/components/map/bus-tracking-view"
import type { BusSearchResult } from "@/lib/bus-api"
import { Bus, ArrowLeft, Map, List, Navigation, Clock, MapPin, LogOut } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 safe-area-inset relative">
      <header className="relative z-10">
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <div className="p-4 pwa-header safe-area-top" style={{padding: '16px'}}>
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="flex items-center space-x-2 sm:space-x-4">
                {viewMode === "tracking" && (
                  <button
                    onClick={handleBackToSearch}
                    className="group flex items-center transition-all duration-200"
                    style={{color: '#212153'}}
                  >
                    <div className="p-2 sm:p-3 rounded-xl bg-white shadow-md group-hover:shadow-lg transition-all duration-200 border border-gray-200">
                      <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  </button>
                )}

                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="relative">
                    <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl" style={{background: 'linear-gradient(to bottom right, #212153, #1e1b4b)'}}>
                      <Bus className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight" style={{color: '#212153'}}>
                      {viewMode === "search" ? "Find Your Bus" : `Tracking ${selectedBus?.busNumber}`}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {viewMode === "search" ? "Smart Transit Search" : "Real-time Tracking"}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 border-red-500 text-red-600 hover:bg-red-50 rounded-xl sm:rounded-2xl font-medium bg-transparent text-xs sm:text-sm"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 p-3 sm:p-6 max-w-7xl mx-auto pb-20">
        {viewMode === "search" ? (
          <div className="space-y-4 sm:space-y-8">
            {/* Enhanced Search Section */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300" style={{border: '1px solid #1f1c4c'}}>
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-8">
                <div className="relative">
                  <div className="p-2 sm:p-3 rounded-xl shadow-lg" style={{background: 'linear-gradient(to bottom right, #212153, #1e1b4b)'}}>
                    <Navigation className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold" style={{color: '#212153'}}>Smart Bus Search</h2>
                  <p className="text-sm sm:text-base text-gray-600">Find buses between any two stops</p>
                </div>
              </div>
              <BusSearch onBusSelect={handleBusSelect} />
            </div>

            {/* Enhanced Recent Searches Section */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-lg" style={{border: '1px solid #1f1c4c'}}>
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-8">
                <div className="relative">
                  <div className="p-2 sm:p-3 rounded-xl shadow-lg" style={{background: 'linear-gradient(to bottom right, #212153, #1e1b4b)'}}>
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold" style={{color: '#212153'}}>Recent Searches</h2>
                  <p className="text-sm sm:text-base text-gray-600">Quick access to your previous routes</p>
                </div>
              </div>
              <RecentSearches onSearchSelect={handleRecentSearchSelect} />
            </div>
          </div>
        ) : selectedBus ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-lg border" style={{borderColor: '#212153'}}>
            <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-8">
              <div className="relative">
                <div className="p-2 sm:p-3 rounded-xl shadow-lg" style={{background: 'linear-gradient(to bottom right, #212153, #1e1b4b)'}}>
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold" style={{color: '#212153'}}>Live Bus Tracking</h2>
                <p className="text-sm sm:text-base text-gray-600">Real-time location and updates</p>
              </div>
            </div>
            <BusTrackingView selectedBus={selectedBus} onViewChange={setTrackingView} currentView={trackingView} />
          </div>
        ) : null}
      </main>

      {viewMode === "tracking" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 sm:p-6 shadow-2xl safe-area-bottom">
          <div className="flex justify-center gap-2 sm:gap-4 max-w-md mx-auto">
            <button
              onClick={() => {
                console.log("[v0] Map view clicked, current view:", trackingView)
                setTrackingView("map")
              }}
              className={`group flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-medium transition-all duration-200 ${
                trackingView === "map"
                  ? "text-white shadow-lg"
                  : "bg-gray-100 hover:bg-gray-200 border border-gray-300"
              }`}
              style={trackingView === "map" ? {background: 'linear-gradient(to right, #212153, #1e1b4b)'} : {color: '#212153'}}
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
                  ? "text-white shadow-lg"
                  : "bg-gray-100 hover:bg-gray-200 border border-gray-300"
              }`}
              style={trackingView === "list" ? {background: 'linear-gradient(to right, #212153, #1e1b4b)'} : {color: '#212153'}}
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
