import { useNavigate } from 'react-router-dom'
import { Button } from 'design-system'
import { Users, UserCircleCheck, Hourglass, UserPlus } from '@phosphor-icons/react'
import { Navbar } from '../../components'
import { employees } from '../../mock/data'
import './DashboardPage.css'

export default function DashboardPage() {
  const navigate = useNavigate()

  const total      = employees.length
  const admins     = employees.filter(e => e.role === 'admin').length
  const active     = employees.filter(e => e.role === 'employee').length
  const onboarding = employees.filter(e => e.role === 'new_employee').length

  const onboardingEmployees = employees.filter(e => e.role === 'new_employee')

  const STATS = [
    { icon: Users,             label: 'Total Users',        value: total,      color: 'brand'   },
    { icon: UserCircleCheck,   label: 'Active Employees',   value: active,     color: 'success' },
    { icon: Hourglass,         label: 'Onboarding',         value: onboarding, color: 'warning' },
    { icon: Users,             label: 'Admins',             value: admins,     color: 'error'   },
  ]

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-page__main page-content">
        <div className="dashboard-page__header">
          <div>
            <h1 className="dashboard-page__heading">Dashboard</h1>
            <p className="dashboard-page__subheading">Overview of PT Nusantara Teknologi Digital</p>
          </div>
          <Button variant="Solid" size="Medium" color="Primary" onClick={() => navigate('/employees/add')}>
            Add Employee
          </Button>
        </div>

        {/* Stat cards */}
        <div className="dashboard-page__stats">
          {STATS.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className={`stat-card stat-card--${color}`}>
              <div className="stat-card__icon-wrap">
                <Icon size={24} />
              </div>
              <div className="stat-card__body">
                <span className="stat-card__value">{value}</span>
                <span className="stat-card__label">{label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Onboarding progress */}
        {onboardingEmployees.length > 0 && (
          <div className="dashboard-page__section">
            <h2 className="dashboard-page__section-title">Onboarding Progress</h2>
            <div className="onboarding-list">
              {onboardingEmployees.map(emp => {
                const done  = emp.toolkit.filter(t => t.checked).length
                const total = emp.toolkit.length
                const pct   = Math.round((done / total) * 100)
                return (
                  <div key={emp.id} className="onboarding-card">
                    <div className="onboarding-card__avatar">{emp.name[0]}</div>
                    <div className="onboarding-card__info">
                      <span className="onboarding-card__name">{emp.name}</span>
                      <span className="onboarding-card__role">{emp.position}</span>
                      <div className="onboarding-card__bar-wrap">
                        <div className="onboarding-card__bar">
                          <div className="onboarding-card__bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="onboarding-card__pct">{done}/{total} tasks</span>
                      </div>
                    </div>
                    <Button variant="Outline" size="Small" color="Primary" onClick={() => navigate(`/employees/edit/${emp.id}`)}>
                      View
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Quick action */}
        <div className="dashboard-page__section">
          <h2 className="dashboard-page__section-title">Quick Actions</h2>
          <div className="quick-actions">
            <button className="quick-action" onClick={() => navigate('/employees')}>
              <Users size={24} />
              <span>View All Employees</span>
            </button>
            <button className="quick-action" onClick={() => navigate('/employees/add')}>
              <UserPlus size={24} />
              <span>Add New Employee</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
