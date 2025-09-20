"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DriverApiService } from "@/lib/driver-api"
import { useToast } from "@/hooks/use-toast"
import { Bus, Key, Shield, ArrowRight, Sparkles, CheckCircle } from "lucide-react"

interface DriverAuthProps {
  onAuthSuccess: (busId: string, token: string, busInfo: any) => void
}

export function DriverAuth({ onAuthSuccess }: DriverAuthProps) {
  const [busId, setBusId] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleActivateBus = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!busId.trim() || !secretKey.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both Bus ID and Secret Key",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const driverApi = DriverApiService.getInstance()
      const result = await driverApi.activateBus(busId.trim(), secretKey.trim())

      toast({
        title: "Bus activated successfully",
        description: `Your driver token: ${result.token}`,
      })

      onAuthSuccess(busId.trim(), result.token, result.busInfo)
    } catch (error: any) {
      toast({
        title: "Activation failed",
        description: error.message || "Failed to activate bus",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4 relative">
      <div className="relative w-full max-w-md mx-auto">
        {/* Main Card */}
        <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl">
                  <Bus className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 p-1 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Driver Authentication</h1>
            <p className="text-blue-200 text-sm leading-relaxed">
              Enter your credentials to access the professional driver dashboard
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleActivateBus} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="busId" className="text-white font-medium text-sm">
                Bus ID
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 group-focus-within:text-blue-400 transition-colors duration-200">
                  <Bus className="h-5 w-5" />
                </div>
                <Input
                  id="busId"
                  type="text"
                  placeholder="Enter your bus ID"
                  value={busId}
                  onChange={(e) => setBusId(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-white/10 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:bg-white/15 focus:border-blue-400/50 transition-all duration-300 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secretKey" className="text-white font-medium text-sm">
                Secret Key
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 group-focus-within:text-blue-400 transition-colors duration-200">
                  <Key className="h-5 w-5" />
                </div>
                <Input
                  id="secretKey"
                  type="password"
                  placeholder="Enter your secret key"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-white/10 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:bg-white/15 focus:border-blue-400/50 transition-all duration-300 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed border-0 font-semibold text-base group"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Activating Bus...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Activate Bus</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <h4 className="font-semibold text-white text-sm">How it works:</h4>
            </div>
            <ul className="text-xs text-blue-200 space-y-2 leading-relaxed">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Enter your assigned Bus ID and Secret Key</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>System will generate a secure 6-digit driver token</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Use this token to connect and start sharing location</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Passengers can track your bus in real-time</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
