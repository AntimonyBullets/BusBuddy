"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Bus, MapPin, Users, Star, ArrowRight, LogIn, UserPlus, Plus, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AuthService } from "@/lib/auth"

// Tier 2 cities in India with their approximate coordinates
const TIER2_CITIES = [
  { name: "Agra", state: "Uttar Pradesh", lat: 27.1767, lng: 78.0081 },
  { name: "Ajmer", state: "Rajasthan", lat: 26.4499, lng: 74.6399 },
  { name: "Aligarh", state: "Uttar Pradesh", lat: 27.8974, lng: 78.088 },
  { name: "Amritsar", state: "Punjab", lat: 31.634, lng: 74.8723 },
  { name: "Aurangabad", state: "Maharashtra", lat: 19.8762, lng: 75.3433 },
  { name: "Bareilly", state: "Uttar Pradesh", lat: 28.367, lng: 79.4304 },
  { name: "Bikaner", state: "Rajasthan", lat: 28.0229, lng: 73.3119 },
  { name: "Chandigarh", state: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558 },
  { name: "Dehradun", state: "Uttarakhand", lat: 30.3165, lng: 78.0322 },
  { name: "Dhanbad", state: "Jharkhand", lat: 23.7957, lng: 86.4304 },
  { name: "Faridabad", state: "Haryana", lat: 28.4089, lng: 77.3178 },
  { name: "Ghaziabad", state: "Uttar Pradesh", lat: 28.6692, lng: 77.4538 },
  { name: "Guwahati", state: "Assam", lat: 26.1445, lng: 91.7362 },
  { name: "Hubli", state: "Karnataka", lat: 15.3647, lng: 75.124 },
  { name: "Jabalpur", state: "Madhya Pradesh", lat: 23.1815, lng: 79.9864 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Jalandhar", state: "Punjab", lat: 31.326, lng: 75.5762 },
  { name: "Jammu", state: "Jammu and Kashmir", lat: 32.7266, lng: 74.857 },
  { name: "Jamshedpur", state: "Jharkhand", lat: 22.8046, lng: 86.2029 },
  { name: "Jodhpur", state: "Rajasthan", lat: 26.2389, lng: 73.0243 },
  { name: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lng: 80.3319 },
  { name: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673 },
  { name: "Kota", state: "Rajasthan", lat: 25.2138, lng: 75.8648 },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { name: "Ludhiana", state: "Punjab", lat: 30.901, lng: 75.8573 },
  { name: "Madurai", state: "Tamil Nadu", lat: 9.9252, lng: 78.1198 },
  { name: "Mangalore", state: "Karnataka", lat: 12.9141, lng: 74.856 },
  { name: "Meerut", state: "Uttar Pradesh", lat: 28.9845, lng: 77.7064 },
  { name: "Mysore", state: "Karnataka", lat: 12.2958, lng: 76.6394 },
  { name: "Nashik", state: "Maharashtra", lat: 19.9975, lng: 73.7898 },
  { name: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376 },
  { name: "Raipur", state: "Chhattisgarh", lat: 21.2514, lng: 81.6296 },
  { name: "Rajkot", state: "Gujarat", lat: 22.3039, lng: 70.8022 },
  { name: "Ranchi", state: "Jharkhand", lat: 23.3441, lng: 85.3096 },
  { name: "Salem", state: "Tamil Nadu", lat: 11.6643, lng: 78.146 },
  { name: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311 },
  { name: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lng: 76.9366 },
  { name: "Tiruchirappalli", state: "Tamil Nadu", lat: 10.7905, lng: 78.7047 },
  { name: "Udaipur", state: "Rajasthan", lat: 24.5854, lng: 73.7125 },
  { name: "Vadodara", state: "Gujarat", lat: 22.3072, lng: 73.1812 },
  { name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739 },
  { name: "Vijayawada", state: "Andhra Pradesh", lat: 16.5062, lng: 80.648 },
  { name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lng: 83.2185 },
]

interface BusRegistrationForm {
  busId: string
  busNumber: string
  secretKey: string
  routeName: string
  driverName: string
  ownerEmail: string
  driverPhone: string
  capacity: number
  startPoint: string
  endPoint: string
  stops: string
}

export default function HeroPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [formData, setFormData] = useState<BusRegistrationForm>({
    busId: "",
    busNumber: "",
    secretKey: "",
    routeName: "",
    driverName: "",
    ownerEmail: "",
    driverPhone: "",
    capacity: 0,
    startPoint: "",
    endPoint: "",
    stops: "",
  })

  useEffect(() => {
    const authService = AuthService.getInstance()
    setIsAuthenticated(authService.isAuthenticated())
  }, [])

  const handleLogout = async () => {
    try {
      const authService = AuthService.getInstance()
      await authService.logout()
      setIsAuthenticated(false)
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
      })
    }
  }

  const getCityCoordinates = (cityName: string) => {
    const city = TIER2_CITIES.find((c) => c.name.toLowerCase() === cityName.toLowerCase())
    return city ? { latitude: city.lat, longitude: city.lng } : null
  }

  const handleInputChange = (field: keyof BusRegistrationForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const startCoords = getCityCoordinates(formData.startPoint)
      const endCoords = getCityCoordinates(formData.endPoint)

      if (!startCoords || !endCoords) {
        toast({
          title: "Invalid Cities",
          description: "Please select valid cities from the dropdown",
          variant: "destructive",
        })
        return
      }

      const stopsArray = formData.stops
        .split(",")
        .map((stop, index) => {
          const stopName = stop.trim()
          const stopCoords = getCityCoordinates(stopName)
          return {
            name: stopName,
            latitude: stopCoords?.latitude || startCoords.latitude,
            longitude: stopCoords?.longitude || startCoords.longitude,
            order: index + 1,
          }
        })
        .filter((stop) => stop.name)

      const busData = {
        busId: formData.busId,
        busNumber: formData.busNumber,
        secretKey: formData.secretKey,
        routeName: formData.routeName,
        driverName: formData.driverName,
        ownerEmail: formData.ownerEmail,
        driverPhone: formData.driverPhone,
        capacity: formData.capacity,
        route: {
          startPoint: {
            name: formData.startPoint,
            latitude: startCoords.latitude,
            longitude: startCoords.longitude,
          },
          endPoint: {
            name: formData.endPoint,
            latitude: endCoords.latitude,
            longitude: endCoords.longitude,
          },
          stops: stopsArray,
        },
      }

      console.log("[v0] Submitting bus registration:", busData)

      const response = await fetch("/api/buses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(busData),
      })

      if (response.ok) {
        toast({
          title: "Bus Registered Successfully!",
          description: "Your bus has been registered and is now available for tracking.",
        })
        setFormData({
          busId: "",
          busNumber: "",
          secretKey: "",
          routeName: "",
          driverName: "",
          ownerEmail: "",
          driverPhone: "",
          capacity: 0,
          startPoint: "",
          endPoint: "",
          stops: "",
        })
      } else {
        throw new Error("Registration failed")
      }
    } catch (error) {
      console.error("[v0] Bus registration error:", error)
      toast({
        title: "Registration Failed",
        description: "There was an error registering your bus. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-emerald-500/5"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          {/* Header */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-16 gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl sm:rounded-2xl blur-sm opacity-50"></div>
                <div className="relative p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-xl">
                  <Bus className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">BusBuddy</h1>
                <p className="text-xs sm:text-sm text-emerald-600 font-sans">Smart Transit Companion</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/auth")}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-xl sm:rounded-2xl font-medium text-sm flex-1 sm:flex-initial"
                  >
                    <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                  <Button
                    onClick={() => router.push("/auth")}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl sm:rounded-2xl font-medium shadow-lg text-sm flex-1 sm:flex-initial"
                  >
                    <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 border-red-500 text-red-600 hover:bg-red-50 rounded-xl sm:rounded-2xl font-medium bg-transparent text-sm"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              )}
            </div>
          </header>

          {/* Hero Content */}
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-serif">
              Track Your Bus in Real-Time
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto font-sans px-2">
              Connecting Passengers and Operators Seamlessly. Experience the future of public transportation with
              real-time tracking, smart notifications, and seamless journey planning.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto mb-8 sm:mb-16 px-4">
              <Button
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 h-auto shadow-xl transition-all duration-300"
                onClick={() => router.push("/passenger")}
              >
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                  <div className="text-left">
                    <div className="font-semibold text-base sm:text-lg">I'm a Passenger</div>
                    <div className="text-xs sm:text-sm opacity-90">Find & track buses</div>
                  </div>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </Button>

              <Button
                variant="outline"
                className="group relative overflow-hidden bg-white/80 hover:bg-white text-emerald-600 border-emerald-200 hover:border-emerald-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 h-auto shadow-xl transition-all duration-300"
                onClick={() => router.push("/driver")}
              >
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <Bus className="h-5 w-5 sm:h-6 sm:w-6" />
                  <div className="text-left">
                    <div className="font-semibold text-base sm:text-lg">I'm a Driver</div>
                    <div className="text-xs sm:text-sm opacity-90">Manage your route</div>
                  </div>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-16 px-4">
              {[
                { number: "10K+", label: "Active Users", icon: Users },
                { number: "500+", label: "Bus Routes", icon: Bus },
                { number: "4.8", label: "User Rating", icon: Star },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-xl mb-3 sm:mb-4">
                    <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent mb-16"></div>
      </div>

      {/* Bus Registration Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card className="bg-white shadow-2xl border-0 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold font-serif">Register Your Bus</CardTitle>
                <p className="text-emerald-100 mt-1 font-sans">Join our network and start tracking your bus</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="busId" className="text-gray-700 font-medium">
                    Bus ID
                  </Label>
                  <Input
                    id="busId"
                    value={formData.busId}
                    onChange={(e) => handleInputChange("busId", e.target.value)}
                    placeholder="e.g., BUS111"
                    required
                    className="rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="busNumber" className="text-gray-700 font-medium">
                    Bus Number
                  </Label>
                  <Input
                    id="busNumber"
                    value={formData.busNumber}
                    onChange={(e) => handleInputChange("busNumber", e.target.value)}
                    placeholder="e.g., RJ19P403159"
                    required
                    className="rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secretKey" className="text-gray-700 font-medium">
                    Secret Key
                  </Label>
                  <Input
                    id="secretKey"
                    type="password"
                    value={formData.secretKey}
                    onChange={(e) => handleInputChange("secretKey", e.target.value)}
                    placeholder="Enter secret key"
                    required
                    className="rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-gray-700 font-medium">
                    Capacity
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity || ""}
                    onChange={(e) => handleInputChange("capacity", Number.parseInt(e.target.value) || 0)}
                    placeholder="e.g., 45"
                    required
                    className="rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverName" className="text-gray-700 font-medium">
                    Driver Name
                  </Label>
                  <Input
                    id="driverName"
                    value={formData.driverName}
                    onChange={(e) => handleInputChange("driverName", e.target.value)}
                    placeholder="e.g., Durgesh ji Bhati"
                    required
                    className="rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverPhone" className="text-gray-700 font-medium">
                    Driver Phone
                  </Label>
                  <Input
                    id="driverPhone"
                    value={formData.driverPhone}
                    onChange={(e) => handleInputChange("driverPhone", e.target.value)}
                    placeholder="e.g., 9871247100"
                    required
                    className="rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerEmail" className="text-gray-700 font-medium">
                    Owner Email
                  </Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => handleInputChange("ownerEmail", e.target.value)}
                    placeholder="e.g., ravi@gmail.com"
                    required
                    className="rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routeName" className="text-gray-700 font-medium">
                    Route Name
                  </Label>
                  <Input
                    id="routeName"
                    value={formData.routeName}
                    onChange={(e) => handleInputChange("routeName", e.target.value)}
                    placeholder="e.g., Thob to Osian"
                    required
                    className="rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startPoint" className="text-gray-700 font-medium">
                    Start Point
                  </Label>
                  <Select value={formData.startPoint} onValueChange={(value) => handleInputChange("startPoint", value)}>
                    <SelectTrigger className="rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="Select start city" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIER2_CITIES.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}, {city.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endPoint" className="text-gray-700 font-medium">
                    End Point
                  </Label>
                  <Select value={formData.endPoint} onValueChange={(value) => handleInputChange("endPoint", value)}>
                    <SelectTrigger className="rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="Select end city" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIER2_CITIES.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}, {city.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stops" className="text-gray-700 font-medium">
                  Intermediate Stops
                </Label>
                <Textarea
                  id="stops"
                  value={formData.stops}
                  onChange={(e) => handleInputChange("stops", e.target.value)}
                  placeholder="Enter stops separated by commas (e.g., Bambhuon Ki Dhani, Dhaundaara, Basni)"
                  rows={3}
                  className="rounded-xl border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
                <p className="text-sm text-gray-500">Separate multiple stops with commas</p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Registering Bus...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Register Bus
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
