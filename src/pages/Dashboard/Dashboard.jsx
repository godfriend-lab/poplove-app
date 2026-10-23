import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import ProfileGrid from './components/ProfileGrid'
import ProfileModal from './components/ProfileModal'
import { useMatching } from './hooks/useMatching'
import './Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const { profiles, loading, userProfile } = useMatching()
  const [searchCity, setSearchCity] = useState('')
  const [filterGender, setFilterGender] = useState('all')
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const filteredProfiles = profiles.filter(profile => {
    if (filterGender !== 'all' && profile.gender !== filterGender) return false
    if (searchCity.trim() && !profile.city?.toLowerCase().includes(searchCity.toLowerCase())) return false
    return true
  })

  const openProfileModal = (profile) => {
    setSelectedProfile(profile)
    setShowModal(true)
  }

  const closeProfileModal = () => {
    setShowModal(false)
    setSelectedProfile(null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="dash-root">
      {/* HEADER COMPLET */}
      <header className="dash-header">
        <div className="dash-header-left">
          <Link to="/" className="dash-logo">
            <span>POPLOVE</span>
          </Link>
        </div>

        <div className="dash-header-center">
          <div className="dash-search">
            <svg className="dash-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher par ville"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>

          <div className="dash-gender-filters">
            <button
              className={`dash-filter-btn ${filterGender === 'all' ? 'active' : ''}`}
              onClick={() => setFilterGender('all')}
            >
              Tous
            </button>
            <button
              className={`dash-filter-btn ${filterGender === 'Femme' ? 'active' : ''}`}
              onClick={() => setFilterGender('Femme')}
            >
              Femme
            </button>
            <button
              className={`dash-filter-btn ${filterGender === 'Homme' ? 'active' : ''}`}
              onClick={() => setFilterGender('Homme')}
            >
              Homme
            </button>
          </div>
        </div>

        <div className="dash-header-right">
          <button className="dash-upgrade-btn" onClick={() => navigate('/upgrade')}>
            Upgrade
          </button>
          <button className="dash-logout-btn" onClick={handleLogout} title="Se déconnecter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="dash-main">
        <ProfileGrid
          profiles={filteredProfiles}
          loading={loading}
          onViewProfile={openProfileModal}
        />
      </main>

      {showModal && selectedProfile && (
        <ProfileModal
          profile={selectedProfile}
          onClose={closeProfileModal}
        />
      )}
    </div>
  )
}