import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'design-system'
import { MagnifyingGlass, PencilSimple, Trash } from '@phosphor-icons/react'
import { Navbar } from '../../components'
import { getAll, deleteEmployee, type Employee } from '../../mock/data'
import './EmployeeListPage.css'

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function EmployeeListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [list,   setList]   = useState<Employee[]>(getAll)

  const filtered = list.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  )

  const total      = list.length
  const active     = list.filter(e => e.role === 'employee').length
  const onboarding = list.filter(e => e.role === 'new_employee').length

  function handleDelete(id: number) {
    if (!confirm('Delete this employee?')) return
    deleteEmployee(id)
    setList(getAll())
  }

  const STATS = [
    { label: 'Total Users',      value: total,      color: 'brand'   },
    { label: 'Active Employees', value: active,     color: 'success' },
    { label: 'Onboarding',       value: onboarding, color: 'warning' },
  ]

  return (
    <div className="emp-page">
      <Navbar />
      <main className="emp-page__main page-content">

        {/* Header */}
        <div className="emp-page__header">
          <h1 className="emp-page__heading">Employees</h1>
          <Button variant="Solid" size="Medium" color="Primary"
            onClick={() => navigate('/employees/add')}>
            Add Employee
          </Button>
        </div>

        {/* Stats */}
        <div className="emp-page__stats">
          {STATS.map(({ label, value, color }) => (
            <div key={label} className={`stat-card stat-card--${color}`}>
              <span className="stat-card__value">{value}</span>
              <span className="stat-card__label">{label}</span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="emp-page__search-wrap">
          <MagnifyingGlass size={16} className="emp-page__search-icon" />
          <input
            className="emp-page__search"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="emp-table-wrap">
          <table className="emp-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Onboarding</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="emp-table__empty">No employees found</td></tr>
              )}
              {filtered.map(emp => {
                const done  = emp.toolkit.filter(t => t.checked).length
                const total = emp.toolkit.length
                const pct   = total > 0 ? Math.round((done / total) * 100) : 0
                return (
                  <tr key={emp.id}>
                    <td>
                      <div className="emp-table__person">
                        <div className="emp-table__avatar">{initials(emp.name)}</div>
                        <span className="emp-table__name">{emp.name}</span>
                      </div>
                    </td>
                    <td className="emp-table__cell">{emp.email}</td>
                    <td className="emp-table__cell" style={{ textTransform: 'capitalize' }}>
                      {emp.role.replace('_', ' ')}
                    </td>
                    <td>
                      <span className={`emp-badge emp-badge--${emp.role === 'employee' ? 'active' : 'onboarding'}`}>
                        {emp.role === 'employee' ? 'Employee' : 'New Employee'}
                      </span>
                    </td>
                    <td>
                      <div className="emp-table__progress">
                        <div className="emp-table__bar">
                          <div className="emp-table__bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="emp-table__pct">{pct}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="emp-table__actions">
                        <button
                          className="emp-table__btn"
                          onClick={() => navigate(`/employees/edit/${emp.id}`)}
                          aria-label="Edit"
                        ><PencilSimple size={15} /></button>
                        <button
                          className="emp-table__btn emp-table__btn--del"
                          onClick={() => handleDelete(emp.id)}
                          aria-label="Delete"
                        ><Trash size={15} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
