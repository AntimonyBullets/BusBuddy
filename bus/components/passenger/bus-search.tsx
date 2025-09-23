"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, MapPin, ArrowRight, Users, Clock, Route, Zap, ArrowUpDown } from "lucide-react"
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
    return isOnline ? "text-emerald-600" : "text-red-600"
  }

  const getStatusText = (isOnline: boolean) => {
    return isOnline ? "Online" : "Offline"
  }

  const getCapacityColor = (current: number, total: number) => {
    const percentage = (current / total) * 100
    if (percentage < 50) return "text-emerald-600"
    if (percentage < 80) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Enhanced Search Form */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="start-stop" className="text-gray-900 font-medium flex items-center space-x-2">
              <div className="p-1 sm:p-1.5 rounded-lg bg-green-50 border border-green-200">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              </div>
              <span className="text-sm sm:text-base">From (Start Stop)</span>
            </Label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input
                id="start-stop"
                placeholder="Enter start stop name"
                value={startStop}
                onChange={(e) => setStartStop(e.target.value)}
                className="relative bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-200 rounded-xl h-10 sm:h-12 text-base sm:text-lg transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex justify-center py-1 sm:py-2">
            <button
              type="button"
              onClick={() => {
                const temp = startStop;
                setStartStop(endStop);
                setEndStop(temp);
              }}
              className="relative group"
            >
              <div className="absolute inset-0 busbuddy-primary-bg rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative p-2 sm:p-3 busbuddy-primary-bg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110">
                <ArrowUpDown className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </button>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="end-stop" className="text-gray-900 font-medium flex items-center space-x-2">
              <div className="p-1 sm:p-1.5 rounded-lg bg-red-50 border border-red-200">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
              </div>
              <span className="text-sm sm:text-base">To (Destination Stop)</span>
            </Label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-blue-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input
                id="end-stop"
                placeholder="Enter destination stop name"
                value={endStop}
                onChange={(e) => setEndStop(e.target.value)}
                className="relative bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-200 rounded-xl h-10 sm:h-12 text-base sm:text-lg transition-all duration-300"
              />
            </div>
          </div>

          <Button
            onClick={handleSearch}
            className="w-full h-12 sm:h-14 busbuddy-primary-bg hover:bg-[#1e1b4b] text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 text-base sm:text-lg group relative overflow-hidden"
            disabled={isLoading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
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
        <div className="space-y-3 sm:space-y-4 mt-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <div className="absolute inset-0 busbuddy-primary-bg rounded-lg blur-lg opacity-50"></div>
              <div className="relative p-1.5 sm:p-2 busbuddy-primary-bg rounded-lg shadow-lg">
                <Route className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Available Routes ({searchResults.length})</h3>
          </div>

          <div className="grid gap-3 sm:gap-4">
            {searchResults.map((bus, index) => (
              <div
                key={bus.busId}
                className="group cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => onBusSelect(bus)}
              >
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 busbuddy-primary-bg rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                          <div className="relative px-3 sm:px-4 py-1 sm:py-2 busbuddy-primary-bg rounded-xl shadow-lg">
                            <span className="text-white font-bold text-sm sm:text-lg">{bus.busNumber}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                          <div className="relative flex-shrink-0">
                            <div
                              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${bus.isDriverOnline ? "bg-emerald-500" : "bg-red-500"} animate-pulse`}
                            ></div>
                            {bus.isDriverOnline && (
                              <div className="absolute inset-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
                            )}
                          </div>
                          <span className={`font-medium text-xs sm:text-sm ${getStatusColor(bus.isDriverOnline)} truncate`}>
                            {getStatusText(bus.isDriverOnline)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl border border-gray-200 flex-shrink-0">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                        <span className={`font-bold text-xs sm:text-sm ${getCapacityColor(bus.connectedPassengers, bus.capacity)}`}>
                          {bus.connectedPassengers}/{bus.capacity}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-lg group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                        {bus.routeName}
                      </h4>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <div className="p-0.5 sm:p-1 rounded bg-blue-50">
                          <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-blue-600" />
                        </div>
                        <span className="text-xs sm:text-sm truncate">Driver: {bus.driverName}</span>
                      </div>

                      {bus.journeyDetails && (
                        <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-500" />
                            <span>{bus.journeyDetails.totalStopsInJourney} stops</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-500" />
                            <span className="truncate">{bus.journeyDetails.estimatedJourneyTime}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 sm:mt-6 flex items-center justify-between">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">Tap to track live</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2 text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
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
