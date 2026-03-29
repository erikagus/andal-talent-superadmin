import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'design-system'
import { ArrowLeft, Trash } from '@phosphor-icons/react'
import { Navbar } from '../../components'
import { getEmployee, updateEmployee, deleteEmployee } from '../../mock/data'
import type { Role, ToolkitItem } from '../../mock/data'
import './EditUserPage.css'

export default function EditUserPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const emp = getEmployee(Number(id))

  const [name,       setName]       = useState(emp?.name ?? '')
  const [email,      setEmail]      = useState(emp?.email ?? '')
  const [position,   setPosition]   = useState(emp?.position ?? '')
  const [department, setDepartment] = useState(emp?.department ?? '')
  const [joinDate,   setJoinDate]   = useState(emp?.joinDate ?? '')
  const [role,       setRole]       = useState<Role>(emp?.role ?? 'employee')
  const [toolkit,    setToolkit]    = useState<ToolkitItem[]>(emp?.toolkit ?? [])
  const [error,      setError]      = useState('')

  if (!emp) {
    return (
      <div className="edit-user-page">
        <Navbar />
        <main className="edit-user-page__main page-content">
          <p>Employee not found.</p>
          <Button variant="Outline" size="Medium" color="Primary" onClick={() => navigate('/employees')}>
            Back to Employees
          </Button>
        </main>
      </div>
    )
  }

  function toggleToolkit(id: string) {
    setToolkit(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !position.trim() || !department.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    updateEmployee(emp!.id, { name, email, position, department, joinDate, role, toolkit })
    navigate('/employees')
  }

  function handleDelete() {
    if (!confirm(`Delete ${emp!.name}? This cannot be undone.`)) return
    deleteEmployee(emp!.id)
    navigate('/employees')
  }

  const done  = toolkit.filter(t => t.checked).length
  const total = toolkit.length
  const pct   = Math.round((done / total) * 100)

  return (
    <div className="edit-user-page">
      <Navbar />
      <main className="edit-user-page__main page-content">
        <div className="edit-user-page__header">
          <button className="edit-user-page__back" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <div className="edit-user-page__title-wrap">
            <h1 className="edit-user-page__heading">Edit Employee</h1>
            <p className="edit-user-page__sub">{emp.name} · {emp.email}</p>
          </div>
          <button className="edit-user-page__delete" onClick={handleDelete} aria-label="Delete employee">
            <Trash size={18} />
            Delete
          </button>
        </div>

        {/* Onboarding progress summary */}
        {emp.role === 'new_employee' && (
          <div className="edit-user-page__progress-banner">
            <span className="edit-user-page__progress-label">Onboarding Progress</span>
            <div className="edit-user-page__progress-bar">
              <div className="edit-user-page__progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="edit-user-page__progress-pct">{done}/{total} tasks ({pct}%)</span>
          </div>
        )}

        <form className="edit-user-form" onSubmit={handleSubmit} noValidate>
          <div className="edit-user-form__card">
            <h2 className="edit-user-form__section-title">Personal Information</h2>
            <div className="edit-user-form__grid">
              <div className="edit-user-form__field">
                <label className="edit-user-form__label">Full Name <span aria-hidden="true">*</span></label>
                <input className="edit-user-form__input" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="edit-user-form__field">
                <label className="edit-user-form__label">Email <span aria-hidden="true">*</span></label>
                <input className="edit-user-form__input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="edit-user-form__field">
                <label className="edit-user-form__label">Position <span aria-hidden="true">*</span></label>
                <input className="edit-user-form__input" value={position} onChange={e => setPosition(e.target.value)} required />
              </div>
              <div className="edit-user-form__field">
                <label className="edit-user-form__label">Department <span aria-hidden="true">*</span></label>
                <input className="edit-user-form__input" value={department} onChange={e => setDepartment(e.target.value)} required />
              </div>
              <div className="edit-user-form__field">
                <label className="edit-user-form__label">Join Date</label>
                <input className="edit-user-form__input" type="date" value={joinDate} onChange={e => setJoinDate(e.target.value)} />
              </div>
              <div className="edit-user-form__field">
                <label className="edit-user-form__label">Role</label>
                <select className="edit-user-form__input edit-user-form__select" value={role} onChange={e => setRole(e.target.value as Role)}>
                  <option value="new_employee">New Employee (Onboarding)</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="edit-user-form__card">
            <h2 className="edit-user-form__section-title">Onboarding Toolkit</h2>
            <div className="edit-user-form__toolkit">
              {toolkit.map(item => (
                <label key={item.id} className="toolkit-item">
                  <input
                    type="checkbox"
                    className="toolkit-item__checkbox"
                    checked={item.checked}
                    onChange={() => toggleToolkit(item.id)}
                  />
                  <span className={`toolkit-item__label ${item.checked ? 'toolkit-item__label--done' : ''}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="edit-user-form__error" role="alert">{error}</p>}

          <div className="edit-user-form__actions">
            <Button variant="Outline" size="Medium" color="Primary" type="button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button variant="Solid" size="Medium" color="Primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
