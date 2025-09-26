"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./button"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { MessageCircle, X, Mic, MicOff, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { AuthService } from "@/lib/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { toast } = useToast()
  const { t } = useLanguage()

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Initialize chatbot with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: t('chatbot.welcome'),
        isUser: false,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length, t])

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }



  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop())
        processAudio()
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
      toast({
        title: t('common.error'),
        description: t('chatbot.microphoneError'),
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processAudio = async () => {
    if (audioChunksRef.current.length === 0) return

    setIsTranscribing(true)
    addMessage(t('chatbot.transcribing'), true)

    try {
      const audioBlob = new Blob(audioChunksRef.current, { 
        type: mediaRecorderRef.current?.mimeType || 'audio/webm' 
      })

      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.webm")

      const authService = AuthService.getInstance()
      const accessToken = authService.getAccessToken()

      const response = await fetch(`${API_BASE_URL}/api/chatbot/transcribe`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      
      // Remove the "transcribing" message and add the actual transcribed text
      setMessages(prev => prev.slice(0, -1))
      
      if (data.transcription) {
        addMessage(data.transcription, true)
        // If there's also a response, add it
        if (data.response) {
          addMessage(data.response, false)
        }
      } else {
        addMessage(t('chatbot.transcriptionError'), false)
      }
    } catch (error) {
      console.error("Error processing audio:", error)
      // Remove the "transcribing" message
      setMessages(prev => prev.slice(0, -1))
      addMessage(t('chatbot.transcriptionError'), false)
      toast({
        title: t('common.error'),
        description: t('chatbot.audioError'),
        variant: "destructive",
      })
    } finally {
      setIsTranscribing(false)
    }
  }



  return (
    <>
      {/* Fixed Chatbot Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </div>
      )}

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]">
          <Card className="h-full flex flex-col shadow-2xl border-0 bg-white/95 backdrop-blur-md">
            <CardHeader className="flex-shrink-0 pb-3" style={{background: 'linear-gradient(to right, #212153, #1e1b4b)'}}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">
                  {t('chatbot.title')}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-4 min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        message.isUser
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                

                
                <div ref={messagesEndRef} />
              </div>

              {/* Audio Input Area */}
              <div className="flex-shrink-0 space-y-3">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    {isRecording ? t('chatbot.recording') : 
                     isTranscribing ? t('chatbot.processing') : 
                     t('chatbot.tapToSpeak')}
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isTranscribing}
                    variant={isRecording ? "destructive" : "default"}
                    className={`rounded-full w-16 h-16 text-white ${
                      isRecording 
                        ? 'animate-pulse bg-red-500 hover:bg-red-600' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    }`}
                  >
                    {isTranscribing ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : isRecording ? (
                      <MicOff className="h-6 w-6" />
                    ) : (
                      <Mic className="h-6 w-6" />
                    )}
                  </Button>
                </div>
                
                {(isRecording || isTranscribing) && (
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}