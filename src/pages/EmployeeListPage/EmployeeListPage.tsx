import { useRef, useState, useEffect } from 'react'
import { Button } from 'design-system'
import { MagnifyingGlass, PencilSimple, Trash, User, X, Warning } from '@phosphor-icons/react'
import { Navbar } from '../../components'
import { supabase } from '../../lib/supabase'
import type { Employee } from '../../mock/data'
import './EmployeeListPage.css'

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

// ── Employee Modal ────────────────────────────────────────────────────────────

interface ModalProps {
  mode: 'add' | 'edit'
  initial?: Employee
  onClose: () => void
  onSaved: () => void
}

function EmployeeModal({ mode, initial, onClose, onSaved }: ModalProps) {
  const [name,     setName]     = useState(initial?.name         ?? '')
  const [position, setPosition] = useState(initial?.job_position ?? '')
  const [email,    setEmail]    = useState(initial?.email        ?? '')
  const [password, setPassword] = useState(initial?.password     ?? '')
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(initial?.avatar_url)
  const [photoFile,    setPhotoFile]    = useState<File | null>(null)
  const [saving,       setSaving]       = useState(false)
  const [error,        setError]        = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function uploadPhoto(file: File): Promise<string | null> {
    const ext  = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('Avatar').upload(path, file, { upsert: true })
    if (error) { console.error('Photo upload error:', error); return null }
    const { data } = supabase.storage.from('Avatar').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !position.trim() || !email.trim() || !password.trim()) {
      setError('Full Name, Job Position, Email and Password are required.')
      return
    }
    setSaving(true)

    // Upload new photo file if one was selected; otherwise keep existing URL
    let avatarUrl: string | null = photoFile ? null : (photoPreview ?? null)
    if (photoFile) {
      avatarUrl = await uploadPhoto(photoFile)
    }

    if (mode === 'add') {
      await supabase.from('users').insert({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        job_position: position.trim(),
        avatar_url: avatarUrl,
        role: 'new_employee',
        onboarding_done: false,
      })
    } else if (initial) {
      await supabase
        .from('users')
        .update({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          job_position: position.trim(),
          avatar_url: avatarUrl,
        })
        .eq('id', initial.id)
    }
    setSaving(false)
    onSaved()
  }

  return (
    <div className="emp-modal-backdrop" onMouseDown={onClose}>
      <div className="emp-modal" onMouseDown={e => e.stopPropagation()} role="dialog" aria-modal="true">

        <div className="emp-modal__header">
          <h2 className="emp-modal__title">
            {mode === 'add' ? 'Add Employee' : 'Edit Employee'}
          </h2>
          <button className="emp-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="emp-modal__body">

            {/* Photo */}
            <div className="emp-modal__photo-row">
              <div className="emp-modal__photo-preview">
                {photoPreview
                  ? <img src={photoPreview} alt="Preview" className="emp-modal__photo-img" />
                  : <User size={26} weight="light" />
                }
              </div>
              <div className="emp-modal__photo-actions">
                <Button variant="Outline" size="Medium" color="Primary" type="button"
                  onClick={() => fileRef.current?.click()}>
                  {photoPreview ? 'Change Photo' : 'Upload Photo'}
                </Button>
                {photoPreview && (
                  <button type="button" className="emp-modal__photo-remove"
                    onClick={() => { setPhotoPreview(undefined); setPhotoFile(null); if (fileRef.current) fileRef.current.value = '' }}>
                    Remove
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="emp-modal__photo-input"
                  onChange={handlePhotoChange} />
              </div>
            </div>

            {/* Fields */}
            <div className="emp-modal__grid">
              <div className="emp-modal__field">
                <label className="emp-modal__label">Full Name <span className="emp-modal__req">*</span></label>
                <input className="emp-modal__input" value={name}
                  onChange={e => setName(e.target.value)} placeholder="e.g. John Doe" />
              </div>
              <div className="emp-modal__field">
                <label className="emp-modal__label">Job Position <span className="emp-modal__req">*</span></label>
                <input className="emp-modal__input" value={position}
                  onChange={e => setPosition(e.target.value)} placeholder="e.g. Software Engineer" />
              </div>
              <div className="emp-modal__field">
                <label className="emp-modal__label">Email <span className="emp-modal__req">*</span></label>
                <input className="emp-modal__input" type="email" value={email}
                  onChange={e => setEmail(e.target.value)} placeholder="e.g. john@andal.com" />
              </div>
              <div className="emp-modal__field">
                <label className="emp-modal__label">Password <span className="emp-modal__req">*</span></label>
                <input className="emp-modal__input" type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'edit' ? 'Leave blank to keep current' : 'Set initial password'} />
              </div>
            </div>

            {error && <p className="emp-modal__error" role="alert">{error}</p>}
          </div>

          <div className="emp-modal__footer">
            <Button variant="Outline" size="Medium" color="Primary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="Solid" size="Medium" color="Primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : (mode === 'add' ? 'Add Employee' : 'Save Changes')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Delete Confirm Dialog ─────────────────────────────────────────────────────

interface DeleteDialogProps {
  name: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteDialog({ name, onConfirm, onCancel }: DeleteDialogProps) {
  return (
    <div className="emp-modal-backdrop" onMouseDown={onCancel}>
      <div className="emp-confirm" onMouseDown={e => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <div className="emp-confirm__icon-wrap">
          <Warning size={28} weight="fill" className="emp-confirm__icon" />
        </div>
        <h3 className="emp-confirm__title">Delete Employee</h3>
        <p className="emp-confirm__body">
          Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
        </p>
        <div className="emp-confirm__actions">
          <Button variant="Outline" size="Medium" color="Primary" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="Solid" size="Medium" color="Error" type="button" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type ModalState =
  | { type: 'closed' }
  | { type: 'add' }
  | { type: 'edit'; emp: Employee }
  | { type: 'delete'; emp: Employee }

export default function EmployeeListPage() {
  const [search, setSearch] = useState('')
  const [list,   setList]   = useState<Employee[]>([])
  const [modal,  setModal]  = useState<ModalState>({ type: 'closed' })

  async function fetchEmployees() {
    const { data } = await supabase
      .from('users')
      .select('id, name, email, password, role, job_position, avatar_url, onboarding_done')
      .neq('role', 'superadmin')
      .order('created_at')
    setList((data ?? []) as Employee[])
  }

  useEffect(() => { fetchEmployees() }, [])

  const filtered = list.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  )

  const total  = list.length
  const active = list.filter(e => e.role === 'employee').length

  async function handleDelete(emp: Employee) {
    await supabase.from('users').delete().eq('id', emp.id)
    setModal({ type: 'closed' })
    fetchEmployees()
  }

  async function handleSaved() {
    setModal({ type: 'closed' })
    fetchEmployees()
  }

  const STATS = [
    { label: 'Total Users',      value: total,  color: 'brand'   },
    { label: 'Active Employees', value: active, color: 'success' },
  ]

  return (
    <div className="emp-page">
      <Navbar />
      <main className="emp-page__main page-content">

        <div className="emp-page__header">
          <h1 className="emp-page__heading">Employees</h1>
          <Button variant="Solid" size="Medium" color="Primary"
            onClick={() => setModal({ type: 'add' })}>
            Add Employee
          </Button>
        </div>

        <div className="emp-page__stats">
          {STATS.map(({ label, value, color }) => (
            <div key={label} className={`stat-card stat-card--${color}`}>
              <span className="stat-card__value">{value}</span>
              <span className="stat-card__label">{label}</span>
            </div>
          ))}
        </div>

        <div className="emp-page__search-wrap">
          <MagnifyingGlass size={16} className="emp-page__search-icon" />
          <input
            className="emp-page__search"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="emp-table-wrap">
          <table className="emp-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="emp-table__empty">No employees found</td></tr>
              )}
              {filtered.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div className="emp-table__person">
                      {emp.avatar_url
                        ? <img src={emp.avatar_url} alt={emp.name} className="emp-table__avatar emp-table__avatar--img" />
                        : <div className="emp-table__avatar">{initials(emp.name)}</div>
                      }
                      <div>
                        <div className="emp-table__name">{emp.name}</div>
                        {emp.job_position && <div className="emp-table__position">{emp.job_position}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="emp-table__cell">{emp.email}</td>
                  <td className="emp-table__cell" style={{ textTransform: 'capitalize' }}>
                    {emp.role.replace('_', ' ')}
                  </td>
                  <td>
                    {emp.role === 'admin' && (
                      <span className="emp-badge emp-badge--admin">Admin</span>
                    )}
                    {emp.role === 'employee' && emp.onboarding_done && (
                      <span className="emp-badge emp-badge--active">Employee</span>
                    )}
                    {emp.role === 'new_employee' && !emp.onboarding_done && (
                      <span className="emp-badge emp-badge--onboarding">New Employee</span>
                    )}
                  </td>
                  <td>
                    <div className="emp-table__actions">
                      <button className="emp-table__btn" aria-label="Edit"
                        onClick={() => setModal({ type: 'edit', emp })}>
                        <PencilSimple size={15} />
                      </button>
                      <button className="emp-table__btn emp-table__btn--del" aria-label="Delete"
                        onClick={() => setModal({ type: 'delete', emp })}>
                        <Trash size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {modal.type === 'add' && (
        <EmployeeModal mode="add" onClose={() => setModal({ type: 'closed' })} onSaved={handleSaved} />
      )}
      {modal.type === 'edit' && (
        <EmployeeModal mode="edit" initial={modal.emp} onClose={() => setModal({ type: 'closed' })} onSaved={handleSaved} />
      )}
      {modal.type === 'delete' && (
        <DeleteDialog
          name={modal.emp.name}
          onConfirm={() => handleDelete(modal.emp)}
          onCancel={() => setModal({ type: 'closed' })}
        />
      )}
    </div>
  )
}
