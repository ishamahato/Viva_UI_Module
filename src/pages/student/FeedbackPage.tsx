// src/pages/student/FeedbackPage.tsx
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ThumbsUp, TrendingUp, BookMarked, ChevronDown, ChevronUp,
  Star, InboxIcon, ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/common/PageHeader"
import { mockFeedback, mockResultData } from "@/services/mockData"
import { useState } from "react"

const hasFeedback =
  mockFeedback.strengths.length > 0 ||
  mockFeedback.improvements.length > 0 ||
  mockFeedback.recommendations.length > 0 ||
  mockFeedback.topicFeedback.length > 0

export function FeedbackPage() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<number | null>(null)

  if (!hasFeedback) {
    return (
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Personalized Feedback"
          breadcrumbs={[
            { label: "Dashboard", href: "/student/dashboard" },
            { label: "Results", href: "/student/results" },
            { label: "Feedback" },
          ]}
        />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <InboxIcon className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">No Feedback Available</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
            Personalised feedback will appear here after your viva examination is evaluated.
          </p>
          <Button onClick={() => navigate("/student/instructions")}>
            Take a Viva <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  const subjectLine = [mockResultData.subject, mockResultData.date].filter(Boolean).join(" · ")

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Personalized Feedback"
        description={subjectLine || undefined}
        breadcrumbs={[
          { label: "Dashboard", href: "/student/dashboard" },
          { label: "Results", href: "/student/results" },
          { label: "Feedback" },
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate("/student/results")}>
            View Full Results
          </Button>
        }
      />

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        {/* Strengths */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="h-full border-green-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                <ThumbsUp className="w-4 h-4" /> Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {mockFeedback.strengths.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No strengths recorded.</p>
              ) : mockFeedback.strengths.map((s, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <Star className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 leading-relaxed text-xs">{s}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Areas of Improvement */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full border-amber-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-amber-700">
                <TrendingUp className="w-4 h-4" /> Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {mockFeedback.improvements.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No improvement areas recorded.</p>
              ) : mockFeedback.improvements.map((s, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 leading-relaxed text-xs">{s}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full border-blue-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                <BookMarked className="w-4 h-4" /> Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {mockFeedback.recommendations.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No recommendations yet.</p>
              ) : mockFeedback.recommendations.map((s, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <span className="text-xs text-blue-600 font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>
                  <span className="text-slate-700 leading-relaxed text-xs">{s}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Topic-wise feedback */}
      {mockFeedback.topicFeedback.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Topic-wise Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockFeedback.topicFeedback.map((topic, i) => (
              <motion.div
                key={topic.topic}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">{topic.topic}</span>
                    <Badge
                      variant={topic.score >= 80 ? "success" : topic.score >= 60 ? "info" : "warning"}
                      className="text-xs flex-shrink-0"
                    >
                      {topic.score}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 hidden sm:block">
                      <Progress value={topic.score} className="h-1.5" />
                    </div>
                    {expanded === i
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
                {expanded === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-4 pb-4 border-t bg-slate-50"
                  >
                    <p className="text-sm text-slate-700 mt-3 leading-relaxed">{topic.comment}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={() => navigate("/student/dashboard")} className="flex-1">
          Back to Dashboard
        </Button>
        <Button onClick={() => navigate("/student/instructions")} className="flex-1">
          Start New Viva
        </Button>
      </div>
    </div>
  )
}
