// src/pages/student/VivaExamination.tsx
import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mic, Square, ChevronLeft, ChevronRight, Send,
  Clock, CheckCircle2, Circle, AlertTriangle, Loader2,
  InboxIcon, Camera, VideoOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useTimer } from "@/hooks/useTimer"
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder"
import { mockVivaQuestions, mockTranscriptLines } from "@/services/mockData"

export function VivaExamination() {
  const navigate = useNavigate()
  const [currentQ, setCurrentQ] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [transcript, setTranscript] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [suspiciousWarning, setSuspiciousWarning] = useState<string | null>(null)
  
  const initialTime = parseInt(localStorage.getItem("viva_time_limit") || "1800")

  const examTimer = useTimer({
    initialSeconds: initialTime,
    autoStart: mockVivaQuestions.length > 0,
    countdown: true,
  })
  const qTimer = useTimer({
    initialSeconds: mockVivaQuestions[currentQ]?.timeLimit ?? 120,
    autoStart: false,
    countdown: true,
  })
  const recorder = useVoiceRecorder()

  const question = mockVivaQuestions[currentQ]

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsCameraActive(true)
        }
      } catch (err) {
        console.error("Error accessing camera", err)
      }
    }
    setupCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Simulate Suspicious Activity warning
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    let dismissTimeout: ReturnType<typeof setTimeout>
    
    if (recorder.isRecording) {
      // Simulate detection after 7 seconds of recording
      timeout = setTimeout(() => {
        setSuspiciousWarning("Suspicious Activity: Multiple faces detected!")
        
        // Auto-dismiss warning after 5 seconds
        dismissTimeout = setTimeout(() => setSuspiciousWarning(null), 5000)
      }, 7000)
    } else {
      setSuspiciousWarning(null)
    }
    return () => {
      clearTimeout(timeout)
      clearTimeout(dismissTimeout)
    }
  }, [recorder.isRecording])

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>
    if (recorder.isRecording && mockTranscriptLines.length > 0) {
      let idx = 0
      intervalId = setInterval(() => {
        if (idx < mockTranscriptLines.length) {
          setTranscript((prev) => [...prev, mockTranscriptLines[idx]])
          idx++
        }
      }, 2500)
    }
    return () => clearInterval(intervalId)
  }, [recorder.isRecording])

  function handleStartRecording() {
    setTranscript([])
    recorder.startRecording()
    qTimer.start()
  }

  function handleStopRecording() {
    recorder.stopRecording()
    qTimer.stop()
  }

  function handleSubmitAnswer() {
    recorder.stopRecording()
    qTimer.stop()
    setAnsweredQuestions((prev) => new Set([...prev, currentQ]))
    setTranscript([])
    recorder.resetRecording()
    if (currentQ < mockVivaQuestions.length - 1) {
      setCurrentQ((c) => c + 1)
      qTimer.reset()
    }
  }

  function handleNext() {
    if (currentQ < mockVivaQuestions.length - 1) {
      setCurrentQ((c) => c + 1)
      recorder.resetRecording()
      setTranscript([])
    }
  }

  function handlePrev() {
    if (currentQ > 0) {
      setCurrentQ((c) => c - 1)
      recorder.resetRecording()
      setTranscript([])
    }
  }

  async function handleFinalSubmit() {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    navigate("/student/completion")
  }

  // ── Empty state: no questions loaded ──────────────────────────────────────
  if (mockVivaQuestions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <InboxIcon className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">No Questions Available</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
          Questions for this examination have not been loaded yet. Please contact your examiner or try again later.
        </p>
        <Button variant="outline" onClick={() => navigate("/student/instructions")}>
          Back to Instructions
        </Button>
      </div>
    )
  }

  const progress = (answeredQuestions.size / mockVivaQuestions.length) * 100
  const timerWarning = examTimer.seconds < 300

  return (
    <div className="max-w-5xl mx-auto">
      {/* Exam header bar */}
      <div className="flex items-center justify-between mb-4 p-3 bg-slate-900 rounded-lg text-white">
        <div>
          <p className="text-sm font-semibold">Viva Examination</p>
          <p className="text-xs text-white/50">In Progress</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1.5 text-sm font-mono font-bold ${timerWarning ? "text-red-400" : "text-white"}`}>
            <Clock className="w-4 h-4" />
            {examTimer.formatted}
          </div>
          <Badge variant="info" className="text-xs">
            {answeredQuestions.size}/{mockVivaQuestions.length} Answered
          </Badge>
          <Button
            size="sm"
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10 text-xs"
            onClick={() => setShowSubmitConfirm(true)}
          >
            Submit All
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>Progress</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Question navigation dots */}
      <div className="flex flex-wrap gap-2 mb-6">
        {mockVivaQuestions.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrentQ(i); recorder.resetRecording(); setTranscript([]) }}
            className={`w-8 h-8 rounded-full text-xs font-semibold border-2 transition-all ${
              i === currentQ
                ? "bg-blue-600 border-blue-600 text-white"
                : answeredQuestions.has(i)
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-white border-slate-200 text-slate-500 hover:border-blue-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-5 gap-5">
        {/* Question panel */}
        <div className="md:col-span-3 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Q {currentQ + 1} / {mockVivaQuestions.length}</Badge>
                      <Badge
                        variant={
                          question.difficulty === "Hard" ? "destructive" :
                          question.difficulty === "Easy" ? "success" : "warning"
                        }
                        className="text-xs"
                      >
                        {question.difficulty}
                      </Badge>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-mono ${qTimer.seconds < 30 && qTimer.isRunning ? "text-red-500" : "text-slate-600"}`}>
                      <Clock className="w-3.5 h-3.5" />
                      {qTimer.formatted}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-1">{question.category}</p>
                  <p className="text-base font-medium text-slate-900 leading-relaxed">
                    {question.question}
                  </p>
                  {answeredQuestions.has(currentQ) && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2.5 rounded-md">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      Answer submitted for this question.
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Voice recorder */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Voice Response</p>
                {recorder.isRecording && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="w-0.5 bg-red-500 rounded-full wave-bar"
                          style={{ height: `${12 + Math.random() * 12}px`, animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </span>
                    <span className="text-xs text-red-500 font-medium recording-pulse">Recording…</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                {recorder.state === "idle" && !answeredQuestions.has(currentQ) && (
                  <Button onClick={handleStartRecording} className="flex-1">
                    <Mic className="w-4 h-4" /> Start Recording
                  </Button>
                )}
                {recorder.isRecording && (
                  <>
                    <Button variant="outline" onClick={handleStopRecording} className="flex-1">
                      <Square className="w-4 h-4" /> Stop
                    </Button>
                    <Button onClick={handleSubmitAnswer} variant="success">
                      <Send className="w-4 h-4" /> Submit Answer
                    </Button>
                  </>
                )}
                {recorder.isStopped && !answeredQuestions.has(currentQ) && (
                  <>
                    <Button variant="outline" onClick={() => { recorder.resetRecording(); setTranscript([]) }} className="flex-1">
                      <Mic className="w-4 h-4" /> Re-record
                    </Button>
                    <Button onClick={handleSubmitAnswer} variant="success">
                      <Send className="w-4 h-4" /> Submit Answer
                    </Button>
                  </>
                )}
                {answeredQuestions.has(currentQ) && (
                  <div className="flex items-center gap-2 text-green-700 text-sm w-full justify-center">
                    <CheckCircle2 className="w-4 h-4" /> Answered
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrev} disabled={currentQ === 0}>
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            {currentQ === mockVivaQuestions.length - 1 ? (
              <Button onClick={() => setShowSubmitConfirm(true)}>Submit Examination</Button>
            ) : (
              <Button variant="outline" onClick={handleNext}>
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-5">
          {/* Camera monitoring */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                {isCameraActive ? <Camera className="w-4 h-4 text-green-600" /> : <VideoOff className="w-4 h-4 text-slate-400" />}
                Live Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative border flex items-center justify-center">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full h-full object-cover ${!isCameraActive && "hidden"}`} 
                />
                {!isCameraActive && (
                  <div className="flex flex-col items-center justify-center text-white/50">
                     <VideoOff className="w-6 h-6 mb-2" />
                     <p className="text-xs">Camera offline</p>
                  </div>
                )}
                
                {suspiciousWarning && (
                  <div className="absolute top-0 left-0 w-full p-2 bg-red-600/90 backdrop-blur-sm text-white flex items-center justify-center gap-2 animate-in slide-in-from-top-4 fade-in z-10">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs font-semibold">{suspiciousWarning}</span>
                  </div>
                )}

                <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur text-white text-[10px] font-medium px-2 py-1 rounded">
                  <span className={`w-1.5 h-1.5 rounded-full ${isCameraActive ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                  REC
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transcript panel */}
          <Card className="h-full max-h-[500px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Real-time Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-48 max-h-72 overflow-y-auto space-y-2">
                {transcript.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Mic className="w-6 h-6 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">Transcript will appear here when recording starts.</p>
                  </div>
                ) : (
                  transcript.map((line, i) => (
                    <motion.p key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-slate-600 leading-relaxed">
                      {line}
                    </motion.p>
                  ))
                )}
              </div>
              <div className="mt-4 pt-4 border-t space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground mb-2">All Questions</p>
                {mockVivaQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentQ(i); recorder.resetRecording(); setTranscript([]) }}
                    className="flex items-center gap-2 w-full text-left group"
                  >
                    {answeredQuestions.has(i) ? (
                      <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className={`w-3 h-3 flex-shrink-0 ${i === currentQ ? "text-blue-600" : "text-slate-300"}`} />
                    )}
                    <span className={`text-xs truncate ${i === currentQ ? "font-medium text-blue-600" : "text-muted-foreground"}`}>
                      Q{i + 1}: {q.category}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit confirm overlay */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold">Submit Examination?</p>
                  <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-md p-3 mb-4 text-sm">
                <div className="flex justify-between text-xs mb-1">
                  <span>Questions Answered</span>
                  <span className="font-medium">{answeredQuestions.size} / {mockVivaQuestions.length}</span>
                </div>
                {answeredQuestions.size < mockVivaQuestions.length && (
                  <p className="text-xs text-amber-600">
                    {mockVivaQuestions.length - answeredQuestions.size} question(s) unanswered. Unanswered questions will score 0.
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowSubmitConfirm(false)}>Continue Exam</Button>
                <Button className="flex-1" onClick={handleFinalSubmit} disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Submit"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
