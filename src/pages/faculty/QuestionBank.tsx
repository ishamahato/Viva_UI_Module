// src/pages/faculty/QuestionBank.tsx
import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit2, Trash2, Filter, MoreHorizontal, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/common/PageHeader"
import { mockQuestions } from "@/services/mockData"

type Question = typeof mockQuestions[0]

export function QuestionBank() {
  const [questions, setQuestions] = useState(mockQuestions)
  const [search, setSearch] = useState("")
  const [filterSubject, setFilterSubject] = useState("all")
  const [filterDifficulty, setFilterDifficulty] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showDialog, setShowDialog] = useState(false)
  const [editingQ, setEditingQ] = useState<Question | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({
    question: "", subject: "", category: "", difficulty: "Medium", language: "English", status: "active",
  })

  const subjects = [...new Set(mockQuestions.map((q) => q.subject))]

  const filtered = questions.filter((q) => {
    const matchSearch = q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.subject.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase())
    const matchSubject = filterSubject === "all" || q.subject === filterSubject
    const matchDifficulty = filterDifficulty === "all" || q.difficulty === filterDifficulty
    const matchStatus = filterStatus === "all" || q.status === filterStatus
    return matchSearch && matchSubject && matchDifficulty && matchStatus
  })

  function openCreate() {
    setEditingQ(null)
    setForm({ question: "", subject: "", category: "", difficulty: "Medium", language: "English", status: "active" })
    setShowDialog(true)
  }

  function openEdit(q: Question) {
    setEditingQ(q)
    setForm({ question: q.question, subject: q.subject, category: q.category, difficulty: q.difficulty, language: q.language, status: q.status })
    setShowDialog(true)
  }

  function handleSave() {
    if (editingQ) {
      setQuestions((qs) => qs.map((q) => q.id === editingQ.id ? { ...q, ...form } : q))
    } else {
      const newQ: Question = {
        id: `Q-${Date.now()}`, ...form,
        createdBy: "Dr. Priya Nair", createdAt: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0], timesUsed: 0, avgScore: 0,
      }
      setQuestions((qs) => [newQ, ...qs])
    }
    setShowDialog(false)
  }

  function handleDelete(id: string) {
    setQuestions((qs) => qs.filter((q) => q.id !== id))
    setDeleteId(null)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Question Bank"
        description={`${questions.length} questions across ${subjects.length} subjects`}
        breadcrumbs={[{ label: "Dashboard", href: "/faculty/dashboard" }, { label: "Question Bank" }]}
        actions={
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4" /> Add Question
          </Button>
        }
      />

      {/* Filters */}
      <Card className="mb-5">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search questions, subjects, categories…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            {(search || filterSubject !== "all" || filterDifficulty !== "all" || filterStatus !== "all") && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setFilterSubject("all"); setFilterDifficulty("all"); setFilterStatus("all") }}>
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No questions found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or add a new question.</p>
              <Button size="sm" className="mt-4" onClick={openCreate}><Plus className="w-3 h-3" /> Add Question</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-xs text-muted-foreground">
                    <th className="text-left p-3 pl-4 font-medium">Question</th>
                    <th className="text-left p-3 font-medium">Subject</th>
                    <th className="text-left p-3 font-medium">Difficulty</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Used</th>
                    <th className="text-left p-3 font-medium">Avg Score</th>
                    <th className="text-right p-3 pr-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((q, i) => (
                    <motion.tr
                      key={q.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b last:border-0 hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-3 pl-4">
                        <p className="font-medium text-slate-900 line-clamp-2 max-w-xs">{q.question}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{q.category} · {q.language}</p>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="text-xs">{q.subject}</span>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={q.difficulty === "Hard" ? "destructive" : q.difficulty === "Easy" ? "success" : "warning"}
                          className="text-xs"
                        >
                          {q.difficulty}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant={q.status === "active" ? "success" : "muted"} className="text-xs capitalize">
                          {q.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">{q.timesUsed}x</td>
                      <td className="p-3 text-xs font-medium">{q.avgScore > 0 ? `${q.avgScore}%` : "—"}</td>
                      <td className="p-3 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(q)}>
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteId(q.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingQ ? "Edit Question" : "Add New Question"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Question Text</Label>
              <textarea
                className="w-full h-24 text-sm border border-input rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter the examination question…"
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="e.g. Data Structures" />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g. Core Concepts" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Difficulty</Label>
                <Select value={form.difficulty} onValueChange={(v) => setForm((f) => ({ ...f, difficulty: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Language</Label>
                <Select value={form.language} onValueChange={(v) => setForm((f) => ({ ...f, language: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Tamil">Tamil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.question || !form.subject}>{editingQ ? "Save Changes" : "Add Question"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Question?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone. The question will be permanently removed from the bank.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
