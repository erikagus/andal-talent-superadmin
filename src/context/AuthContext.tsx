import { createContext, useContext, useState } from 'react'

interface SuperAdmin { email: string; name: string }
interface AuthContextValue {
  currentUser: SuperAdmin | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const CREDS = { email: 'superadmin@andal.com', password: 'superadmin123', name: 'Super Admin' }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<SuperAdmin | null>(null)

  function login(email: string, password: string) {
    if (email === CREDS.email && password === CREDS.password) {
      setCurrentUser({ email: CREDS.email, name: CREDS.name })
      return true
    }
    return false
  }

  function logout() { setCurrentUser(null) }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
