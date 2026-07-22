import React, { createContext, useContext, useState, useEffect } from "react"

export type Role = "student" | "faculty" | "admin" | null

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  department: string
  // student specific
  rollNumber?: string
  semester?: string
  gpa?: number
  // faculty specific
  employeeId?: string
  designation?: string
  coursesManaged?: number
}

interface AuthContextType {
  user: AuthUser | null
  role: Role
  login: (email: string, role: Role) => boolean
  logout: () => void
  register: (data: any, role: Role) => void
  updateUser: (data: Partial<AuthUser>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [role, setRole] = useState<Role>(null)

  // Load active session on mount
  useEffect(() => {
    const session = localStorage.getItem("viva_session")
    if (session) {
      try {
        const parsed = JSON.parse(session)
        setUser(parsed)
        setRole(parsed.role)
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  function login(email: string, targetRole: Role) {
    const usersStr = localStorage.getItem("viva_users")
    if (!usersStr) return false
    
    try {
      const users: AuthUser[] = JSON.parse(usersStr)
      const found = users.find(u => u.email === email && u.role === targetRole)
      if (found) {
        setUser(found)
        setRole(found.role)
        localStorage.setItem("viva_session", JSON.stringify(found))
        return true
      }
    } catch (e) {
      console.error(e)
    }
    return false
  }

  function logout() {
    setUser(null)
    setRole(null)
    localStorage.removeItem("viva_session")
  }

  function register(data: any, targetRole: Role) {
    const usersStr = localStorage.getItem("viva_users")
    let users: AuthUser[] = []
    if (usersStr) {
      try {
        users = JSON.parse(usersStr)
      } catch (e) {}
    }

    const newUser: AuthUser = {
      id: `${targetRole}-${Date.now()}`,
      name: data.fullName,
      email: data.email,
      role: targetRole,
      department: data.department,
      ...(targetRole === "student" ? {
        rollNumber: data.rollNumber,
        semester: data.semester,
        gpa: 0,
      } : {
        employeeId: data.employeeId,
        designation: data.designation,
        coursesManaged: 0,
      })
    }

    // Replace if exists, else push
    const existingIdx = users.findIndex(u => u.email === newUser.email)
    if (existingIdx >= 0) {
      users[existingIdx] = newUser
    } else {
      users.push(newUser)
    }

    localStorage.setItem("viva_users", JSON.stringify(users))
  }

  function updateUser(data: Partial<AuthUser>) {
    if (!user) return
    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem("viva_session", JSON.stringify(updatedUser))

    const usersStr = localStorage.getItem("viva_users")
    if (usersStr) {
      try {
        const users: AuthUser[] = JSON.parse(usersStr)
        const existingIdx = users.findIndex(u => u.id === user.id)
        if (existingIdx >= 0) {
          users[existingIdx] = updatedUser
          localStorage.setItem("viva_users", JSON.stringify(users))
        }
      } catch (e) {}
    }
  }

  return (
    <AuthContext.Provider value={{ user, role, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
