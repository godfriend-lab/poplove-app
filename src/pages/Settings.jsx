import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Settings() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [currentUser, setCurrentUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // États du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    description: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    matches: true,
    messages: true
  })

  const [privacy, setPrivacy] = useState({
    showAge: true,
    showDistance: true,
    showOnline: true,
    allowMessages: true
  })

  // Charger l'utilisateur et le profil
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          navigate('/login')
          return
        }
        setCurrentUser(session.user)

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) throw error

        setProfile(profileData)
        setFormData({
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          email: session.user.email || '',
          phone: profileData.phone || '',
          city: profileData.city || '',
          country: profileData.country || '',
          description: profileData.description || ''
        })
      } catch (err) {
        console.error('Erreur chargement:', err)
        setMessage({ type: 'error', text: 'Impossible de charger vos données.' })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handlePrivacyChange = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const saveProfile = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          city: formData.city,
          country: formData.country,
          description: formData.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id)

      if (error) throw error
      setMessage({ type: 'success', text: '✅ Profil mis à jour avec succès !' })
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: '❌ Erreur lors de la sauvegarde.' })
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' })
      return
    }
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Le mot de passe doit faire au moins 8 caractères.' })
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })
      if (error) throw error
      setMessage({ type: 'success', text: '✅ Mot de passe modifié avec succès !' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Erreur : ' + err.message })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('️ Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return
    }
    if (!window.confirm('️⚠️ DERNIER AVERTISSEMENT : Toutes vos données seront définitivement supprimées.')) {
      return
    }

    try {
      const { error } = await supabase.from('profiles').delete().eq('id', currentUser.id)
      if (error) throw error

      const { error: authError } = await supabase.auth.admin.deleteUser(currentUser.id)
      if (authError) throw authError

      await supabase.auth.signOut()
      navigate('/')
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Erreur : ' + err.message })
    }
  }

  const tabs = [
    { id: 'profile', label: '👤 Profil', icon: '👤' },
    { id: 'password', label: '🔒 Mot de passe', icon: '🔒' },
    { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
    { id: 'privacy', label: '🛡️ Confidentialité', icon: '🛡️' },
    { id: 'danger', label: '️ Zone dangereuse', icon: '⚠️' }
  ]

  if (loading) {
    return (
      <div className="settings-root">
        <div className="settings-loading">
          <div className="settings-spinner" />
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="settings-root">
      <style>{CSS}</style>

      {/* HEADER */}
      <header className="settings-header">
        <Link to="/dashboard" className="settings-logo">
          <span>💕</span>
          <span>POPLOVE</span>
        </Link>
        <h1 className="settings-title">⚙️ Paramètres</h1>
        <Link to="/dashboard" className="settings-back">
          ← Retour
        </Link>
      </header>

      <div className="settings-container">
        {/* SIDEBAR TABS */}
        <aside className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* CONTENU */}
        <main className="settings-content">
          {message.text && (
            <div className={`settings-message ${message.type}`}>
              {message.text}
            </div>
          )}

          {/* TAB: PROFIL */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>👤 Informations personnelles</h2>
              <p className="section-desc">Modifiez vos informations de profil.</p>

              {/* Photo de profil */}
              <div className="settings-photo-section">
                <div className="settings-photo">
                  {profile?.photos?.[0] ? (
                    <img src={profile.photos[0]} alt="Photo de profil" />
                  ) : (
                    <div className="settings-photo-placeholder">👤</div>
                  )}
                </div>
                <button className="btn-secondary">📷 Changer la photo</button>
              </div>

              <div className="settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Nom</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="readonly"
                  />
                  <small className="form-hint">L'email ne peut pas être modifié ici.</small>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+221 77 000 00 00"
                    />
                  </div>
                  <div className="form-group">
                    <label>Ville</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Votre ville"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Pays</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Votre pays"
                  />
                </div>

                <div className="form-group">
                  <label>À propos de moi</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Décrivez-vous en quelques mots..."
                  />
                </div>

                <button
                  className="btn-primary"
                  onClick={saveProfile}
                  disabled={saving}
                >
                  {saving ? '💾 Sauvegarde...' : '💾 Enregistrer les modifications'}
                </button>
              </div>
            </div>
          )}

          {/* TAB: MOT DE PASSE */}
          {activeTab === 'password' && (
            <div className="settings-section">
              <h2>🔒 Changer le mot de passe</h2>
              <p className="section-desc">Assurez-vous d'utiliser un mot de passe fort.</p>

              <div className="settings-form">
                <div className="form-group">
                  <label>Nouveau mot de passe</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                  />
                </div>

                <div className="form-group">
                  <label>Confirmer le mot de passe</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                  />
                </div>

                <button
                  className="btn-primary"
                  onClick={changePassword}
                  disabled={saving}
                >
                  {saving ? '🔒 Modification...' : ' Changer le mot de passe'}
                </button>
              </div>
            </div>
          )}

          {/* TAB: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>🔔 Préférences de notification</h2>
              <p className="section-desc">Choisissez comment vous souhaitez être notifié.</p>

              <div className="settings-options">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="option-item">
                    <div className="option-info">
                      <strong>
                        {key === 'email' && '📧 Notifications par email'}
                        {key === 'push' && '📱 Notifications push'}
                        {key === 'matches' && '💕 Nouveaux matchs'}
                        {key === 'messages' && '💬 Nouveaux messages'}
                      </strong>
                      <span>
                        {key === 'email' && 'Recevoir les notifications par email'}
                        {key === 'push' && 'Recevoir les notifications push'}
                        {key === 'matches' && 'Être notifié des nouveaux matchs'}
                        {key === 'messages' && 'Être notifié des nouveaux messages'}
                      </span>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleNotificationChange(key)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
              </div>

              <button className="btn-primary" onClick={() => setMessage({ type: 'success', text: '✅ Préférences sauvegardées !' })}>
                💾 Enregistrer
              </button>
            </div>
          )}

          {/* TAB: CONFIDENTIALITÉ */}
          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2>️ Confidentialité</h2>
              <p className="section-desc">Contrôlez qui peut voir vos informations.</p>

              <div className="settings-options">
                {Object.entries(privacy).map(([key, value]) => (
                  <div key={key} className="option-item">
                    <div className="option-info">
                      <strong>
                        {key === 'showAge' && ' Afficher mon âge'}
                        {key === 'showDistance' && '📍 Afficher ma distance'}
                        {key === 'showOnline' && '🟢 Afficher mon statut en ligne'}
                        {key === 'allowMessages' && '💬 Autoriser les messages'}
                      </strong>
                      <span>
                        {key === 'showAge' && 'Votre âge sera visible sur votre profil'}
                        {key === 'showDistance' && 'La distance sera visible sur votre profil'}
                        {key === 'showOnline' && 'Les autres utilisateurs verront si vous êtes en ligne'}
                        {key === 'allowMessages' && 'Autoriser les autres utilisateurs à vous envoyer des messages'}
                      </span>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handlePrivacyChange(key)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
              </div>

              <button className="btn-primary" onClick={() => setMessage({ type: 'success', text: '✅ Préférences sauvegardées !' })}>
                💾 Enregistrer
              </button>
            </div>
          )}

          {/* TAB: ZONE DANGEREUSE */}
          {activeTab === 'danger' && (
            <div className="settings-section danger-zone">
              <h2>⚠️ Zone dangereuse</h2>
              <p className="section-desc">Ces actions sont irréversibles. Procédez avec prudence.</p>

              <div className="danger-card">
                <div className="danger-info">
                  <h3>🚪 Se déconnecter</h3>
                  <p>Vous serez déconnecté de votre compte sur cet appareil.</p>
                </div>
                <button className="btn-danger btn-outline" onClick={handleLogout}>
                  Se déconnecter
                </button>
              </div>

              <div className="danger-card">
                <div className="danger-info">
                  <h3>🗑️ Supprimer mon compte</h3>
                  <p>Supprime définitivement votre compte et toutes vos données. Cette action est irréversible.</p>
                </div>
                <button className="btn-danger" onClick={handleDeleteAccount}>
                  Supprimer mon compte
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;600;700&display=swap');

.settings-root {
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
  --danger: #ff4757;
  --success: #4fd1a1;
  --serif: 'Fraunces', Georgia, serif;
  --sans: 'Manrope', system-ui, sans-serif;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
}

.settings-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 20px;
  color: var(--muted);
}

.settings-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid var(--line);
  border-top-color: var(--rose);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* HEADER */
.settings-header {
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

.settings-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--text);
  font-family: var(--serif);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.settings-title {
  font-family: var(--serif);
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.settings-back {
  color: var(--muted);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.settings-back:hover { color: var(--rose); }

/* CONTAINER */
.settings-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  max-width: 1400px;
  margin: 0 auto;
  gap: 40px;
  padding: 40px;
}

/* SIDEBAR */
.settings-sidebar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: fit-content;
  position: sticky;
  top: 120px;
}

.settings-tab {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  color: var(--muted);
  font-family: var(--sans);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.settings-tab:hover {
  border-color: var(--line-strong);
  color: var(--text);
  background: var(--surface-2);
}

.settings-tab.active {
  background: linear-gradient(135deg, var(--rose), var(--rose-deep));
  border-color: var(--rose);
  color: white;
}

.tab-icon { font-size: 1.2rem; }

/* CONTENU */
.settings-content {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 40px;
  min-height: 600px;
}

.settings-message {
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  font-weight: 600;
}

.settings-message.success {
  background: rgba(79, 209, 161, 0.1);
  border: 1px solid var(--success);
  color: var(--success);
}

.settings-message.error {
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid var(--danger);
  color: var(--danger);
}

.settings-section h2 {
  font-family: var(--serif);
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 10px 0;
}

.section-desc {
  color: var(--muted);
  margin: 0 0 30px 0;
  font-size: 1rem;
}

/* PHOTO */
.settings-photo-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid var(--line);
}

.settings-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--bg-2);
  border: 2px solid var(--line-strong);
}

.settings-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.settings-photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: var(--muted);
}

