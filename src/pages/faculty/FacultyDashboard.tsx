// src/pages/faculty/FacultyDashboard.tsx
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, BookOpen, Monitor, TrendingUp, Activity, Clock, InboxIcon, Settings, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/common/StatCard"
import { PageHeader } from "@/components/common/PageHeader"
import { mockFacultyStats, mockRecentActivity, mockActiveSessions } from "@/services/mockData"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/utils/helpers"
import { useAuth } from "@/contexts/AuthContext"

const activityIcons: Record<string, string> = {
  session_completed: "✓",
  session_started: "▶",
  question_added: "+",
  report_generated: "↓",
  session_flagged: "⚑",
}

const activityColors: Record<string, string> = {
  session_completed: "bg-green-50 text-green-700",
  session_started: "bg-blue-50 text-blue-700",
  question_added: "bg-purple-50 text-purple-700",
  report_generated: "bg-slate-50 text-slate-700",
  session_flagged: "bg-red-50 text-red-700",
}

export function FacultyDashboard() {
  const { user } = useAuth()
  const [timeLimitStr, setTimeLimitStr] = useState("30")

  useEffect(() => {
    const saved = localStorage.getItem("viva_time_limit")
    if (saved) {
      setTimeLimitStr((parseInt(saved) / 60).toString())
    }
  }, [])

  function handleSaveTimeLimit() {
    const mins = parseInt(timeLimitStr)
    if (!isNaN(mins) && mins > 0) {
      localStorage.setItem("viva_time_limit", (mins * 60).toString())
      alert("Default time limit saved successfully!")
    }
  }
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Faculty Dashboard"
        description="Monitor student performance and manage examinations."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="col-span-2 md:col-span-1 lg:col-span-2">
          <StatCard title="Total Students" value={mockFacultyStats.totalStudents} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" index={0} />
        </div>
        <div className="col-span-2 md:col-span-1 lg:col-span-2">
          <StatCard title="Assessments Done" value={mockFacultyStats.assessmentsCompleted} icon={BookOpen} iconColor="text-green-600" iconBg="bg-green-50" index={1} />
        </div>
        <div className="col-span-2 md:col-span-1 lg:col-span-2">
          <StatCard title="Active Sessions" value={mockFacultyStats.activeSessions} icon={Monitor} iconColor="text-purple-600" iconBg="bg-purple-50" description="Live right now" index={2} />
        </div>
        <div className="col-span-2 md:col-span-1 lg:col-span-2">
          <StatCard title="Avg Score" value={mockFacultyStats.averageScore > 0 ? `${mockFacultyStats.averageScore}%` : "—"} icon={TrendingUp} iconColor="text-amber-600" iconBg="bg-amber-50" index={3} />
        </div>
        <div className="col-span-2 md:col-span-1 lg:col-span-2">
          <StatCard title="Pending Reviews" value={mockFacultyStats.pendingReviews} icon={Clock} iconColor="text-orange-600" iconBg="bg-orange-50" index={4} />
        </div>
        <div className="col-span-2 md:col-span-1 lg:col-span-2">
          <StatCard title="Questions Bank" value={mockFacultyStats.questionsInBank} icon={Activity} iconColor="text-indigo-600" iconBg="bg-indigo-50" index={5} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Active sessions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Sessions
              </CardTitle>
              {mockActiveSessions.length > 0 && (
                <Badge variant="success">{mockActiveSessions.length} active</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {mockActiveSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <InboxIcon className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">No active sessions</p>
                <p className="text-xs text-muted-foreground mt-0.5">Live student sessions will appear here.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {mockActiveSessions.slice(0, 4).map((session, i) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs bg-blue-50 text-blue-700">
                          {getInitials(session.student)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium">{session.student}</p>
                        <p className="text-xs text-muted-foreground">{session.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground font-mono">{session.elapsedTime}</p>
                      <Badge
                        variant={session.status === "recording" ? "destructive" : session.status === "answering" ? "success" : "warning"}
                        className="text-xs capitalize"
                      >
                        {session.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {mockRecentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <InboxIcon className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
                <p className="text-xs text-muted-foreground mt-0.5">System events will be listed here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mockRecentActivity.map((activity, i) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3"
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${activityColors[activity.type] ?? "bg-slate-50 text-slate-700"}`}>
                      {activityIcons[activity.type] ?? "•"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 leading-relaxed">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-500" />
              Examination Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 max-w-sm">
              <div className="space-y-1.5 flex-1">
                <Label htmlFor="time-limit">Default Viva Time Limit (Minutes)</Label>
                <Input 
                  id="time-limit" 
                  type="number" 
                  min="1"
                  value={timeLimitStr} 
                  onChange={(e) => setTimeLimitStr(e.target.value)} 
                />
              </div>
              <Button onClick={handleSaveTimeLimit}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
