import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const navigate = useNavigate()
  
  // États du formulaire
  const [view, setView] = useState('login') // 'login' | 'forgot'
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false })
  const [forgotEmail, setForgotEmail] = useState('')
  
  // États UI
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [error, setError] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  // Charger l'email sauvegardé si "Se souvenir de moi" était coché
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

  /* ================= CONNEXION EMAIL ================= */
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

      // Gestion du "Se souvenir de moi"
      if (formData.rememberMe) {
        localStorage.setItem('poplove_remember_email', formData.email.trim())
      } else {
        localStorage.removeItem('poplove_remember_email')
      }

      // Redirection vers le dashboard
      navigate('/dashboard')
    } catch (err) {
      console.error('Erreur de connexion:', err)
      if (err.message.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect. Vérifiez vos informations.')
      } else if (err.message.includes('Email not confirmed')) {
        setError('Veuillez vérifier votre email pour activer votre compte.')
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.')
      }
      setFormData(prev => ({ ...prev, password: '' })) // Vider le mot de passe pour sécurité
    } finally {
      setLoading(false)
    }
  }

  /* ================= CONNEXION SOCIALE ================= */
  const handleSocialLogin = async (provider) => {
    if (loading || socialLoading) return
    setSocialLoading(provider)
    setError('')

    try {
      const { error: supabaseError } = await supabase.auth.signInWithOAuth({
        provider: provider, // 'google' ou 'apple'
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      if (supabaseError) throw supabaseError
    } catch (err) {
      console.error(`Erreur ${provider}:`, err)
      setError(`La connexion avec ${provider === 'google' ? 'Google' : 'Apple'} a échoué.`)
    } finally {
      setSocialLoading('')
    }
  }

  /* ================= MOT DE PASSE OUBLIÉ ================= */
  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setError('Veuillez entrer une adresse email valide.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`, // Tu devras créer cette page plus tard
      })

      if (supabaseError) throw supabaseError
      
      setForgotSent(true)
    } catch (err) {
      console.error('Erreur reset:', err)
      setError("Impossible d'envoyer le lien. Vérifiez l'adresse email.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Poppins', sans-serif",
      background: '#0a0a0a',
      overflow: 'hidden'
    }}>
      
      {/* ============ CÔTÉ GAUCHE : VISUEL ============ */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        background: 'linear-gradient(135deg, #1a0a1f 0%, #2d1b2e 50%, #1a0a1f 100%)',
        overflow: 'hidden'
      }}>
        {/* Animations de fond */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(230, 57, 70, 0.3) 0%, transparent 70%)',
          borderRadius: '50%', animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(255, 107, 157, 0.2) 0%, transparent 70%)',
          borderRadius: '50%', animation: 'float 10s ease-in-out infinite reverse'
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 2, marginBottom: '60px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '2.5rem' }}>💕</span>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '2px'
            }}>
              POPLOVE
            </span>
          </Link>
        </div>

        {/* Contenu */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px' }}>
          <div style={{
            display: 'inline-block', padding: '8px 20px', background: 'rgba(230, 57, 70, 0.2)',
            border: '1px solid rgba(230, 57, 70, 0.4)', borderRadius: '50px', color: '#ff6b9d',
            fontSize: '0.9rem', fontWeight: 600, marginBottom: '30px', backdropFilter: 'blur(10px)'
          }}>
            💌 Bon retour parmi nous
          </div>
          
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 4vw, 4rem)',
            color: 'white', lineHeight: 1.1, margin: '0 0 25px 0', fontWeight: 900
          }}>
            Votre histoire
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              continue ici
            </span>
          </h1>
          
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', lineHeight: 1.7, margin: '0 0 40px 0' }}>
            Retrouvez vos matchs, vos conversations et les personnes qui comptent pour vous.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { icon: '🔒', title: 'Connexion sécurisée', desc: 'Chiffrement de bout en bout' },
              { icon: '⚡', title: 'Accès immédiat', desc: 'Vos matchs s\'affichent instantanément' },
              { icon: '🌍', title: '50 000+ membres', desc: 'Une communauté active et bienveillante' }
            ].map((feature, index) => (
              <div key={index} style={{
                display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  width: '45px', height: '45px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(230, 57, 70, 0.2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0
                }}>
                  {feature.icon}
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: '3px' }}>{feature.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ CÔTÉ DROIT : FORMULAIRE ============ */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px', background: '#0a0a0a', position: 'relative', overflow: 'auto'
      }}>
        {/* Grille décorative */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `linear-gradient(rgba(230, 57, 70, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(230, 57, 70, 0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px', pointerEvents: 'none'
        }} />

        <div style={{ width: '100%', maxWidth: '450px', position: 'relative', zIndex: 2 }}>
          
          {/* VUE : CONNEXION */}
          {view === 'login' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: 'white', margin: '0 0 10px 0', fontWeight: 900 }}>
                Connexion
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 30px 0', fontSize: '1rem' }}>
                Heureux de vous revoir. Connectez-vous pour accéder à votre compte.
              </p>

              {/* Boutons Sociaux */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '25px' }}>
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>ou par email</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              </div>

              {/* Message d'erreur global */}
              {error && (
                <div style={{
                  padding: '14px 16px', marginBottom: '20px', background: 'rgba(230, 57, 70, 0.1)',
                  border: '1px solid rgba(230, 57, 70, 0.3)', borderRadius: '10px',
                  color: '#ff6b9d', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                {/* Email */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: 'white', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Adresse email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nom@exemple.com"
                    required
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = '#ff6b9d'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                  />
                </div>

                {/* Mot de passe */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>Mot de passe</label>
                    <button type="button" onClick={() => setView('forgot')} style={{
                      background: 'none', border: 'none', color: '#ff6b9d', fontSize: '0.85rem',
                      cursor: 'pointer', fontWeight: 600, padding: 0, textDecoration: 'underline', textDecorationColor: 'transparent',
                      transition: 'text-decoration-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.textDecorationColor = '#ff6b9d'}
                    onMouseOut={(e) => e.currentTarget.style.textDecorationColor = 'transparent'}
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      placeholder="••••••••"
                      required
                      style={{ ...inputStyle, paddingRight: '45px' }}
                      onFocus={(e) => { e.target.style.borderColor = '#ff6b9d'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '1.2rem'
                    }}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {capsLock && (
                    <p style={{ color: '#f59e0b', fontSize: '0.8rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      ⚠️ Verrouillage des majuscules activé
                    </p>
                  )}
                </div>

                {/* Se souvenir de moi */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px', accentColor: '#e63946', cursor: 'pointer' }}
                  />
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Rester connecté sur cet appareil</span>
                </label>

                {/* Bouton Submit */}
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '16px',
                  background: loading ? 'rgba(230, 57, 70, 0.5)' : 'linear-gradient(135deg, #ff6b9d, #e63946)',
                  color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
                  boxShadow: loading ? 'none' : '0 10px 30px rgba(230, 57, 70, 0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                }}>
                  {loading ? (
                    <><div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> Connexion...</>
                  ) : 'Se connecter 💕'}
                </button>
              </form>

              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginTop: '25px', fontSize: '0.95rem' }}>
                Pas encore de compte ?{' '}
                <Link to="/register" style={{ color: '#ff6b9d', textDecoration: 'none', fontWeight: 600 }}>
                  Créer un compte
                </Link>
              </p>
            </div>
          )}

          {/* VUE : MOT DE PASSE OUBLIÉ */}
          {view === 'forgot' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <button type="button" onClick={() => { setView('login'); setError(''); setForgotSent(false); }} style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px',
                padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                ← Retour à la connexion
              </button>

              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(230, 57, 70, 0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '25px' }}>
                🔐
              </div>

              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: 'white', margin: '0 0 10px 0', fontWeight: 900 }}>
                {forgotSent ? 'Vérifiez votre boîte mail' : 'Mot de passe oublié ?'}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 30px 0', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {forgotSent 
                  ? `Si un compte existe pour ${forgotEmail}, vous recevrez un lien de réinitialisation dans quelques instants.`
                  : 'Saisissez votre adresse email. Nous vous enverrons un lien sécurisé pour choisir un nouveau mot de passe.'}
              </p>

              {error && (
                <div style={{ padding: '14px 16px', marginBottom: '20px', background: 'rgba(230, 57, 70, 0.1)', border: '1px solid rgba(230, 57, 70, 0.3)', borderRadius: '10px', color: '#ff6b9d', fontSize: '0.9rem' }}>
                  ⚠️ {error}
                </div>
              )}

              {!forgotSent ? (
                <form onSubmit={handleForgotPassword}>
                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', color: 'white', fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>Adresse email</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => { setForgotEmail(e.target.value); if (error) setError('') }}
                      placeholder="nom@exemple.com"
                      required
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = '#ff6b9d'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.05)' }}
                    />
                  </div>
                  <button type="submit" disabled={loading} style={{
                    width: '100%', padding: '16px',
                    background: loading ? 'rgba(230, 57, 70, 0.5)' : 'linear-gradient(135deg, #ff6b9d, #e63946)',
                    color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
                    boxShadow: loading ? 'none' : '0 10px 30px rgba(230, 57, 70, 0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                  }}>
                    {loading ? (
                      <><div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> Envoi en cours...</>
                    ) : 'Envoyer le lien de réinitialisation 🔗'}
                  </button>
                </form>
              ) : (
                <button type="button" onClick={() => { setView('login'); setForgotSent(false); setForgotEmail('') }} style={{
                  width: '100%', padding: '16px', background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
                  color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 10px 30px rgba(230, 57, 70, 0.4)'
                }}>
                  Retour à la connexion
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
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
      `}</style>
    </div>
  )
}

/* ================= COMPOSANTS AUXILIAIRES ================= */

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: 'white',
  fontSize: '1rem',
  fontFamily: "'Poppins', sans-serif",
  outline: 'none',
  transition: 'all 0.3s',
  boxSizing: 'border-box'
}

function SocialButton({ label, loading, onClick, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{
        flex: 1, padding: '14px', background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
        color: 'white', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        transition: 'all 0.3s', fontSize: '0.95rem', opacity: loading ? 0.7 : 1
      }}
      onMouseOver={(e) => {
        if (!loading) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
        }
      }}
      onMouseOut={(e) => {
        if (!loading) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
        }
      }}
    >
      {loading ? (
        <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      ) : icon}
      {label}
    </button>
  )
}