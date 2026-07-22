// src/pages/faculty/AnalyticsDashboard.tsx
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PageHeader } from "@/components/common/PageHeader"
import { mockAnalyticsData, mockFacultyStats } from "@/services/mockData"
import { motion } from "framer-motion"
import { InboxIcon } from "lucide-react"

const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border rounded-lg shadow-md p-2.5 text-xs">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {p.value}{p.name === "students" ? "" : "%"}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function EmptyChart({ message = "No data available yet" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-60 text-center">
      <InboxIcon className="w-8 h-8 text-muted-foreground/30 mb-2" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

export function AnalyticsDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Analytics Dashboard"
        description="Performance trends and insights across all assessments"
        breadcrumbs={[{ label: "Dashboard", href: "/faculty/dashboard" }, { label: "Analytics" }]}
      />

      <Tabs defaultValue="trends">
        <TabsList className="mb-5">
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="department">By Department</TabsTrigger>
          <TabsTrigger value="distribution">Score Distribution</TabsTrigger>
          <TabsTrigger value="language">Language Analytics</TabsTrigger>
        </TabsList>

        {/* Trends */}
        <TabsContent value="trends">
          <div className="space-y-5">
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: "Total Assessments", value: mockFacultyStats.assessmentsCompleted },
                { label: "Average Score", value: mockFacultyStats.averageScore > 0 ? `${mockFacultyStats.averageScore}%` : "—" },
                { label: "Pass Rate", value: "—" },
                { label: "Top Score (Month)", value: "—" },
              ].map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-0.5">{stat.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Monthly Average Score & Student Count</CardTitle>
              </CardHeader>
              <CardContent>
                {mockAnalyticsData.performanceTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={mockAnalyticsData.performanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="left" domain={[50, 100]} tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line yAxisId="left" type="monotone" dataKey="avgScore" name="Avg Score (%)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                      <Line yAxisId="right" type="monotone" dataKey="students" name="students" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart message="Monthly performance data will appear here once assessments are completed." />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Subject-wise Average Scores</CardTitle>
              </CardHeader>
              <CardContent>
                {mockAnalyticsData.subjectPerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={mockAnalyticsData.subjectPerformance}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => [`${v}%`, "Avg Score"]} />
                      <Bar dataKey="avgScore" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart message="Subject performance data will appear here." />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* By Department */}
        <TabsContent value="department">
          <div className="grid md:grid-cols-2 gap-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Department Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {mockAnalyticsData.departmentPerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={mockAnalyticsData.departmentPerformance}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                      <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => [`${v}%`, "Avg Score"]} />
                      <Bar dataKey="avgScore" radius={[4, 4, 0, 0]}>
                        {mockAnalyticsData.departmentPerformance.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart message="Department comparison data will appear here." />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Department Details</CardTitle>
              </CardHeader>
              <CardContent>
                {mockAnalyticsData.departmentPerformance.length === 0 ? (
                  <EmptyChart message="No department data available." />
                ) : (
                  <div className="space-y-3">
                    {mockAnalyticsData.departmentPerformance.map((dept) => (
                      <div key={dept.department}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium">{dept.department}</span>
                          <span className="text-muted-foreground">{dept.students} students · {dept.avgScore}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: dept.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${dept.avgScore}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Distribution */}
        <TabsContent value="distribution">
          <div className="grid md:grid-cols-2 gap-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {mockAnalyticsData.scoreDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={mockAnalyticsData.scoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => [`${v} students`, "Students"]} />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="count" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart message="Score distribution will appear after assessments are completed." />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Distribution Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {mockAnalyticsData.scoreDistribution.length === 0 ? (
                  <EmptyChart message="No distribution data yet." />
                ) : (
                  <div className="space-y-2.5">
                    {mockAnalyticsData.scoreDistribution.map((d, i) => (
                      <div key={d.range} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-16 flex-shrink-0">{d.range}</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-blue-600"
                            style={{ opacity: 1 - i * 0.08 }}
                            initial={{ width: 0 }}
                            animate={{ width: `${d.percentage}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                          />
                        </div>
                        <span className="text-xs font-medium w-10 text-right">{d.count}</span>
                        <span className="text-xs text-muted-foreground w-8">{d.percentage}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Language */}
        <TabsContent value="language">
          <div className="grid md:grid-cols-2 gap-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Language Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {mockAnalyticsData.languageStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={mockAnalyticsData.languageStats} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="count" nameKey="language">
                        {mockAnalyticsData.languageStats.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v, name) => [`${v} students`, name]} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart message="Language usage data will appear after assessments." />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Usage by Language</CardTitle>
              </CardHeader>
              <CardContent>
                {mockAnalyticsData.languageStats.length === 0 ? (
                  <EmptyChart message="No language data yet." />
                ) : (
                  <div className="space-y-4">
                    {mockAnalyticsData.languageStats.map((lang, i) => (
                      <div key={lang.language}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium">{lang.language}</span>
                          <span className="text-muted-foreground">{lang.count} assessments · {lang.percentage}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                            initial={{ width: 0 }}
                            animate={{ width: `${lang.percentage}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