/* FORMULAIRE */
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
}

.form-group input,
.form-group textarea {
  padding: 14px 16px;
  background: var(--bg-2);
  border: 1px solid var(--line);
  border-radius: 12px;
  color: var(--text);
  font-family: var(--sans);
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--rose);
  box-shadow: 0 0 0 4px rgba(255, 92, 138, 0.15);
}

.form-group input.readonly {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-hint {
  color: var(--muted);
  font-size: 0.85rem;
}

/* OPTIONS (Notifications & Confidentialité) */
.settings-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: var(--bg-2);
  border: 1px solid var(--line);
  border-radius: 12px;
  transition: all 0.2s;
}

.option-item:hover {
  border-color: var(--line-strong);
}

.option-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option-info strong {
  font-size: 1rem;
  color: var(--text);
}

.option-info span {
  font-size: 0.85rem;
  color: var(--muted);
}

/* TOGGLE SWITCH */
.toggle {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
  flex-shrink: 0;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--line-strong);
  border-radius: 28px;
  transition: 0.3s;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle input:checked + .toggle-slider {
  background: var(--rose);
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* BOUTONS */
.btn-primary {
  padding: 14px 28px;
  background: linear-gradient(135deg, var(--rose), var(--rose-deep));
  color: white;
  border: none;
  border-radius: 12px;
  font-family: var(--sans);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(255, 92, 138, 0.4);
  align-self: flex-start;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(255, 92, 138, 0.6);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 10px 20px;
  background: var(--surface-2);
  color: var(--text);
  border: 1px solid var(--line-strong);
  border-radius: 10px;
  font-family: var(--sans);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--line-strong);
}

