import { createContext, useContext, useState } from 'react'
import { supabase } from '../lib/supabase'

interface SuperAdmin { id: string; email: string; name: string }

interface AuthContextValue {
  currentUser: SuperAdmin | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<SuperAdmin | null>(null)

  async function login(email: string, password: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('email', email)
      .eq('password', password)
      .eq('role', 'superadmin')
      .single()
    if (error || !data) return false
    setCurrentUser({ id: data.id, name: data.name, email: data.email })
    return true
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
