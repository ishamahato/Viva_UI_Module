// src/pages/student/StudentDashboard.tsx
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Calendar, Clock, BookOpen, Award, ArrowRight, TrendingUp,
  CheckCircle2, InboxIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatCard } from "@/components/common/StatCard"
import { PageHeader } from "@/components/common/PageHeader"
import {
  mockUpcomingSessions, mockPreviousAttempts,
} from "@/services/mockData"
import { useAuth } from "@/contexts/AuthContext"
import { formatDate, getInitials } from "@/utils/helpers"

const statusColors: Record<string, string> = {
  completed: "success",
  scheduled: "info",
  pending: "warning",
}

export function StudentDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const avgScore = mockPreviousAttempts.length > 0
    ? mockPreviousAttempts.reduce((sum, a) => sum + a.score, 0) / mockPreviousAttempts.length
    : 0

  const bestGrade = mockPreviousAttempts.reduce((best, a) =>
    a.score > (best?.score ?? -1) ? a : best, null as typeof mockPreviousAttempts[0] | null)

  const greeting = user?.name ? `Welcome back, ${user.name.split(" ")[0]}` : "Welcome"

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title={greeting}
        description="Here's your viva examination overview."
      />

      {/* Profile summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-4 bg-slate-900 rounded-lg text-white mb-6"
      >
        <Avatar className="h-12 w-12 border-2 border-blue-400">
          <AvatarFallback className="bg-blue-600 text-sm">
            {user?.name ? getInitials(user.name) : "—"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold">{user?.name || "Student"}</p>
          <p className="text-white/60 text-sm">
            {user ? [user.rollNumber, user.department, user.semester && `${user.semester} Semester`]
              .filter(Boolean).join(" · ") : "No profile data"}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <div className="text-center">
            <p className="text-lg font-bold text-blue-400">
              {avgScore > 0 ? avgScore.toFixed(1) : "—"}
            </p>
            <p className="text-xs text-white/50">Avg Score</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-400">{mockPreviousAttempts.length}</p>
            <p className="text-xs text-white/50">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-400">
              {user?.gpa && user.gpa > 0 ? user.gpa : "—"}
            </p>
            <p className="text-xs text-white/50">GPA</p>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Upcoming Vivas" value={mockUpcomingSessions.length} icon={Calendar} iconColor="text-blue-600" iconBg="bg-blue-50" index={0} />
        <StatCard title="Completed" value={mockPreviousAttempts.length} icon={CheckCircle2} iconColor="text-green-600" iconBg="bg-green-50" index={1} />
        <StatCard
          title="Average Score"
          value={avgScore > 0 ? `${avgScore.toFixed(0)}%` : "—"}
          icon={TrendingUp} iconColor="text-purple-600" iconBg="bg-purple-50" index={2}
        />
        <StatCard
          title="Best Grade"
          value={bestGrade?.grade ?? "—"}
          icon={Award} iconColor="text-amber-600" iconBg="bg-amber-50"
          description={bestGrade?.subject ?? "No attempts yet"}
          index={3}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming sessions */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Upcoming Sessions</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/student/instructions")} className="text-xs">
              View All <ArrowRight className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent>
            {mockUpcomingSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <InboxIcon className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">No upcoming sessions</p>
                <p className="text-xs text-muted-foreground mt-0.5">Your scheduled viva sessions will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mockUpcomingSessions.map((session, i) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start justify-between p-3 border rounded-md hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{session.subject}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(session.date)} · {session.time}
                        </p>
                        <p className="text-xs text-muted-foreground">{session.examiner}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={statusColors[session.status] as any}>{session.status}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />{session.duration}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Button className="w-full mt-1" onClick={() => navigate("/student/instructions")}>
                  Start Next Viva <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Previous attempts */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Previous Attempts</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/student/results")} className="text-xs">
              Results <ArrowRight className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent>
            {mockPreviousAttempts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <InboxIcon className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">No attempts yet</p>
                <p className="text-xs text-muted-foreground mt-0.5">Completed viva results will appear here.</p>
                <Button size="sm" className="mt-4" onClick={() => navigate("/student/instructions")}>
                  Start Your First Viva
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {mockPreviousAttempts.map((attempt, i) => (
                  <motion.div
                    key={attempt.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="p-3 border rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => navigate("/student/results")}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium">{attempt.subject}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(attempt.date)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{attempt.score}%</span>
                        <Badge variant="outline" className="text-xs">{attempt.grade}</Badge>
                      </div>
                    </div>
                    <Progress value={attempt.score} className="h-1.5" />
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Start Viva", desc: "Begin your next exam", color: "bg-blue-600 text-white", onClick: () => navigate("/student/instructions") },
          { label: "View Results", desc: "Check your scores", color: "bg-white border", onClick: () => navigate("/student/results") },
          { label: "Get Feedback", desc: "Improvement tips", color: "bg-white border", onClick: () => navigate("/student/feedback") },
          { label: "Instructions", desc: "Exam guidelines", color: "bg-white border", onClick: () => navigate("/student/instructions") },
        ].map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            onClick={action.onClick}
            className={`p-3 rounded-lg text-left transition-all hover:shadow-md ${action.color}`}
          >
            <p className="text-sm font-semibold">{action.label}</p>
            <p className="text-xs opacity-70 mt-0.5">{action.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
