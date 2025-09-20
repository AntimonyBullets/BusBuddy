"use client"

import { Badge } from "@/components/ui/badge"
import { Bus, Route, User, Phone, Shield, MapPin } from "lucide-react"

interface BusInfoProps {
  busId: string
  busNumber?: string
  routeName?: string
  driverName: string
  driverPhone?: string
}

export function BusInfo({ busId, busNumber, routeName, driverName, driverPhone }: BusInfoProps) {
  return (
    <div className="space-y-6">
      {/* Bus Details Section */}
      <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300 group">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-all duration-300">
            <Bus className="h-4 w-4 text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-white/90">Vehicle Information</h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
            <div>
              <p className="text-xs text-white/60 mb-1">Bus ID</p>
              <p className="text-sm font-mono text-white font-medium">{busId}</p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Shield className="h-4 w-4 text-blue-400" />
            </div>
          </div>

          {busNumber && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div>
                <p className="text-xs text-white/60 mb-1">Bus Number</p>
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 text-green-300 font-medium"
                >
                  #{busNumber}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Route Information */}
      {routeName && (
        <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300 group">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-all duration-300">
              <Route className="h-4 w-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-white/90">Route Assignment</h3>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
            <div>
              <p className="text-xs text-white/60 mb-1">Active Route</p>
              <p className="text-sm font-semibold text-white">{routeName}</p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <MapPin className="h-4 w-4 text-purple-400" />
            </div>
          </div>
        </div>
      )}

      {/* Driver Profile Section */}
      <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300 group">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-all duration-300">
            <User className="h-4 w-4 text-green-400" />
          </div>
          <h3 className="text-sm font-semibold text-white/90">Driver Profile</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
            <div>
              <p className="text-xs text-white/60 mb-1">Driver Name</p>
              <p className="text-sm font-semibold text-white">{driverName}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              {driverName.charAt(0).toUpperCase()}
            </div>
          </div>

          {driverPhone && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div>
                <p className="text-xs text-white/60 mb-1">Contact Number</p>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3 text-green-400" />
                  <p className="text-sm font-mono text-white">{driverPhone}</p>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                <Phone className="h-4 w-4 text-green-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/20">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <p className="text-xs text-green-300 font-medium">Driver Authenticated</p>
        </div>
      </div>
    </div>
  )
}
