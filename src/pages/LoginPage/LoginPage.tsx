import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from 'design-system'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import { useAuth } from '../../context/AuthContext'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const ok = login(email.trim(), password)
    if (ok) navigate('/')
    else setError('Invalid credentials. Use superadmin@andal.com / superadmin123')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__brand">
          <img src="/src/assets/logo-company.png" alt="PT Nusantara Teknologi Digital" className="login-card__logo" />
          <h1 className="login-card__title">Super Admin Portal</h1>
          <p className="login-card__subtitle">PT Nusantara Teknologi Digital</p>
        </div>

        <form className="login-card__form" onSubmit={handleSubmit} noValidate>
          <TextField
            labelText="Email"
            placeholder="Enter your email"
            type="email"
            size="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mandatory
          />
          <div className="login-card__pw-wrap">
            <TextField
              labelText="Password"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              size="md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              mandatory
            />
            <button
              type="button"
              className="login-card__pw-toggle"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="login-card__error" role="alert">{error}</p>}

          <Button variant="Solid" size="Medium" color="Primary" type="submit">
            Sign In
          </Button>
        </form>

        <p className="login-card__hint">
          superadmin@andal.com / superadmin123
        </p>
      </div>
    </div>
  )
}
