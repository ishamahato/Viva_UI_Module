// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { LandingPage } from "@/pages/LandingPage"
import { AuthLayout } from "@/layouts/AuthLayout"
import { StudentLayout } from "@/layouts/StudentLayout"
import { FacultyLayout } from "@/layouts/FacultyLayout"
import { AdminLayout } from "@/layouts/AdminLayout"

// Student pages
import { StudentLogin } from "@/pages/student/StudentLogin"
import { StudentRegister } from "@/pages/student/StudentRegister"
import { VivaInstructions } from "@/pages/student/VivaInstructions"
import { StudentDashboard } from "@/pages/student/StudentDashboard"
import { VivaExamination } from "@/pages/student/VivaExamination"
import { VivaCompletion } from "@/pages/student/VivaCompletion"
import { ResultDashboard } from "@/pages/student/ResultDashboard"
import { FeedbackPage } from "@/pages/student/FeedbackPage"

// Faculty pages
import { FacultyLogin } from "@/pages/faculty/FacultyLogin"
import { FacultyRegister } from "@/pages/faculty/FacultyRegister"
import { FacultyDashboard } from "@/pages/faculty/FacultyDashboard"
import { QuestionBank } from "@/pages/faculty/QuestionBank"
import { LiveMonitoring } from "@/pages/faculty/LiveMonitoring"
import { AnalyticsDashboard } from "@/pages/faculty/AnalyticsDashboard"
import { ReportsPage } from "@/pages/faculty/ReportsPage"

// Admin pages
import { AdminLogin } from "@/pages/admin/AdminLogin"
import { AdminDashboard } from "@/pages/admin/AdminDashboard"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/faculty/login" element={<FacultyLogin />} />
          <Route path="/faculty/register" element={<FacultyRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        {/* Student portal */}
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/instructions" element={<VivaInstructions />} />
          <Route path="/student/viva" element={<VivaExamination />} />
          <Route path="/student/completion" element={<VivaCompletion />} />
          <Route path="/student/results" element={<ResultDashboard />} />
          <Route path="/student/feedback" element={<FeedbackPage />} />
        </Route>

        {/* Faculty portal */}
        <Route element={<FacultyLayout />}>
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/questions" element={<QuestionBank />} />
          <Route path="/faculty/monitoring" element={<LiveMonitoring />} />
          <Route path="/faculty/analytics" element={<AnalyticsDashboard />} />
          <Route path="/faculty/reports" element={<ReportsPage />} />
        </Route>

        {/* Admin portal */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* Reusing some placeholders for links in sidebar */}
          <Route path="/admin/faculty" element={<div className="p-6">Faculty Records Management</div>} />
          <Route path="/admin/students" element={<div className="p-6">Student Records Management</div>} />
          <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
