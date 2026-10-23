import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabaseClient'

export default function Header() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <header className="dash-header">
      <Link to="/" className="dash-logo">
        <span className="dash-logo-heart"></span>
        <span>POPLOVE</span>
      </Link>

      <div className="dash-header-actions">
        <button className="dash-upgrade-btn" onClick={() => navigate('/upgrade')}>
          <span className="dash-upgrade-icon">✨</span>
          <span>Upgrade</span>
        </button>

        <button className="dash-logout-btn" onClick={handleLogout} title="Se déconnecter">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  )
}