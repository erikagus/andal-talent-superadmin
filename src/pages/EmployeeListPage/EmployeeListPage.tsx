import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'design-system'
import { MagnifyingGlass, PencilSimple, Trash } from '@phosphor-icons/react'
import { Navbar } from '../../components'
import { employees, deleteEmployee, type Role } from '../../mock/data'
import './EmployeeListPage.css'

const ROLE_LABEL: Record<Role, string> = {
  admin:        'Admin',
  employee:     'Employee',
  new_employee: 'Onboarding',
}

export default function EmployeeListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [list, setList] = useState(employees)

  const filtered = list.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  )

  function handleDelete(id: number) {
    if (!confirm('Delete this employee?')) return
    deleteEmployee(id)
    setList([...employees])
  }

  return (
    <div className="emp-list-page">
      <Navbar />
      <main className="emp-list-page__main page-content">
        <div className="emp-list-page__header">
          <div>
            <h1 className="emp-list-page__heading">Employees</h1>
            <p className="emp-list-page__sub">{list.length} total employees</p>
          </div>
          <Button variant="Solid" size="Medium" color="Primary" onClick={() => navigate('/employees/add')}>
            Add Employee
          </Button>
        </div>

        {/* Search */}
        <div className="emp-list-page__search-wrap">
          <MagnifyingGlass size={16} className="emp-list-page__search-icon" />
          <input
            className="emp-list-page__search"
            placeholder="Search by name, email, department…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="emp-table-wrap">
          <table className="emp-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Position</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Onboarding</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="emp-table__empty">No employees found</td>
                </tr>
              )}
              {filtered.map(emp => {
                const done  = emp.toolkit.filter(t => t.checked).length
                const total = emp.toolkit.length
                const pct   = Math.round((done / total) * 100)
                return (
                  <tr key={emp.id}>
                    <td>
                      <div className="emp-table__person">
                        <div className="emp-table__avatar">{emp.name[0]}</div>
                        <div className="emp-table__person-info">
                          <span className="emp-table__name">{emp.name}</span>
                          <span className="emp-table__email">{emp.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="emp-table__cell">{emp.department}</td>
                    <td className="emp-table__cell">{emp.position}</td>
                    <td className="emp-table__cell">{emp.joinDate}</td>
                    <td>
                      <span className={`emp-table__badge emp-table__badge--${emp.role}`}>
                        {ROLE_LABEL[emp.role]}
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
                          className="emp-table__action-btn"
                          onClick={() => navigate(`/employees/edit/${emp.id}`)}
                          aria-label="Edit"
                        >
                          <PencilSimple size={16} />
                        </button>
                        <button
                          className="emp-table__action-btn emp-table__action-btn--delete"
                          onClick={() => handleDelete(emp.id)}
                          aria-label="Delete"
                        >
                          <Trash size={16} />
                        </button>
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
