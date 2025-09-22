"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface RegisterFormProps {
  onSuccess: () => void
  onToggleMode: () => void
}

export function RegisterForm({ onSuccess, onToggleMode }: RegisterFormProps) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const authService = AuthService.getInstance()
      const result = await authService.register(username, email, password)

      if (result.success) {
        toast({
          title: "Registration successful",
          description: `Welcome to BusBuddy, ${result.data.userLoggedIn.username}!`,
        })
        onSuccess()
      } else {
        toast({
          title: "Registration failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred during registration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* BusBuddy Branding */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-indigo-900 rounded-xl blur-sm opacity-50"></div>
            <div className="relative p-3 bg-gradient-to-br from-slate-800 to-indigo-900 rounded-xl shadow-xl" style={{background: 'linear-gradient(to bottom right, #212153, #1e1b4b)'}}>
              <Bus className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">BusBuddy</h1>
            <p className="text-sm" style={{color: '#212153'}}>Smart Transit Companion</p>
          </div>
        </div>
      </div>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium" style={{color: '#212153'}}>Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="rounded-xl border-2 focus:ring-2 h-12 bg-white text-black"
            style={{borderColor: '#e5e7eb', '--tw-ring-color': '#b0d9ff'} as React.CSSProperties}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium" style={{color: '#212153'}}>Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border-2 focus:ring-2 h-12 bg-white text-black"
            style={{borderColor: '#e5e7eb', '--tw-ring-color': '#b0d9ff'} as React.CSSProperties}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium" style={{color: '#212153'}}>Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl border-2 focus:ring-2 h-12 bg-white text-black"
            style={{borderColor: '#e5e7eb', '--tw-ring-color': '#b0d9ff'} as React.CSSProperties}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full h-12 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300" 
          disabled={isLoading}
          style={{backgroundColor: '#212153'}}
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Button variant="link" onClick={onToggleMode} className="text-sm font-medium" style={{color: '#212153'}}>
          Already have an account? Sign in
        </Button>
      </div>
    </div>
  )
}
