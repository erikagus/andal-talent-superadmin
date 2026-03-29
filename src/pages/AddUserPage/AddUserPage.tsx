import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'design-system'
import { ArrowLeft } from '@phosphor-icons/react'
import { Navbar } from '../../components'
import { addEmployee } from '../../mock/data'
import type { Role, ToolkitItem } from '../../mock/data'
import './AddUserPage.css'

const INITIAL_TOOLKIT: ToolkitItem[] = [
  { id: 'nda',        label: 'Sign NDA',                   checked: false },
  { id: 'handbook',   label: 'Read Employee Handbook',     checked: false },
  { id: 'it_setup',   label: 'IT Setup (laptop + access)', checked: false },
  { id: 'hr_docs',    label: 'Submit HR Documents',        checked: false },
  { id: 'intro',      label: 'Team Introduction Meeting',  checked: false },
]

export default function AddUserPage() {
  const navigate = useNavigate()
  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')
  const [position,   setPosition]   = useState('')
  const [department, setDepartment] = useState('')
  const [joinDate,   setJoinDate]   = useState(new Date().toISOString().split('T')[0])
  const [role,       setRole]       = useState<Role>('new_employee')
  const [toolkit,    setToolkit]    = useState<ToolkitItem[]>(INITIAL_TOOLKIT)
  const [error,      setError]      = useState('')

  function toggleToolkit(id: string) {
    setToolkit(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !position.trim() || !department.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    addEmployee({ name, email, position, department, joinDate, role, toolkit })
    navigate('/employees')
  }

  return (
    <div className="add-user-page">
      <Navbar />
      <main className="add-user-page__main page-content">
        <div className="add-user-page__header">
          <button className="add-user-page__back" onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="add-user-page__heading">Add Employee</h1>
            <p className="add-user-page__sub">Create a new employee account</p>
          </div>
        </div>

        <form className="add-user-form" onSubmit={handleSubmit} noValidate>
          <div className="add-user-form__card">
            <h2 className="add-user-form__section-title">Personal Information</h2>
            <div className="add-user-form__grid">
              <div className="add-user-form__field">
                <label className="add-user-form__label">Full Name <span aria-hidden="true">*</span></label>
                <input className="add-user-form__input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Doe" required />
              </div>
              <div className="add-user-form__field">
                <label className="add-user-form__label">Email <span aria-hidden="true">*</span></label>
                <input className="add-user-form__input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. john@andal.com" required />
              </div>
              <div className="add-user-form__field">
                <label className="add-user-form__label">Position <span aria-hidden="true">*</span></label>
                <input className="add-user-form__input" value={position} onChange={e => setPosition(e.target.value)} placeholder="e.g. Software Engineer" required />
              </div>
              <div className="add-user-form__field">
                <label className="add-user-form__label">Department <span aria-hidden="true">*</span></label>
                <input className="add-user-form__input" value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. Engineering" required />
              </div>
              <div className="add-user-form__field">
                <label className="add-user-form__label">Join Date</label>
                <input className="add-user-form__input" type="date" value={joinDate} onChange={e => setJoinDate(e.target.value)} />
              </div>
              <div className="add-user-form__field">
                <label className="add-user-form__label">Role</label>
                <select className="add-user-form__input add-user-form__select" value={role} onChange={e => setRole(e.target.value as Role)}>
                  <option value="new_employee">New Employee (Onboarding)</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="add-user-form__card">
            <h2 className="add-user-form__section-title">Onboarding Toolkit</h2>
            <p className="add-user-form__section-sub">Select which onboarding tasks apply to this employee</p>
            <div className="add-user-form__toolkit">
              {toolkit.map(item => (
                <label key={item.id} className="toolkit-item">
                  <input
                    type="checkbox"
                    className="toolkit-item__checkbox"
                    checked={item.checked}
                    onChange={() => toggleToolkit(item.id)}
                  />
                  <span className="toolkit-item__label">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="add-user-form__error" role="alert">{error}</p>}

          <div className="add-user-form__actions">
            <Button variant="Outline" size="Medium" color="Primary" type="button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button variant="Solid" size="Medium" color="Primary" type="submit">
              Add Employee
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
