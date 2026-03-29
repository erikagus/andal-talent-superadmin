import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'design-system'
import { ArrowLeft } from '@phosphor-icons/react'
import { Navbar } from '../../components'
import { addEmployee, DEFAULT_TOOLKIT } from '../../mock/data'
import type { ToolkitItem } from '../../mock/data'
import './AddEmployeePage.css'

export default function AddEmployeePage() {
  const navigate = useNavigate()
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [toolkit,  setToolkit]  = useState<ToolkitItem[]>(
    DEFAULT_TOOLKIT.map(t => ({ ...t }))
  )
  const [error, setError] = useState('')

  function toggle(id: string) {
    setToolkit(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Name, email and password are required.')
      return
    }
    addEmployee({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role: 'new_employee',
      onboardingDone: false,
      toolkit,
    })
    navigate('/')
  }

  const allChecked = toolkit.every(t => t.checked)

  return (
    <div className="add-emp-page">
      <Navbar />
      <main className="add-emp-page__main page-content">
        <div className="add-emp-page__header">
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="add-emp-page__heading">Add Employee</h1>
            <p className="add-emp-page__sub">New accounts start as New Employee (Onboarding)</p>
          </div>
        </div>

        <form className="emp-form" onSubmit={handleSubmit} noValidate>
          <div className="emp-form__card">
            <h2 className="emp-form__card-title">Account Details</h2>
            <div className="emp-form__grid">
              <div className="emp-form__field">
                <label className="emp-form__label">Full Name <span className="emp-form__req">*</span></label>
                <input className="emp-form__input" value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. John Doe" />
              </div>
              <div className="emp-form__field">
                <label className="emp-form__label">Email <span className="emp-form__req">*</span></label>
                <input className="emp-form__input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. john@andal.com" />
              </div>
              <div className="emp-form__field emp-form__field--full">
                <label className="emp-form__label">Password <span className="emp-form__req">*</span></label>
                <input className="emp-form__input" type="password" value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Set initial password" />
              </div>
            </div>
          </div>

          <div className="emp-form__card">
            <div className="emp-form__card-header">
              <h2 className="emp-form__card-title">Onboarding Toolkit</h2>
              {allChecked && (
                <span className="emp-form__auto-badge">Will be promoted to Employee on save</span>
              )}
            </div>
            <p className="emp-form__card-sub">Check items that are already completed</p>
            <div className="emp-form__toolkit">
              {toolkit.map(item => (
                <label key={item.id} className="toolkit-row">
                  <input type="checkbox" className="toolkit-row__check"
                    checked={item.checked} onChange={() => toggle(item.id)} />
                  <span className={`toolkit-row__label ${item.checked ? 'toolkit-row__label--done' : ''}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="emp-form__error" role="alert">{error}</p>}

          <div className="emp-form__actions">
            <Button variant="Outline" size="Medium" color="Primary" type="button"
              onClick={() => navigate(-1)}>Cancel</Button>
            <Button variant="Solid" size="Medium" color="Primary" type="submit">
              Add Employee
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
