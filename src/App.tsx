import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import 'design-system/styles/tokens.css'
import 'design-system/styles/themes.css'
import 'design-system/styles/global.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage/LoginPage'
import EmployeeListPage from './pages/EmployeeListPage/EmployeeListPage'

function PrivateRoute({ element }: { element: React.ReactElement }) {
  const { currentUser } = useAuth()
  return currentUser ? element : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { currentUser } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/"      element={<PrivateRoute element={<EmployeeListPage />} />} />
      <Route path="*"      element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
