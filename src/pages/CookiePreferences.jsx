import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CookiePreferences() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  })

  const [saved, setSaved] = useState(false)
  const [expandedCookie, setExpandedCookie] = useState(null)

  // Charger les préférences sauvegardées
  useEffect(() => {
    const savedPrefs = localStorage.getItem('cookiePreferences')
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs))
    }
  }, [])

  const handleToggle = (type) => {
    if (type === 'necessary') return
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
    setSaved(false)
  }

  const acceptAll = () => {
    setPreferences({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    })
    setSaved(false)
  }

  const rejectAll = () => {
    setPreferences({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    })
    setSaved(false)
  }

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const cookieDetails = {
    necessary: [
      { name: 'session_id', provider: 'POPLOVE', duration: 'Session', purpose: 'Maintient votre session de connexion active' },
      { name: 'csrf_token', provider: 'POPLOVE', duration: 'Session', purpose: 'Protection contre les attaques CSRF' },
      { name: 'auth_token', provider: 'POPLOVE', duration: '30 jours', purpose: 'Authentification sécurisée de l\'utilisateur' }
    ],
    functional: [
      { name: 'language_pref', provider: 'POPLOVE', duration: '1 an', purpose: 'Mémorise votre langue préférée' },
      { name: 'theme_pref', provider: 'POPLOVE', duration: '1 an', purpose: 'Mémorise vos préférences d\'affichage' },
      { name: 'location_pref', provider: 'POPLOVE', duration: '30 jours', purpose: 'Mémorise votre région pour les recommandations' }
    ],
    analytics: [
      { name: '_ga', provider: 'Google Analytics', duration: '2 ans', purpose: 'Identifie les utilisateurs uniques pour les statistiques' },
      { name: '_gid', provider: 'Google Analytics', duration: '24 heures', purpose: 'Distingue les utilisateurs sur 24h' },
      { name: '_gat', provider: 'Google Analytics', duration: '1 minute', purpose: 'Limite le taux de requêtes' }
    ],
    marketing: [
      { name: '_fbp', provider: 'Facebook', duration: '3 mois', purpose: 'Suivi des conversions publicitaires Facebook' },
      { name: 'ttclid', provider: 'TikTok', duration: '7 jours', purpose: 'Suivi des conversions publicitaires TikTok' },
      { name: 'kkp_session', provider: 'KKiaPay', duration: 'Session', purpose: 'Traitement sécurisé des paiements' }
    ]
  }

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(180deg, #fdfbfb 0%, #f4f6f8 100%)',
      minHeight: '100vh',
      color: '#1a1a2e',
      lineHeight: 1.8
    }}>
      {/* ============ HEADER HERO ============ */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b2e 100%)',
        padding: '80px 20px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255, 107, 157, 0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <span style={{ fontSize: '3rem' }}>⚙️</span>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              letterSpacing: '1px'
            }}>
              POPLOVE
            </h1>
            <span style={{ fontSize: '3rem' }}>🍪</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            color: 'white',
            fontWeight: 300,
            margin: '10px 0 20px',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            Préférences des Cookies
          </h2>
          <div style={{
            display: 'inline-flex',
            gap: '20px',
            background: 'rgba(255,255,255,0.1)',
            padding: '10px 25px',
            borderRadius: '50px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <span style={{ color: '#ff6b9d', fontWeight: 600 }}>Contrôle Total</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>|</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Gérez vos cookies en temps réel</span>
          </div>
        </div>
      </div>

      {/* ============ CONTENU PRINCIPAL ============ */}
      <div style={{ maxWidth: '1000px', margin: '-40px auto 60px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          
          <div style={{ padding: '50px 60px' }}>
            
            {/* INTRODUCTION */}
            <section style={{ marginBottom: '50px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '20px', fontWeight: 700 }}>
                🎛️ Centre de Contrôle des Cookies
              </h3>
              <p style={{ color: '#4a4a68', fontSize: '1.05rem', lineHeight: 1.8 }}>
                Bienvenue dans votre centre de contrôle des cookies. Ici, vous pouvez personnaliser précisément quels types de cookies vous autorisez sur POPLOVE. Vous pouvez modifier ces préférences à tout moment.
              </p>
            </section>

            {/* PANNEAU DE CONTRÔLE PRINCIPAL */}
            <section style={{ marginBottom: '50px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #fff5f7 0%, #ffeef5 100%)',
                padding: '40px',
                borderRadius: '20px',
                border: '2px solid #ff6b9d'
              }}>
                <h4 style={{ color: '#1a1a2e', marginTop: 0, marginBottom: '30px', fontSize: '1.4rem', textAlign: 'center' }}>
                  🍪 Choisissez vos préférences de cookies
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { 
                      type: 'necessary', 
                      label: 'Cookies Nécessaires', 
                      icon: '',
                      color: '#25D366',
                      desc: 'Essentiels au fonctionnement de l\'Application. Ne peuvent pas être désactivés.',
                      required: true
                    },
                    { 
                      type: 'functional', 
                      label: 'Cookies Fonctionnels', 
                      icon: '️',
                      color: '#4A90E2',
                      desc: 'Mémorisent vos préférences (langue, région, thème) pour une expérience personnalisée.',
                      required: false
                    },
                    { 
                      type: 'analytics', 
                      label: 'Cookies Analytiques', 
                      icon: '📊',
                      color: '#F5A623',
                      desc: 'Nous aident à comprendre comment vous utilisez l\'Application pour améliorer nos services.',
                      required: false
                    },
                    { 
                      type: 'marketing', 
                      label: 'Cookies Marketing', 
                      icon: '📢',
                      color: '#E63946',
                      desc: 'Permettent d\'afficher des publicités personnalisées sur d\'autres sites et réseaux sociaux.',
                      required: false
                    }
                  ].map((pref) => (
                    <div key={pref.type} style={{
                      background: 'white',
                      padding: '25px',
                      borderRadius: '16px',
                      border: `2px solid ${preferences[pref.type] ? pref.color : '#e9ecef'}`,
                      transition: 'all 0.3s ease',
                      boxShadow: preferences[pref.type] ? `0 4px 15px ${pref.color}22` : 'none'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                          <span style={{ fontSize: '2.5rem' }}>{pref.icon}</span>
                          <div>
                            <h5 style={{ color: '#1a1a2e', margin: '0 0 5px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {pref.label}
                              {pref.required && (
                                <span style={{
                                  background: '#25D366',
                                  color: 'white',
                                  padding: '3px 10px',
                                  borderRadius: '20px',
                                  fontSize: '0.7rem',
                                  fontWeight: 600
                                }}>
                                  OBLIGATOIRE
                                </span>
                              )}
                            </h5>
                            <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.9rem' }}>{pref.desc}</p>
                          </div>
                        </div>
                        
                        {/* Toggle Switch */}
                        <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px', flexShrink: 0 }}>
                          <input
                            type="checkbox"
                            checked={preferences[pref.type]}
                            onChange={() => handleToggle(pref.type)}
                            disabled={pref.required}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: pref.required ? 'not-allowed' : 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: preferences[pref.type] ? pref.color : '#ccc',
                            transition: '.4s',
                            borderRadius: '34px',
                            opacity: pref.required ? 0.6 : 1
                          }}>
                            <span style={{
                              position: 'absolute',
                              content: '""',
                              height: '26px',
                              width: '26px',
                              left: preferences[pref.type] ? '30px' : '4px',
                              bottom: '4px',
                              backgroundColor: 'white',
                              transition: '.4s',
                              borderRadius: '50%',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}></span>
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Boutons d'action */}
                <div style={{ 
                  display: 'flex', 
                  gap: '15px', 
                  marginTop: '30px', 
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={rejectAll}
                    style={{
                      padding: '14px 30px',
                      background: 'white',
                      color: '#666',
                      border: '2px solid #e0e0e0',
                      borderRadius: '50px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#e63946'
                      e.currentTarget.style.color = '#e63946'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0'
                      e.currentTarget.style.color = '#666'
                    }}
                  >
                     Tout refuser
                  </button>
                  
                  <button
                    onClick={savePreferences}
                    style={{
                      padding: '14px 40px',
                      background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(230, 57, 70, 0.3)',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(230, 57, 70, 0.4)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(230, 57, 70, 0.3)'
                    }}
                  >
                    {saved ? '✅ Préférences enregistrées !' : '💾 Enregistrer mes choix'}
                  </button>
                  
                  <button
                    onClick={acceptAll}
                    style={{
                      padding: '14px 30px',
                      background: 'linear-gradient(135deg, #25D366, #128C7E)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.4)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)'
                    }}
                  >
                    ✅ Tout accepter
                  </button>
                </div>

                {/* Message de confirmation */}
                {saved && (
                  <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: '#25D36622',
                    border: '2px solid #25D366',
                    borderRadius: '12px',
                    textAlign: 'center',
                    color: '#25D366',
                    fontWeight: 600,
                    animation: 'fadeIn 0.3s ease'
                  }}>
                    ✅ Vos préférences ont été enregistrées avec succès ! Elles seront appliquées immédiatement.
                  </div>
                )}
              </div>
            </section>

            {/* DÉTAILS DES COOKIES */}
            <section style={{ marginBottom: '50px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700 }}>
                📋 Détails des Cookies Utilisés
              </h3>
              <p style={{ color: '#4a4a68', marginBottom: '30px' }}>
                Cliquez sur chaque catégorie pour voir la liste détaillée des cookies utilisés :
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[
                  { type: 'necessary', label: 'Cookies Nécessaires', color: '#25D366', icon: '' },
                  { type: 'functional', label: 'Cookies Fonctionnels', color: '#4A90E2', icon: '⚙️' },
                  { type: 'analytics', label: 'Cookies Analytiques', color: '#F5A623', icon: '📊' },
                  { type: 'marketing', label: 'Cookies Marketing', color: '#E63946', icon: '📢' }
                ].map((category) => (
                  <div key={category.type} style={{
                    background: '#f8f9fa',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: `2px solid ${expandedCookie === category.type ? category.color : '#e9ecef'}`,
                    transition: 'all 0.3s ease'
                  }}>
                    <button
                      onClick={() => setExpandedCookie(expandedCookie === category.type ? null : category.type)}
                      style={{
                        width: '100%',
                        padding: '20px 25px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: '#1a1a2e'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
                        {category.label}
                        <span style={{
                          background: category.color,
                          color: 'white',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '0.75rem'
                        }}>
                          {cookieDetails[category.type].length} cookies
                        </span>
                      </span>
                      <span style={{
                        fontSize: '1.5rem',
                        transform: expandedCookie === category.type ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s'
                      }}>
                        ▼
                      </span>
                    </button>
                    
                    {expandedCookie === category.type && (
                      <div style={{ padding: '0 25px 25px' }}>
                        <div style={{
                          background: 'white',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid #e9ecef'
                        }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                              <tr style={{ background: '#fafafa' }}>
                                <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: 700, color: category.color, borderBottom: '2px solid #f0f0f0' }}>Nom</th>
                                <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: 700, color: '#1a1a2e', borderBottom: '2px solid #f0f0f0' }}>Fournisseur</th>
                                <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: 700, color: '#1a1a2e', borderBottom: '2px solid #f0f0f0' }}>Durée</th>
                                <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: 700, color: '#1a1a2e', borderBottom: '2px solid #f0f0f0' }}>Finalité</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cookieDetails[category.type].map((cookie, index) => (
                                <tr key={index} style={{
                                  background: index % 2 === 0 ? 'white' : '#fdfbfb'
                                }}>
                                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #f0f0f0', fontFamily: 'monospace', color: category.color, fontWeight: 600 }}>{cookie.name}</td>
                                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #f0f0f0', color: '#4a4a68' }}>{cookie.provider}</td>
                                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #f0f0f0', color: '#4a4a68' }}>{cookie.duration}</td>
                                  <td style={{ padding: '12px 15px', borderBottom: '1px solid #f0f0f0', color: '#4a4a68' }}>{cookie.purpose}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* RÉSUMÉ DES CHOIX */}
            <section style={{ marginBottom: '50px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700 }}>
                📊 Résumé de Vos Choix Actuels
              </h3>
              
              <div style={{
                background: '#f8f9fa',
                padding: '30px',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  {[
                    { type: 'necessary', label: 'Nécessaires', color: '#25D366' },
                    { type: 'functional', label: 'Fonctionnels', color: '#4A90E2' },
                    { type: 'analytics', label: 'Analytiques', color: '#F5A623' },
                    { type: 'marketing', label: 'Marketing', color: '#E63946' }
                  ].map((item) => (
                    <div key={item.type} style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '12px',
                      textAlign: 'center',
                      border: `2px solid ${preferences[item.type] ? item.color : '#e9ecef'}`
                    }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        margin: '0 auto 15px',
                        borderRadius: '50%',
                        background: preferences[item.type] ? item.color : '#e9ecef',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        color: 'white',
                        transition: 'all 0.3s'
                      }}>
                        {preferences[item.type] ? '✓' : '✗'}
                      </div>
                      <h5 style={{ color: '#1a1a2e', margin: '0 0 5px 0' }}>{item.label}</h5>
                      <p style={{ 
                        color: preferences[item.type] ? item.color : '#999', 
                        margin: 0, 
                        fontWeight: 600,
                        fontSize: '0.9rem'
                      }}>
                        {preferences[item.type] ? 'Activé' : 'Désactivé'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* LIENS UTILES */}
            <section style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700 }}>
                🔗 Liens Utiles
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <Link to="/cookies" style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #fff5f7 0%, #ffeef5 100%)',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  border: '2px solid #ff6b9d',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(230, 57, 70, 0.15)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📜</div>
                  <h4 style={{ color: '#e63946', margin: '0 0 10px 0' }}>Politique des Cookies</h4>
                  <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.9rem' }}>En savoir plus sur notre utilisation des cookies</p>
                </Link>

                <Link to="/privacy" style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #fff5f7 0%, #ffeef5 100%)',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  border: '2px solid #ff6b9d',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(230, 57, 70, 0.15)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔒</div>
                  <h4 style={{ color: '#e63946', margin: '0 0 10px 0' }}>Politique de Confidentialité</h4>
                  <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.9rem' }}>Comment nous protégeons vos données personnelles</p>
                </Link>

                <Link to="/terms" style={{
                  padding: '25px',
                  background: 'linear-gradient(135deg, #fff5f7 0%, #ffeef5 100%)',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  border: '2px solid #ff6b9d',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(230, 57, 70, 0.15)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚖️</div>
                  <h4 style={{ color: '#e63946', margin: '0 0 10px 0' }}>Conditions d'Utilisation</h4>
                  <p style={{ color: '#4a4a68', margin: '0 0 10px 0', fontSize: '0.9rem' }}>Règles et obligations de notre service</p>
                </Link>
              </div>
            </section>

          </div>

          {/* ============ FOOTER INTERNE DE LA PAGE ============ */}
          <div style={{
            background: '#f8f9fa',
            padding: '40px 60px',
            borderTop: '1px solid #e9ecef',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <span style={{ fontSize: '1.5rem' }}>💕</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 900, color: '#e63946' }}>POPLOVE</span>
            </div>
            <p style={{ color: '#888', fontSize: '0.9rem', margin: '0 0 5px' }}>
              Vous avez le contrôle total sur vos données de navigation.
            </p>
            <p style={{ color: '#aaa', fontSize: '0.85rem', margin: 0 }}>
              Dakar, Sénégal • Abidjan, Côte d'Ivoire • Lomé, Togo
            </p>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}