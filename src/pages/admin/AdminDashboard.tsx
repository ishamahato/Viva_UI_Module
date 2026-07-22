// src/pages/admin/AdminDashboard.tsx
import { Users, BookOpen, Monitor, TrendingUp, ShieldCheck, Clock, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/common/StatCard"
import { PageHeader } from "@/components/common/PageHeader"
import { mockFacultyStats } from "@/services/mockData"

export function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Admin Overview"
        description="Institution-wide metrics for students and faculty."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <div className="col-span-2 md:col-span-1 lg:col-span-1">
          <StatCard title="Total Students" value={mockFacultyStats.totalStudents + 120} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" index={0} />
        </div>
        <div className="col-span-2 md:col-span-1 lg:col-span-1">
          <StatCard title="Total Faculty" value={45} icon={ShieldCheck} iconColor="text-green-600" iconBg="bg-green-50" index={1} />
        </div>
        <div className="col-span-2 md:col-span-1 lg:col-span-1">
          <StatCard title="Active Sessions" value={mockFacultyStats.activeSessions + 5} icon={Monitor} iconColor="text-purple-600" iconBg="bg-purple-50" description="Live right now" index={2} />
        </div>
        <div className="col-span-2 md:col-span-1 lg:col-span-1">
          <StatCard title="Avg Institution Score" value={"82%"} icon={TrendingUp} iconColor="text-amber-600" iconBg="bg-amber-50" index={3} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Faculty Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
               <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-600">Total Departments</span>
                  <span className="font-semibold">5</span>
               </div>
               <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-600">Questions in Bank</span>
                  <span className="font-semibold">{mockFacultyStats.questionsInBank + 150}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-slate-600">Pending Reviews</span>
                  <span className="font-semibold">{mockFacultyStats.pendingReviews + 12}</span>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-green-600" />
              Student Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4 text-sm">
               <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-600">Assessments Completed</span>
                  <span className="font-semibold">{mockFacultyStats.assessmentsCompleted + 340}</span>
               </div>
               <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-600">Average Viva Duration</span>
                  <span className="font-semibold">18 mins</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-slate-600">System Uptime</span>
                  <span className="font-semibold">99.9%</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