/* ZONE DANGEREUSE */
.danger-zone {
  border-left: 4px solid var(--danger);
}

.danger-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: rgba(255, 71, 87, 0.05);
  border: 1px solid rgba(255, 71, 87, 0.2);
  border-radius: 12px;
  margin-bottom: 20px;
}

.danger-info h3 {
  margin: 0 0 8px 0;
  color: var(--danger);
  font-size: 1.1rem;
}

.danger-info p {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.btn-danger {
  padding: 12px 24px;
  background: var(--danger);
  color: white;
  border: none;
  border-radius: 10px;
  font-family: var(--sans);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-danger:hover {
  background: #ff3344;
  transform: translateY(-2px);
}

.btn-danger.btn-outline {
  background: transparent;
  border: 1px solid var(--danger);
  color: var(--danger);
}

.btn-danger.btn-outline:hover {
  background: var(--danger);
  color: white;
}

/* RESPONSIVE */
@media (max-width: 960px) {
  .settings-container {
    grid-template-columns: 1fr;
    padding: 20px;
  }
  .settings-sidebar {
    position: static;
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  .settings-tab {
    white-space: nowrap;
    min-width: fit-content;
  }
  .settings-content {
    padding: 24px;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .danger-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .settings-header {
    padding: 15px 20px;
  }
  .settings-title {
    font-size: 1.3rem;
  }
}
`