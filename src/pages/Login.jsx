import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const navigate = useNavigate()
  
  const [view, setView] = useState('login')
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false })
  const [forgotEmail, setForgotEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [error, setError] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  useEffect(() => {
    const savedEmail = localStorage.getItem('poplove_remember_email')
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail, rememberMe: true }))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (error) setError('')
  }

  const handleKeyDown = (e) => {
    if (e.getModifierState) {
      setCapsLock(e.getModifierState('CapsLock'))
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (loading) return

    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      })

      if (supabaseError) throw supabaseError

      if (formData.rememberMe) {
        localStorage.setItem('poplove_remember_email', formData.email.trim())
      } else {
        localStorage.removeItem('poplove_remember_email')
      }

      navigate('/dashboard')
    } catch (err) {
      console.error('Erreur de connexion:', err)
      if (err.message.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect.')
      } else if (err.message.includes('Email not confirmed')) {
        setError('Veuillez vérifier votre email.')
      } else {
        setError('Une erreur est survenue.')
      }
      setFormData(prev => ({ ...prev, password: '' }))
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    if (loading || socialLoading) return
    setSocialLoading(provider)
    setError('')

    try {
      const { error: supabaseError } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      })
      if (supabaseError) throw supabaseError
    } catch (err) {
      console.error(`Erreur ${provider}:`, err)
      setError(`Connexion ${provider} échouée.`)
    } finally {
      setSocialLoading('')
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setError('Email invalide.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (supabaseError) throw supabaseError
      setForgotSent(true)
    } catch (err) {
      console.error('Erreur reset:', err)
      setError("Impossible d'envoyer le lien.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-root">
      <style>{CSS}</style>
      
      {/* CÔTÉ GAUCHE : VISUEL (Caché sur mobile) */}
      <div className="login-left">
        <div className="login-visual">
          <Link to="/" className="login-logo">
            <span>💕</span>
            <span>POPLOVE</span>
          </Link>
          
          <div className="login-badge">💌 Bon retour parmi nous</div>
          
          <h1 className="login-title">
            Votre histoire
            <br />
            <span className="login-title-highlight">continue ici</span>
          </h1>
          
          <p className="login-subtitle">
            Retrouvez vos matchs, vos conversations et les personnes qui comptent pour vous.
          </p>

          <div className="login-features">
            {[
              { icon: '🔒', title: 'Connexion sécurisée', desc: 'Chiffrement de bout en bout' },
              { icon: '⚡', title: 'Accès immédiat', desc: 'Vos matchs instantanément' },
              { icon: '🌍', title: '50 000+ membres', desc: 'Communauté active' }
            ].map((feature, index) => (
              <div key={index} className="login-feature">
                <div className="login-feature-icon">{feature.icon}</div>
                <div>
                  <div className="login-feature-title">{feature.title}</div>
                  <div className="login-feature-desc">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CÔTÉ DROIT : FORMULAIRE */}
      <div className="login-right">
        <div className="login-form-container">
          
          {view === 'login' && (
            <div className="login-form" style={{ animation: 'fadeIn 0.4s ease' }}>
              <h2 className="login-form-title">Connexion</h2>
              <p className="login-form-subtitle">Heureux de vous revoir. Connectez-vous pour accéder à votre compte.</p>

              <div className="login-social">
                <SocialButton 
                  label="Google" 
                  loading={socialLoading === 'google'} 
                  onClick={() => handleSocialLogin('google')}
                  icon={<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
                />
                <SocialButton 
                  label="Apple" 
                  loading={socialLoading === 'apple'} 
                  onClick={() => handleSocialLogin('apple')}
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>}
                />
              </div>

              <div className="login-divider">
                <span>ou par email</span>
              </div>

              {error && (
                <div className="login-error">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="login-field">
                  <label>Adresse email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nom@exemple.com"
                    required
                    className="login-input"
                  />
                </div>

                <div className="login-field">
                  <div className="login-field-header">
                    <label>Mot de passe</label>
                    <button type="button" className="login-forgot-btn" onClick={() => setView('forgot')}>
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="login-password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      placeholder="••••••••"
                      required
                      className="login-input login-input-password"
                    />
                    <button type="button" className="login-toggle-password" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {capsLock && (
                    <p className="login-caps-warning">⚠️ Verrouillage des majuscules activé</p>
                  )}
                </div>

                <label className="login-remember">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span>Rester connecté sur cet appareil</span>
                </label>

                <button type="submit" disabled={loading} className="login-submit">
                  {loading ? (
                    <><div className="login-spinner" /> Connexion...</>
                  ) : 'Se connecter '}
                </button>
              </form>

              <p className="login-register">
                Pas encore de compte ?{' '}
                <Link to="/register">Créer un compte</Link>
              </p>
            </div>
          )}

          {view === 'forgot' && (
            <div className="login-form" style={{ animation: 'fadeIn 0.4s ease' }}>
              <button type="button" className="login-back-btn" onClick={() => { setView('login'); setError(''); setForgotSent(false); }}>
                ← Retour
              </button>

              <div className="login-forgot-icon">🔐</div>

              <h2 className="login-form-title">
                {forgotSent ? 'Vérifiez votre boîte mail' : 'Mot de passe oublié ?'}
              </h2>
              <p className="login-form-subtitle">
                {forgotSent 
                  ? `Si un compte existe pour ${forgotEmail}, vous recevrez un lien.`
                  : 'Saisissez votre email pour recevoir un lien de réinitialisation.'}
              </p>

              {error && (
                <div className="login-error">⚠️ {error}</div>
              )}

              {!forgotSent ? (
                <form onSubmit={handleForgotPassword}>
                  <div className="login-field">
                    <label>Adresse email</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => { setForgotEmail(e.target.value); if (error) setError('') }}
                      placeholder="nom@exemple.com"
                      required
                      className="login-input"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="login-submit">
                    {loading ? (
                      <><div className="login-spinner" /> Envoi en cours...</>
                    ) : 'Envoyer le lien 🔗'}
                  </button>
                </form>
              ) : (
                <button type="button" onClick={() => { setView('login'); setForgotSent(false); setForgotEmail('') }} className="login-submit">
                  Retour à la connexion
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ================= COMPOSANTS AUXILIAIRES ================= */
function SocialButton({ label, loading, onClick, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`login-social-btn ${loading ? 'loading' : ''}`}
    >
      {loading ? (
        <div className="login-spinner-small" />
      ) : icon}
      {label}
    </button>
  )
}

/* ================= STYLES CSS ================= */
const CSS = `
  .login-root {
    min-height: 100vh;
    display: flex;
    font-family: 'Poppins', sans-serif;
    background: #0a0a0a;
  }

  /* CÔTÉ GAUCHE - Visuel */
  .login-left {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background: linear-gradient(135deg, #1a0a1f 0%, #2d1b2e 50%, #1a0a1f 100%);
    overflow: hidden;
  }

  .login-visual {
    position: relative;
    z-index: 2;
    max-width: 500px;
  }

  .login-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    margin-bottom: 60px;
  }

  .login-logo span:first-child {
    font-size: 2.5rem;
  }

  .login-logo span:last-child {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 900;
    background: linear-gradient(135deg, #ff6b9d, #e63946);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 2px;
  }

  .login-badge {
    display: inline-block;
    padding: 8px 20px;
    background: rgba(230, 57, 70, 0.2);
    border: 1px solid rgba(230, 57, 70, 0.4);
    border-radius: 50px;
    color: #ff6b9d;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 30px;
    backdrop-filter: blur(10px);
  }

  .login-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.5rem, 4vw, 4rem);
    color: white;
    line-height: 1.1;
    margin: 0 0 25px 0;
    font-weight: 900;
  }

  .login-title-highlight {
    background: linear-gradient(135deg, #ff6b9d, #e63946);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .login-subtitle {
    color: rgba(255,255,255,0.7);
    font-size: 1.1rem;
    line-height: 1.7;
    margin: 0 0 40px 0;
  }

  .login-features {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .login-feature {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }

  .login-feature-icon {
    width: 45px;
    height: 45px;
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(230, 57, 70, 0.2));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .login-feature-title {
    color: white;
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 3px;
  }

  .login-feature-desc {
    color: rgba(255,255,255,0.5);
    font-size: 0.85rem;
  }

  /* Animations de fond */
  .login-left::before,
  .login-left::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    animation: float 8s ease-in-out infinite;
  }

  .login-left::before {
    top: -10%;
    left: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(230, 57, 70, 0.3) 0%, transparent 70%);
  }

  .login-left::after {
    bottom: -10%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 107, 157, 0.2) 0%, transparent 70%);
    animation-delay: -4s;
  }

  /* CÔTÉ DROIT - Formulaire */
  .login-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: #0a0a0a;
    position: relative;
    overflow: auto;
  }

  .login-form-container {
    width: 100%;
    max-width: 450px;
    position: relative;
    z-index: 2;
  }

  .login-form {
    width: 100%;
  }

  .login-form-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    color: white;
    margin: 0 0 10px 0;
    font-weight: 900;
  }

  .login-form-subtitle {
    color: rgba(255,255,255,0.6);
    margin: 0 0 30px 0;
    font-size: 1rem;
    line-height: 1.6;
  }

  .login-social {
    display: flex;
    gap: 12px;
    margin-bottom: 25px;
  }

  .login-social-btn {
    flex: 1;
    padding: 14px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.3s;
    font-size: 0.95rem;
  }

  .login-social-btn:hover:not(.loading) {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.3);
  }

  .login-social-btn.loading {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .login-divider {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 25px;
    color: rgba(255,255,255,0.5);
    font-size: 0.85rem;
  }

  .login-divider::before,
  .login-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.1);
  }

  .login-error {
    padding: 14px 16px;
    margin-bottom: 20px;
    background: rgba(230, 57, 70, 0.1);
    border: 1px solid rgba(230, 57, 70, 0.3);
    border-radius: 10px;
    color: #ff6b9d;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .login-field {
    margin-bottom: 20px;
  }

  .login-field label {
    display: block;
    color: white;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 0.9rem;
  }

  .login-field-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .login-forgot-btn {
    background: none;
    border: none;
    color: #ff6b9d;
    font-size: 0.85rem;
    cursor: pointer;
    font-weight: 600;
    text-decoration: underline;
    text-decoration-color: transparent;
    transition: text-decoration-color 0.2s;
  }

  .login-forgot-btn:hover {
    text-decoration-color: #ff6b9d;
  }

  .login-input {
    width: 100%;
    padding: 14px 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    color: white;
    font-size: 1rem;
    font-family: 'Poppins', sans-serif;
    outline: none;
    transition: all 0.3s;
    box-sizing: border-box;
  }

  .login-input:focus {
    border-color: #ff6b9d;
    background: rgba(255,255,255,0.08);
  }

  .login-input::placeholder {
    color: rgba(255,255,255,0.4);
  }

  .login-password-wrapper {
    position: relative;
  }

  .login-input-password {
    padding-right: 45px;
  }

  .login-toggle-password {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(255,255,255,0.6);
    cursor: pointer;
    font-size: 1.2rem;
  }

  .login-caps-warning {
    color: #f59e0b;
    font-size: 0.8rem;
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .login-remember {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 25px;
    cursor: pointer;
    color: rgba(255,255,255,0.7);
    font-size: 0.9rem;
  }

  .login-remember input {
    width: 18px;
    height: 18px;
    accent-color: #e63946;
    cursor: pointer;
  }

  .login-submit {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #ff6b9d, #e63946);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 10px 30px rgba(230, 57, 70, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .login-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 14px 35px rgba(230, 57, 70, 0.5);
  }

  .login-submit:disabled {
    background: rgba(230, 57, 70, 0.5);
    cursor: not-allowed;
    transform: none;
  }

  .login-spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255,255,255,0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .login-spinner-small {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .login-register {
    text-align: center;
    color: rgba(255,255,255,0.6);
    margin-top: 25px;
    font-size: 0.95rem;
  }

  .login-register a {
    color: #ff6b9d;
    text-decoration: none;
    font-weight: 600;
  }

  .login-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 30px;
    padding: 8px 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 50px;
    color: rgba(255,255,255,0.7);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  .login-back-btn:hover {
    background: rgba(255,255,255,0.1);
  }

  .login-forgot-icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(230, 57, 70, 0.2));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    margin-bottom: 25px;
  }

  /* ANIMATIONS */
  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -30px) scale(1.1); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* RESPONSIVE MOBILE */
  @media (max-width: 968px) {
    .login-left {
      display: none; /* Cache complètement le côté gauche sur mobile */
    }

    .login-right {
      flex: 1;
      padding: 30px 20px;
    }

    .login-form-container {
      max-width: 100%;
    }

    .login-form-title {
      font-size: 2rem;
    }
  }

  @media (max-width: 480px) {
    .login-right {
      padding: 20px 16px;
    }

    .login-form-title {
      font-size: 1.8rem;
    }

    .login-form-subtitle {
      font-size: 0.9rem;
    }

    .login-social {
      flex-direction: column;
    }

    .login-input {
      padding: 12px 14px;
      font-size: 0.95rem;
    }

    .login-submit {
      padding: 14px;
      font-size: 0.95rem;
    }
  }
`