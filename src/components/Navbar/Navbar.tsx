import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Users, House, SignOut } from '@phosphor-icons/react'
import './Navbar.css'

const NAV_ITEMS = [
  { path: '/',           label: 'Dashboard', icon: House },
  { path: '/employees',  label: 'Employees',  icon: Users },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, logout } = useAuth()

  function handleLogout() { logout(); navigate('/login') }

  return (
    <nav className="sa-navbar">
      {/* Brand */}
      <div className="sa-navbar__brand" onClick={() => navigate('/')} role="button" tabIndex={0}>
        <img src="/src/assets/logo-company.png" alt="PT Nusantara Teknologi Digital" className="sa-navbar__logo" />
        <span className="sa-navbar__company">PT Nusantara Teknologi Digital</span>
        <span className="sa-navbar__badge">Super Admin</span>
      </div>

      {/* Nav */}
      <div className="sa-navbar__nav">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <button
            key={path}
            className={`sa-navbar__tab ${location.pathname === path ? 'sa-navbar__tab--active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* User + logout */}
      <div className="sa-navbar__user">
        <div className="sa-navbar__avatar">{currentUser?.name[0] ?? 'S'}</div>
        <span className="sa-navbar__name">{currentUser?.name}</span>
        <button className="sa-navbar__logout" onClick={handleLogout} aria-label="Sign out">
          <SignOut size={18} />
        </button>
      </div>
    </nav>
  )
}
