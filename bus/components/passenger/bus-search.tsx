"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, MapPin, ArrowRight, Users, Clock, Route, Zap } from "lucide-react"
import { BusApiService, type BusSearchResult } from "@/lib/bus-api"
import { useToast } from "@/hooks/use-toast"

interface BusSearchProps {
  onBusSelect: (bus: BusSearchResult) => void
}

export function BusSearch({ onBusSelect }: BusSearchProps) {
  const [startStop, setStartStop] = useState("")
  const [endStop, setEndStop] = useState("")
  const [searchResults, setSearchResults] = useState<BusSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!startStop.trim() || !endStop.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both start and end stops",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const busApi = BusApiService.getInstance()
      const results = await busApi.searchBusesByRoute(startStop.trim(), endStop.trim())
      setSearchResults(results)

      if (results.length === 0) {
        toast({
          title: "No buses found",
          description: `No buses found from ${startStop} to ${endStop}`,
        })
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Unable to search for buses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? "text-emerald-400" : "text-red-400"
  }

  const getStatusText = (isOnline: boolean) => {
    return isOnline ? "Online" : "Offline"
  }

  const getCapacityColor = (current: number, total: number) => {
    const percentage = (current / total) * 100
    if (percentage < 50) return "text-emerald-400"
    if (percentage < 80) return "text-amber-400"
    return "text-red-400"
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Enhanced Search Form */}
      <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover-lift-enhanced animate-scale-in">
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="start-stop" className="text-white font-medium flex items-center space-x-2">
              <div className="p-1 sm:p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/30">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
              </div>
              <span className="text-sm sm:text-base">From (Start Stop)</span>
            </Label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input
                id="start-stop"
                placeholder="Enter start stop name"
                value={startStop}
                onChange={(e) => setStartStop(e.target.value)}
                className="relative glass-effect border-white/20 text-white placeholder:text-white/60 focus:border-emerald-400/50 focus:ring-emerald-400/20 rounded-xl h-10 sm:h-12 text-base sm:text-lg transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex justify-center py-1 sm:py-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 animate-glow"></div>
              <div className="relative p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-xl animate-bounce-gentle">
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="end-stop" className="text-white font-medium flex items-center space-x-2">
              <div className="p-1 sm:p-1.5 rounded-lg bg-rose-500/20 border border-rose-400/30">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-rose-400" />
              </div>
              <span className="text-sm sm:text-base">To (Destination Stop)</span>
            </Label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input
                id="end-stop"
                placeholder="Enter destination stop name"
                value={endStop}
                onChange={(e) => setEndStop(e.target.value)}
                className="relative glass-effect border-white/20 text-white placeholder:text-white/60 focus:border-rose-400/50 focus:ring-rose-400/20 rounded-xl h-10 sm:h-12 text-base sm:text-lg transition-all duration-300"
              />
            </div>
          </div>

          <Button
            onClick={handleSearch}
            className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500 hover:from-blue-600 hover:via-purple-700 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 border-0 text-base sm:text-lg group relative overflow-hidden"
            disabled={isLoading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                <span className="text-sm sm:text-base">Searching Routes...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm sm:text-base">Find My Bus</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Enhanced Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-3 sm:space-y-4 animate-slide-up">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg blur-lg opacity-50 animate-glow"></div>
              <div className="relative p-1.5 sm:p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg">
                <Route className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Available Routes ({searchResults.length})</h3>
          </div>

          <div className="grid gap-3 sm:gap-4">
            {searchResults.map((bus, index) => (
              <div
                key={bus.busId}
                className="group cursor-pointer animate-scale-in hover-lift-enhanced"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onBusSelect(bus)}
              >
                <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-white/40 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                          <div className="relative px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                            <span className="text-white font-bold text-sm sm:text-lg">{bus.busNumber}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                          <div className="relative flex-shrink-0">
                            <div
                              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${bus.isDriverOnline ? "bg-emerald-400" : "bg-red-400"} animate-pulse-subtle`}
                            ></div>
                            {bus.isDriverOnline && (
                              <div className="absolute inset-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
                            )}
                          </div>
                          <span className={`font-medium text-xs sm:text-sm ${getStatusColor(bus.isDriverOnline)} truncate`}>
                            {getStatusText(bus.isDriverOnline)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 sm:space-x-2 glass-effect px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl border border-white/20 flex-shrink-0">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-white/80" />
                        <span className={`font-bold text-xs sm:text-sm ${getCapacityColor(bus.connectedPassengers, bus.capacity)}`}>
                          {bus.connectedPassengers}/{bus.capacity}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <h4 className="font-bold text-white text-sm sm:text-lg group-hover:text-blue-300 transition-colors duration-300 leading-tight">
                        {bus.routeName}
                      </h4>

                      <div className="flex items-center space-x-2 text-white/80">
                        <div className="p-0.5 sm:p-1 rounded bg-purple-500/20">
                          <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-purple-400" />
                        </div>
                        <span className="text-xs sm:text-sm truncate">Driver: {bus.driverName}</span>
                      </div>

                      {bus.journeyDetails && (
                        <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-white/70">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-400" />
                            <span>{bus.journeyDetails.totalStopsInJourney} stops</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-400" />
                            <span className="truncate">{bus.journeyDetails.estimatedJourneyTime}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 sm:mt-6 flex items-center justify-between">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                        <span className="text-xs sm:text-sm text-white/80 font-medium">Tap to track live</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2 text-blue-300 group-hover:text-blue-200 transition-colors duration-300">
                        <span className="text-xs sm:text-sm font-medium">Track Bus</span>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
