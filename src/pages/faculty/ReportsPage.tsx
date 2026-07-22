// src/pages/faculty/ReportsPage.tsx
import { useState } from "react"
import { motion } from "framer-motion"
import {
  Download, FileText, Plus, Filter, Search, CheckCircle,
  Loader2, Calendar, Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/common/PageHeader"
import { mockReports } from "@/services/mockData"
import { formatDate } from "@/utils/helpers"

export function ReportsPage() {
  const [reports, setReports] = useState(mockReports)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [showGenerate, setShowGenerate] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: "", type: "Department Summary", format: "PDF", dateFrom: "", dateTo: "" })

  const types = [...new Set(mockReports.map((r) => r.type))]

  const filtered = reports.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === "all" || r.type === filterType
    return matchSearch && matchType
  })

  async function handleGenerate() {
    if (!form.title) return
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 2000))
    const newReport = {
      id: `RPT-${Date.now()}`,
      title: form.title,
      type: form.type,
      generatedOn: new Date().toISOString().split("T")[0],
      generatedBy: "Dr. Priya Nair",
      students: Math.floor(Math.random() * 100) + 40,
      format: form.format,
      size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
      status: "ready",
    }
    setReports((prev) => [newReport, ...prev])
    setGenerating(false)
    setShowGenerate(false)
    setForm({ title: "", type: "Department Summary", format: "PDF", dateFrom: "", dateTo: "" })
  }

  async function handleDownload(id: string) {
    setDownloadingId(id)
    await new Promise((r) => setTimeout(r, 1200))
    setDownloadingId(null)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Reports & Export"
        description="Generate, view, and export examination reports"
        breadcrumbs={[{ label: "Dashboard", href: "/faculty/dashboard" }, { label: "Reports" }]}
        actions={
          <Button onClick={() => setShowGenerate(true)}>
            <Plus className="w-4 h-4" /> Generate Report
          </Button>
        }
      />

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Reports", value: reports.length, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "PDF Reports", value: reports.filter((r) => r.format === "PDF").length, icon: FileText, color: "text-red-600", bg: "bg-red-50" },
          { label: "Excel Reports", value: reports.filter((r) => r.format === "XLSX").length, icon: FileText, color: "text-green-600", bg: "bg-green-50" },
          { label: "Students Covered", value: reports.reduce((a, r) => a + r.students, 0), icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.bg}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Filters */}
      <Card className="mb-5">
        <CardContent className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reports…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Reports table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No reports found</p>
              <Button size="sm" className="mt-4" onClick={() => setShowGenerate(true)}>
                <Plus className="w-3 h-3" /> Generate Report
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-xs text-muted-foreground">
                    <th className="text-left p-3 pl-4 font-medium">Report</th>
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Generated</th>
                    <th className="text-left p-3 font-medium">Students</th>
                    <th className="text-left p-3 font-medium">Format</th>
                    <th className="text-left p-3 font-medium">Size</th>
                    <th className="text-right p-3 pr-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((report, i) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b last:border-0 hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-3 pl-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-blue-50 rounded flex items-center justify-center flex-shrink-0">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-xs line-clamp-1">{report.title}</p>
                            <p className="text-xs text-muted-foreground">By {report.generatedBy}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3"><Badge variant="muted" className="text-xs">{report.type}</Badge></td>
                      <td className="p-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(report.generatedOn)}
                        </div>
                      </td>
                      <td className="p-3 text-xs">{report.students}</td>
                      <td className="p-3">
                        <Badge variant={report.format === "PDF" ? "info" : "success"} className="text-xs">{report.format}</Badge>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">{report.size}</td>
                      <td className="p-3 pr-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => handleDownload(report.id)}
                          disabled={downloadingId === report.id}
                        >
                          {downloadingId === report.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Download className="w-3 h-3" />
                          )}
                          Download
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Report Dialog */}
      <Dialog open={showGenerate} onOpenChange={setShowGenerate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Report Title</Label>
              <Input
                placeholder="e.g. CS Department June 2024 Report"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Report Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Department Summary">Department Summary</SelectItem>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                    <SelectItem value="Language Analytics">Language Analytics</SelectItem>
                    <SelectItem value="Remedial">Remedial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Format</Label>
                <Select value={form.format} onValueChange={(v) => setForm((f) => ({ ...f, format: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="XLSX">Excel (XLSX)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>From Date</Label>
                <Input type="date" value={form.dateFrom} onChange={(e) => setForm((f) => ({ ...f, dateFrom: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>To Date</Label>
                <Input type="date" value={form.dateTo} onChange={(e) => setForm((f) => ({ ...f, dateTo: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerate(false)}>Cancel</Button>
            <Button onClick={handleGenerate} disabled={!form.title || generating}>
              {generating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
              ) : (
                "Generate Report"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
