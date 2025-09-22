"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus, MapPin, Users, Star, ArrowRight, LogIn, UserPlus, LogOut, Baby, Building2, Map, ChevronRight, Mail, Phone, MapIcon, Facebook, Twitter, Instagram, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AuthService } from "@/lib/auth"



export default function HeroPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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

  const handleServiceCardClick = (serviceName: string) => {
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      router.push("/auth")
    } else {
      // User is authenticated, currently do nothing
      toast({
        title: "Coming Soon",
        description: `${serviceName} feature will be available soon!`,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-8 sm:mb-16 gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-indigo-900 rounded-xl sm:rounded-2xl blur-sm opacity-50"></div>
                <div className="relative p-2 sm:p-3 bg-gradient-to-br from-slate-800 to-indigo-900 rounded-xl sm:rounded-2xl shadow-xl" style={{background: 'linear-gradient(to bottom right, #212153, #1e1b4b)'}}>
                  <Bus className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">BusBuddy</h1>
                <p className="text-xs sm:text-sm" style={{color: '#212153'}}>Smart Transit Companion</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {!isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/auth")}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium text-xs sm:text-sm"
                    style={{borderColor: '#212153', color: '#212153'}}
                  >
                    <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                  <Button
                    onClick={() => router.push("/auth")}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 text-white rounded-xl sm:rounded-2xl font-medium shadow-lg text-xs sm:text-sm"
                    style={{backgroundColor: '#212153'}}
                  >
                    <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 border-red-500 text-red-600 hover:bg-red-50 rounded-xl sm:rounded-2xl font-medium bg-transparent text-xs sm:text-sm"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              )}
            </div>
          </header>

          {/* Hero Content */}
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-6 px-2">
              Track Your Bus in Real-Time
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Connecting Passengers and Operators Seamlessly. Experience the future of public transportation with
              real-time tracking, smart notifications, and seamless journey planning.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6 max-w-lg sm:max-w-2xl mx-auto mb-6 sm:mb-12 px-4">
              <Button
                className="group relative overflow-hidden text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 h-auto shadow-lg transition-all duration-300 w-full"
                style={{background: 'linear-gradient(to right, #212153, #1e1b4b)'}}
                onClick={() => router.push("/passenger")}
              >
                <div className="flex items-center justify-center gap-3">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                  <div className="text-center sm:text-left">
                    <div className="font-semibold text-base sm:text-lg">I'm a Passenger</div>
                    <div className="text-sm opacity-90">Find & track buses</div>
                  </div>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </Button>

              <Button
                variant="outline"
                className="group relative overflow-hidden bg-white/90 hover:bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 h-auto shadow-lg transition-all duration-300 w-full"
                style={{borderColor: '#212153', color: '#212153', borderWidth: '2px'}}
                onClick={() => router.push("/driver")}
              >
                <div className="flex items-center justify-center gap-3">
                  <Bus className="h-5 w-5 sm:h-6 sm:w-6" />
                  <div className="text-center sm:text-left">
                    <div className="font-semibold text-base sm:text-lg">I'm a Driver</div>
                    <div className="text-sm opacity-90">Manage your route</div>
                  </div>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-12 px-4">
              {[
                { number: "10K+", label: "Active Users", icon: Users },
                { number: "500+", label: "Bus Routes", icon: Bus },
                { number: "4.8", label: "User Rating", icon: Star },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-2xl shadow-lg mb-2 sm:mb-4" style={{background: 'linear-gradient(to bottom right, #212153, #1e1b4b)'}}>
                    <stat.icon className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="text-xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* More Services Section */}
      <section className="relative py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              More Services
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Discover additional features to enhance your transportation experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 max-w-6xl mx-auto">
            {/* Track Child's Bus Card */}
            <Card 
              className="group relative overflow-hidden bg-white border-2 hover:shadow-lg transition-all duration-300 rounded-lg sm:rounded-xl cursor-pointer busbuddy-primary-border" 
              onClick={() => handleServiceCardClick("Track Your Child's Bus")}
            >
              <CardHeader className="px-3 sm:px-5 py-2 sm:py-3">
                <div className="flex justify-center mb-2">
                  <div className="p-2 rounded-lg busbuddy-primary-bg">
                    <Baby className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-center busbuddy-primary-color">
                  Track Your Child's Bus
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600 text-center mb-1">
                  Keep your children safe with real-time school bus tracking and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-5 py-1 sm:py-2">
                <div className="flex items-center justify-center text-sm sm:text-base font-medium busbuddy-primary-color">
                  <span>Start Tracking</span>
                  <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>

            {/* Register Institution Card */}
            <Card 
              className="group relative overflow-hidden bg-white border-2 hover:shadow-lg transition-all duration-300 rounded-lg sm:rounded-xl cursor-pointer busbuddy-primary-border" 
              onClick={() => handleServiceCardClick("Register Your Institution")}
            >
              <CardHeader className="px-3 sm:px-5 py-2 sm:py-3">
                <div className="flex justify-center mb-2">
                  <div className="p-2 rounded-lg" style={{background: 'linear-gradient(to bottom right, #212153, #1e1b4b)'}}>
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-center" style={{color: '#212153'}}>
                  Register Your Institution
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600 text-center mb-1">
                  Connect your school or organization to our transportation network
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-5 py-1 sm:py-2">
                <div className="flex items-center justify-center text-sm sm:text-base font-medium" style={{color: '#212153'}}>
                  <span>Get Started</span>
                  <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>

            {/* Track City Bus Routes Card */}
            <Card 
              className="group relative overflow-hidden bg-white border-2 hover:shadow-lg transition-all duration-300 rounded-lg sm:rounded-xl cursor-pointer" 
              style={{borderColor: '#212153'}}
              onClick={() => handleServiceCardClick("Track City Bus Routes")}
            >
              <CardHeader className="px-3 sm:px-5 py-2 sm:py-3">
                <div className="flex justify-center mb-2">
                  <div className="p-2 rounded-lg" style={{background: 'linear-gradient(to bottom right, #212153, #1e1b4b)'}}>
                    <Map className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-center" style={{color: '#212153'}}>
                  Track City Bus Routes
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600 text-center mb-1">
                  Navigate public transportation with real-time city bus tracking and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-5 py-1 sm:py-2">
                <div className="flex items-center justify-center text-sm sm:text-base font-medium" style={{color: '#212153'}}>
                  <span>Explore Routes</span>
                  <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-16" style={{backgroundColor: '#212153'}}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm"></div>
                  <div className="relative p-3 bg-white/10 rounded-xl">
                    <Bus className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">BusBuddy</h3>
                  <p className="text-blue-200 text-sm">Smart Transit Companion</p>
                </div>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                Making public transportation smarter, safer, and more accessible for everyone. Track buses in real-time and never miss your ride.
              </p>
              <div className="flex space-x-4">
                <div className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                  <Facebook className="h-5 w-5 text-white" />
                </div>
                <div className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                  <Twitter className="h-5 w-5 text-white" />
                </div>
                <div className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                  <Instagram className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Track Bus
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Find Routes
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Register Institution
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Driver Portal
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Services</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <Baby className="h-3 w-3" />
                    Child Tracking
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <Building2 className="h-3 w-3" />
                    Institution Registration
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <MapIcon className="h-3 w-3" />
                    City Routes
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    Passenger Portal
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <Bus className="h-3 w-3" />
                    Real-time Tracking
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-blue-200 mt-0.5" />
                  <div>
                    <p className="text-blue-100 text-sm">Email</p>
                    <a href="mailto:support@busbuddy.com" className="text-white text-sm hover:text-blue-200 transition-colors">
                      support@busbuddy.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-blue-200 mt-0.5" />
                  <div>
                    <p className="text-blue-100 text-sm">Phone</p>
                    <a href="tel:+1234567890" className="text-white text-sm hover:text-blue-200 transition-colors">
                      +1 (234) 567-8900
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-blue-200 mt-0.5" />
                  <div>
                    <p className="text-blue-100 text-sm">Address</p>
                    <p className="text-white text-sm">
                      123 Transit Street<br />
                      Smart City, SC 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-blue-100 text-sm">
                © 2025 BusBuddy. All rights reserved.
              </div>
              <div className="flex flex-wrap gap-6">
                <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm">
                  Terms of Service
                </a>
                <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm">
                  Cookie Policy
                </a>
                <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm">
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
