import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Users, SignOut } from '@phosphor-icons/react'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, logout } = useAuth()

  function handleLogout() { logout(); navigate('/login') }

  return (
    <nav className="sa-nav">
      {/* Brand */}
      <div className="sa-nav__brand" onClick={() => navigate('/')} role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && navigate('/')}>
        <img src="/src/assets/logo-company.png" alt="logo" className="sa-nav__logo" />
        <div className="sa-nav__brand-text">
          <span className="sa-nav__company">PT Nusantara Teknologi Digital</span>
          <span className="sa-nav__badge">Super Admin</span>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="sa-nav__tabs">
        <button
          className={`sa-nav__tab ${location.pathname === '/' || location.pathname.startsWith('/employees') ? 'sa-nav__tab--active' : ''}`}
          onClick={() => navigate('/')}
        >
          <Users size={16} />
          Employees
        </button>
      </div>

      {/* User */}
      <div className="sa-nav__user">
        <div className="sa-nav__avatar">{currentUser?.name[0] ?? 'S'}</div>
        <span className="sa-nav__name">{currentUser?.name}</span>
        <button className="sa-nav__logout" onClick={handleLogout} aria-label="Sign out">
          <SignOut size={18} />
        </button>
      </div>
    </nav>
  )
}
