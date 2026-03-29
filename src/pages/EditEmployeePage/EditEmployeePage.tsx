import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'design-system'
import { ArrowLeft, Trash } from '@phosphor-icons/react'
import { Navbar } from '../../components'
import { getById, updateEmployee, deleteEmployee } from '../../mock/data'
import type { Role, ToolkitItem } from '../../mock/data'
import './EditEmployeePage.css'

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function EditEmployeePage() {
  const navigate = useNavigate()
  const { id }   = useParams<{ id: string }>()
  const emp      = getById(Number(id))

  const [name,     setName]     = useState(emp?.name     ?? '')
  const [email,    setEmail]    = useState(emp?.email    ?? '')
  const [password, setPassword] = useState(emp?.password ?? '')
  const [role,     setRole]     = useState<Role>(emp?.role ?? 'new_employee')
  const [toolkit,  setToolkit]  = useState<ToolkitItem[]>(emp?.toolkit ?? [])
  const [error,    setError]    = useState('')

  if (!emp) {
    return (
      <div className="edit-emp-page">
        <Navbar />
        <main className="edit-emp-page__main page-content">
          <p>Employee not found.</p>
          <Button variant="Outline" size="Medium" color="Primary" onClick={() => navigate('/')}>Back</Button>
        </main>
      </div>
    )
  }

  function toggle(tkId: string) {
    setToolkit(prev => prev.map(t => t.id === tkId ? { ...t, checked: !t.checked } : t))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.')
      return
    }
    updateEmployee(emp.id, { name: name.trim(), email: email.trim(), password: password.trim(), role, toolkit })
    navigate('/')
  }

  function handleDelete() {
    if (!confirm(`Delete ${emp.name}? This cannot be undone.`)) return
    deleteEmployee(emp.id)
    navigate('/')
  }

  const done  = toolkit.filter(t => t.checked).length
  const total = toolkit.length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0
  const allChecked = toolkit.every(t => t.checked)

  return (
    <div className="edit-emp-page">
      <Navbar />
      <main className="edit-emp-page__main page-content">

        {/* Header */}
        <div className="edit-emp-page__header">
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <div className="edit-emp-page__title-group">
            <h1 className="edit-emp-page__heading">Edit Employee</h1>
            <p className="edit-emp-page__sub">{emp.email}</p>
          </div>
          <button className="edit-emp-page__del-btn" onClick={handleDelete}>
            <Trash size={16} />
            Delete
          </button>
        </div>

        {/* Onboarding banner */}
        <div className="edit-emp-page__banner">
          <div className="edit-emp-page__banner-left">
            <div className="edit-emp-page__banner-avatar">{initials(emp.name)}</div>
            <div>
              <p className="edit-emp-page__banner-name">{emp.name}</p>
              <span className={`emp-badge emp-badge--${emp.role === 'employee' ? 'active' : 'onboarding'}`}>
                {emp.role === 'employee' ? 'Employee' : 'New Employee'}
              </span>
            </div>
          </div>
          <div className="edit-emp-page__banner-progress">
            <span className="edit-emp-page__progress-label">Onboarding Progress</span>
            <div className="edit-emp-page__progress-bar">
              <div className="edit-emp-page__progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="edit-emp-page__progress-pct">{done}/{total} · {pct}%</span>
          </div>
        </div>

        <form className="emp-form" onSubmit={handleSubmit} noValidate>
          <div className="emp-form__card">
            <h2 className="emp-form__card-title">Account Details</h2>
            <div className="emp-form__grid">
              <div className="emp-form__field">
                <label className="emp-form__label">Full Name <span className="emp-form__req">*</span></label>
                <input className="emp-form__input" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="emp-form__field">
                <label className="emp-form__label">Email <span className="emp-form__req">*</span></label>
                <input className="emp-form__input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="emp-form__field">
                <label className="emp-form__label">Password</label>
                <input className="emp-form__input" type="password" value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep current" />
              </div>
              <div className="emp-form__field">
                <label className="emp-form__label">Role</label>
                <select className="emp-form__input emp-form__select" value={role}
                  onChange={e => setRole(e.target.value as Role)}>
                  <option value="new_employee">New Employee (Onboarding)</option>
                  <option value="employee">Employee</option>
                </select>
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
              Save Changes
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
