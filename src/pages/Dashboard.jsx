import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const navigate = useNavigate()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchCity, setSearchCity] = useState('')
  const [filterGender, setFilterGender] = useState('all')
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }
      setCurrentUser(session.user)
    }
    checkUser()
  }, [navigate])

  // Charger les profils depuis Supabase
  useEffect(() => {
    const loadProfiles = async () => {
      setLoading(true)
      try {
        let query = supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })

        if (filterGender !== 'all') {
          query = query.eq('gender', filterGender)
        }

        if (searchCity.trim()) {
          query = query.ilike('city', `%${searchCity.trim()}%`)
        }

        const { data, error } = await query
        if (error) throw error
        setProfiles(data || [])
      } catch (err) {
        console.error('Erreur chargement profils:', err)
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) loadProfiles()
  }, [currentUser, filterGender, searchCity])

  const calculateAge = (birthDate) => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const openProfileModal = (profile) => {
    setSelectedProfile(profile)
    setShowModal(true)
  }

  const closeProfileModal = () => {
    setShowModal(false)
    setSelectedProfile(null)
  }

  const getLookingForLabel = (value) => {
    const labels = {
      relation: '💕 Relation sérieuse',
      mariage: '💍 Mariage',
      amitie: '🤝 Amitié',
      discuter: '💬 Échanger'
    }
    return labels[value] || value
  }

  const getSmokingLabel = (value) => {
    const labels = {
      never: '🚭 Jamais',
      occasionally: '🚬 Occasionnellement',
      regularly: '🔥 Régulièrement',
      former: '✅ Ancien fumeur'
    }
    return labels[value] || value
  }

  const getDrinkingLabel = (value) => {
    const labels = {
      never: '🚱 Jamais',
      occasionally: '🥂 Occasionnellement',
      socially: '🍷 Socialement',
      regularly: '🍺 Régulièrement'
    }
    return labels[value] || value
  }

  const getOrientationLabel = (value) => {
    const labels = {
      heterosexual: '💑 Hétérosexuel',
      homosexual: '🏳️‍ Homosexuel',
      bisexual: ' Bisexuel',
      pansexual: '💖 Pansexuel',
      asexual: '🤍 Asexuel',
      other: '💫 Autre'
    }
    return labels[value] || value
  }

  return (
    <div className="dash-root">
      <style>{CSS}</style>

      {/* HEADER */}
      <header className="dash-header">
        <Link to="/" className="dash-logo">
          <span className="dash-logo-heart">💕</span>
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

      {/* CONTENU PRINCIPAL */}
      <main className="dash-main">
        {/* Filtres */}
        <div className="dash-filters">
          <div className="dash-search">
            <svg className="dash-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher par ville (ex: Dakar, Abidjan...)"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>

          <div className="dash-gender-filters">
            <button
              className={`dash-filter-btn ${filterGender === 'all' ? 'active' : ''}`}
              onClick={() => setFilterGender('all')}
            >
              🌍 Tous
            </button>
            <button
              className={`dash-filter-btn ${filterGender === 'Femme' ? 'active' : ''}`}
              onClick={() => setFilterGender('Femme')}
            >
              👩 Femme
            </button>
            <button
              className={`dash-filter-btn ${filterGender === 'Homme' ? 'active' : ''}`}
              onClick={() => setFilterGender('Homme')}
            >
              👨 Homme
            </button>
          </div>
        </div>

        {/* Grille de profils */}
        <div className="dash-profiles">
          {loading ? (
            <div className="dash-loading">
              <div className="dash-spinner" />
              <p>Chargement des profils...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-icon">💔</div>
              <h3>Aucun profil trouvé</h3>
              <p>Essayez de modifier vos filtres ou votre recherche.</p>
            </div>
          ) : (
            profiles.map((profile) => {
              const age = calculateAge(profile.birth_date)
              const mainPhoto = profile.photos?.[0] || null
              return (
                <div key={profile.id} className="dash-card">
                  <div className="dash-card-photo">
                    {mainPhoto ? (
                      <img src={mainPhoto} alt={`${profile.first_name} ${profile.last_name}`} />
                    ) : (
                      <div className="dash-card-no-photo">
                        <span>👤</span>
                        <p>Pas de photo</p>
                      </div>
                    )}
                    {profile.photos?.length > 1 && (
                      <span className="dash-card-photos-count">+{profile.photos.length - 1} photos</span>
                    )}
                  </div>
                  <div className="dash-card-info">
                    <h3>
                      {profile.first_name}
                      {age && <span className="dash-card-age">, {age}</span>}
                    </h3>
                    <p className="dash-card-location"> {profile.city}, {profile.country}</p>
                    {profile.looking_for && (
                      <p className="dash-card-looking">{getLookingForLabel(profile.looking_for)}</p>
                    )}
                  </div>
                  <div className="dash-card-actions">
                    <button 
                      className="dash-action-btn dash-action-view" 
                      onClick={() => openProfileModal(profile)}
                    >
                      ️ Voir le profil
                    </button>
                    <button className="dash-action-btn dash-action-contact">
                      💬 Contacter
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>

      {/* MODAL DE PROFIL DÉTAILLÉ */}
      {showModal && selectedProfile && (
        <div className="modal-overlay" onClick={closeProfileModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeProfileModal}></button>
            
            <div className="modal-header">
              <div className="modal-photo">
                {selectedProfile.photos?.[0] ? (
                  <img src={selectedProfile.photos[0]} alt={`${selectedProfile.first_name} ${selectedProfile.last_name}`} />
                ) : (
                  <div className="modal-no-photo">👤</div>
                )}
              </div>
              <div className="modal-title">
                <h2>
                  {selectedProfile.first_name} {selectedProfile.last_name}
                  {calculateAge(selectedProfile.birth_date) && (
                    <span className="modal-age">, {calculateAge(selectedProfile.birth_date)} ans</span>
                  )}
                </h2>
                <p className="modal-location">📍 {selectedProfile.city}, {selectedProfile.country}</p>
                {selectedProfile.looking_for && (
                  <p className="modal-looking">{getLookingForLabel(selectedProfile.looking_for)}</p>
                )}
              </div>
            </div>

            <div className="modal-body">
              {/* Bio */}
              {selectedProfile.description && (
                <div className="modal-section">
                  <h3>📝 À propos</h3>
                  <p>{selectedProfile.description}</p>
                </div>
              )}

              {/* Intérêts */}
              {selectedProfile.interests?.length > 0 && (
                <div className="modal-section">
                  <h3>🎯 Centres d'intérêt</h3>
                  <div className="modal-interests">
                    {selectedProfile.interests.map((interest, idx) => (
                      <span key={idx} className="modal-interest-tag">{interest}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mode de vie */}
              {(selectedProfile.smoking_status || selectedProfile.drinking_status || selectedProfile.sexual_orientation) && (
                <div className="modal-section">
                  <h3>🌟 Mode de vie</h3>
                  <div className="modal-lifestyle">
                    {selectedProfile.smoking_status && (
                      <div className="lifestyle-item">
                        <span className="lifestyle-label">Tabac :</span>
                        <span>{getSmokingLabel(selectedProfile.smoking_status)}</span>
                      </div>
                    )}
                    {selectedProfile.drinking_status && (
                      <div className="lifestyle-item">
                        <span className="lifestyle-label">Alcool :</span>
                        <span>{getDrinkingLabel(selectedProfile.drinking_status)}</span>
                      </div>
                    )}
                    {selectedProfile.sexual_orientation && (
                      <div className="lifestyle-item">
                        <span className="lifestyle-label">Orientation :</span>
                        <span>{getOrientationLabel(selectedProfile.sexual_orientation)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Photos supplémentaires */}
              {selectedProfile.photos?.length > 1 && (
                <div className="modal-section">
                  <h3>📸 Photos ({selectedProfile.photos.length})</h3>
                  <div className="modal-photos-grid">
                    {selectedProfile.photos.slice(1).map((photo, idx) => (
                      <img key={idx} src={photo} alt={`Photo ${idx + 2}`} className="modal-photo-thumb" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="modal-btn modal-btn-pass" onClick={closeProfileModal}>
                ✕ Passer
              </button>
              <button className="modal-btn modal-btn-like">
                ♥ J'aime
              </button>
              <button className="modal-btn modal-btn-contact">
                💬 Contacter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;600;700&display=swap');

.dash-root {
  --bg: #0b0710;
  --bg-2: #130b1c;
  --surface: #1b1126;
  --surface-2: #261935;
  --line: rgba(246, 234, 240, .09);
  --line-strong: rgba(246, 234, 240, .18);
  --text: #f7eef2;
  --muted: #ab9aa7;
  --rose: #ff5c8a;
  --rose-deep: #d6335f;
  --rose-soft: #ff9cb8;
  --serif: 'Fraunces', Georgia, serif;
  --sans: 'Manrope', system-ui, sans-serif;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
}

/* HEADER */
.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
  background: linear-gradient(180deg, rgba(11,7,16,0.95) 0%, rgba(11,7,16,0.8) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 100;
}

.dash-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--text);
}

.dash-logo-heart { font-size: 1.8rem; }
.dash-logo span:last-child {
  font-family: var(--serif);
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.dash-header-actions { display: flex; align-items: center; gap: 12px; }

.dash-upgrade-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--rose), var(--rose-deep));
  color: white;
  border: none;
  border-radius: 50px;
  font-family: var(--sans);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(255, 92, 138, 0.4);
}

.dash-upgrade-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(255, 92, 138, 0.6);
}

.dash-upgrade-icon { font-size: 1.1rem; }

.dash-logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s;
}

.dash-logout-btn:hover {
  background: rgba(255,255,255,0.1);
  color: var(--text);
}

/* CONTENU */
.dash-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 40px;
}

.dash-filters {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.dash-search {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.dash-search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
}

.dash-search input {
  width: 100%;
  padding: 16px 20px 16px 50px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 50px;
  color: var(--text);
  font-family: var(--sans);
  font-size: 1rem;
  transition: all 0.2s;
}

.dash-search input::placeholder { color: var(--muted); }

.dash-search input:focus {
  outline: none;
  border-color: var(--rose);
  box-shadow: 0 0 0 4px rgba(255, 92, 138, 0.15);
}

.dash-gender-filters {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.dash-filter-btn {
  padding: 12px 24px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 50px;
  color: var(--muted);
  font-family: var(--sans);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.dash-filter-btn:hover {
  border-color: var(--line-strong);
  color: var(--text);
}

.dash-filter-btn.active {
  background: linear-gradient(135deg, var(--rose), var(--rose-deep));
  border-color: var(--rose);
  color: white;
}

/* GRILLE */
.dash-profiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* CARTE */
.dash-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.dash-card:hover {
  transform: translateY(-4px);
  border-color: var(--rose);
  box-shadow: 0 10px 40px rgba(255, 92, 138, 0.2);
}

.dash-card-photo {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: var(--bg-2);
}

.dash-card-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.dash-card:hover .dash-card-photo img { transform: scale(1.05); }

.dash-card-no-photo {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  gap: 10px;
}

.dash-card-no-photo span { font-size: 4rem; opacity: 0.3; }

.dash-card-photos-count {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.dash-card-info { padding: 20px; flex: 1; }

.dash-card-info h3 {
  font-family: var(--serif);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: var(--text);
}

.dash-card-age {
  color: var(--muted);
  font-weight: 500;
  font-family: var(--sans);
}

.dash-card-location {
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0 0 8px 0;
}

.dash-card-looking {
  color: var(--rose-soft);
  font-size: 0.9rem;
  margin: 0;
  font-weight: 600;
}

.dash-card-actions {
  display: flex;
  gap: 10px;
  padding: 0 20px 20px 20px;
}

.dash-action-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 700;
  font-family: var(--sans);
}

.dash-action-view {
  background: rgba(255,255,255,0.05);
  color: var(--text);
  border: 1px solid var(--line-strong);
}

.dash-action-view:hover {
  background: rgba(255,255,255,0.1);
  border-color: var(--rose);
}

.dash-action-contact {
  background: linear-gradient(135deg, var(--rose), var(--rose-deep));
  color: white;
}

.dash-action-contact:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(255, 92, 138, 0.4);
}

/* LOADING & EMPTY */
.dash-loading, .dash-empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
  color: var(--muted);
}

.dash-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid var(--line);
  border-top-color: var(--rose);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin { to { transform: rotate(360deg); } }

.dash-empty-icon { font-size: 4rem; margin-bottom: 20px; }

.dash-empty h3 {
  font-family: var(--serif);
  font-size: 1.8rem;
  margin: 0 0 10px 0;
  color: var(--text);
}

.dash-empty p { margin: 0; font-size: 1rem; }

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: var(--surface);
  border-radius: 24px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(0,0,0,0.5);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--rose-deep);
  transform: rotate(90deg);
}

.modal-header {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
  background: linear-gradient(135deg, var(--bg-2), var(--surface-2));
  border-radius: 24px 24px 0 0;
}

.modal-photo {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 16px;
  overflow: hidden;
  background: var(--bg);
}

.modal-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-no-photo {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6rem;
  color: var(--muted);
  opacity: 0.3;
}

.modal-title h2 {
  font-family: var(--serif);
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: var(--text);
}

.modal-age {
  color: var(--muted);
  font-weight: 500;
  font-family: var(--sans);
}

.modal-location {
  color: var(--muted);
  font-size: 1rem;
  margin: 0 0 8px 0;
}

.modal-looking {
  color: var(--rose-soft);
  font-size: 1rem;
  margin: 0;
  font-weight: 600;
}

.modal-body {
  padding: 30px;
}

.modal-section {
  margin-bottom: 30px;
}

.modal-section h3 {
  font-family: var(--serif);
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 15px 0;
  color: var(--text);
  border-bottom: 1px solid var(--line);
  padding-bottom: 10px;
}

.modal-section p {
  color: var(--muted);
  line-height: 1.7;
  margin: 0;
  font-size: 1rem;
}

.modal-interests {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.modal-interest-tag {
  padding: 8px 16px;
  background: rgba(255, 92, 138, 0.1);
  border: 1px solid var(--rose);
  border-radius: 50px;
  color: var(--rose-soft);
  font-size: 0.9rem;
  font-weight: 600;
}

.modal-lifestyle {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lifestyle-item {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  background: var(--bg-2);
  border-radius: 12px;
  border: 1px solid var(--line);
}

.lifestyle-label {
  color: var(--muted);
  font-weight: 600;
  min-width: 120px;
}

.modal-photos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.modal-photo-thumb {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-photo-thumb:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(255, 92, 138, 0.3);
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 30px 30px 30px;
  border-top: 1px solid var(--line);
}

.modal-btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--sans);
}

.modal-btn-pass {
  background: rgba(255,255,255,0.05);
  color: var(--muted);
  border: 1px solid var(--line);
}

.modal-btn-pass:hover {
  background: rgba(255,255,255,0.1);
  color: var(--text);
}

.modal-btn-like {
  background: linear-gradient(135deg, var(--rose), var(--rose-deep));
  color: white;
}

.modal-btn-like:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 20px rgba(255, 92, 138, 0.4);
}

.modal-btn-contact {
  background: var(--surface-2);
  color: var(--text);
  border: 1px solid var(--line-strong);
}

.modal-btn-contact:hover {
  background: var(--line-strong);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .dash-header { padding: 15px 20px; }
  .dash-main { padding: 20px; }
  .dash-profiles {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }
  .modal-content { max-height: 95vh; }
  .modal-photos-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .dash-profiles { grid-template-columns: 1fr; }
  .dash-gender-filters { flex-wrap: wrap; }
  .modal-footer { flex-direction: column; }
}
`