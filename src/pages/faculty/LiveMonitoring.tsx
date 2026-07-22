// src/pages/faculty/LiveMonitoring.tsx
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, Mic, Clock, AlertTriangle, RefreshCw, ChevronDown, ChevronUp, InboxIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PageHeader } from "@/components/common/PageHeader"
import { mockActiveSessions } from "@/services/mockData"
import { getInitials } from "@/utils/helpers"

const statusConfig: Record<string, { label: string; variant: any; pulse: boolean }> = {
  recording: { label: "Recording", variant: "destructive", pulse: true },
  answering: { label: "Answering", variant: "success", pulse: true },
  thinking: { label: "Thinking", variant: "warning", pulse: false },
  idle: { label: "Idle", variant: "muted", pulse: false },
}

export function LiveMonitoring() {
  const [sessions, setSessions] = useState(mockActiveSessions)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)

  async function handleRefresh() {
    setRefreshing(true)
    await new Promise((r) => setTimeout(r, 800))
    setRefreshing(false)
    setLastRefresh(new Date())
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Live Monitoring"
        description="Real-time view of all active student sessions"
        breadcrumbs={[{ label: "Dashboard", href: "/faculty/dashboard" }, { label: "Live Monitoring" }]}
        actions={
          <div className="flex items-center gap-3">
            <p className="text-xs text-muted-foreground hidden sm:block">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Sessions", value: sessions.length, color: "text-blue-600" },
          { label: "Recording", value: sessions.filter((s) => s.status === "recording").length, color: "text-red-600" },
          { label: "Answering", value: sessions.filter((s) => s.status === "answering").length, color: "text-green-600" },
          {
            label: "Avg Progress",
            value: sessions.length > 0
              ? `${Math.round(sessions.reduce((a, s) => a + (s.currentQuestion / s.totalQuestions) * 100, 0) / sessions.length)}%`
              : "—",
            color: "text-purple-600",
          },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Session cards or empty state */}
      {sessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <InboxIcon className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No active sessions</p>
            <p className="text-xs text-muted-foreground mt-1">
              When students begin their viva examinations, their live sessions will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session, i) => {
            const config = statusConfig[session.status] ?? statusConfig.idle
            const progress = (session.currentQuestion / session.totalQuestions) * 100

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card className="overflow-hidden">
                  <div
                    className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setExpanded(expanded === session.id ? null : session.id)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarFallback className="text-xs bg-slate-100">{getInitials(session.student)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium">{session.student}</p>
                          <span className="text-xs text-muted-foreground">{session.rollNumber}</span>
                          {config.pulse && (
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{session.subject}</p>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" /> {session.elapsedTime}
                        </div>
                        <div className="hidden md:block text-center">
                          <p className="text-sm font-semibold">{session.currentScore}%</p>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                        <Badge variant={config.variant} className="text-xs">{config.label}</Badge>
                        <div className="text-xs text-muted-foreground">
                          Q{session.currentQuestion}/{session.totalQuestions}
                        </div>
                        {expanded === session.id
                          ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress value={progress} className="h-1" />
                    </div>
                  </div>

                  <AnimatePresence>
                    {expanded === session.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t bg-slate-50"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                              <Mic className="w-3 h-3" /> Live Transcript
                            </p>
                            {session.status === "recording" && (
                              <span className="flex items-center gap-1.5 text-xs text-red-600">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                Recording in progress
                              </span>
                            )}
                          </div>
                          <div className="bg-white border rounded-md p-3 min-h-16">
                            {session.lastTranscript ? (
                              <p className="text-sm text-slate-700 leading-relaxed italic">"{session.lastTranscript}"</p>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">No transcript available yet.</p>
                            )}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" className="text-xs">
                              <Eye className="w-3 h-3" /> View Full Session
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs text-amber-700 border-amber-200 hover:bg-amber-50">
                              <AlertTriangle className="w-3 h-3" /> Flag Session
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
