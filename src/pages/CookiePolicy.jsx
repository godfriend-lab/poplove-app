import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CookiePolicy() {
  const [activeSection, setActiveSection] = useState('intro')
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false
  })

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      setActiveSection(id)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['intro', 'types', 'finalites', 'duree', 'gestion', 'contact']
      const scrollPosition = window.scrollY + 150

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handlePreferenceChange = (type) => {
    if (type === 'necessary') return // Toujours activé
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const savePreferences = () => {
    // Sauvegarder les préférences dans localStorage
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences))
    alert('✅ Vos préférences de cookies ont été enregistrées avec succès !')
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
          top: '-50%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255, 107, 157, 0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <span style={{ fontSize: '3rem' }}>🍪</span>
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
            Politique des Cookies
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
            <span style={{ color: '#ff6b9d', fontWeight: 600 }}>Transparence & Contrôle</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>|</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Dernière mise à jour : 18 Octobre 2026</span>
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
          
          {/* Navigation Sticky */}
          <div style={{
            position: 'sticky',
            top: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '20px 40px',
            borderBottom: '1px solid #f0f0f0',
            zIndex: 50,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center'
          }}>
            {[
              { id: 'intro', label: 'Introduction' },
              { id: 'types', label: 'Types de Cookies' },
              { id: 'finalites', label: 'Finalités' },
              { id: 'duree', label: 'Durée' },
              { id: 'gestion', label: 'Gestion' },
              { id: 'contact', label: 'Contact' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                style={{
                  padding: '8px 18px',
                  background: activeSection === item.id ? 'linear-gradient(135deg, #ff6b9d, #e63946)' : 'transparent',
                  color: activeSection === item.id ? 'white' : '#666',
                  border: activeSection === item.id ? 'none' : '1px solid #e0e0e0',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: activeSection === item.id ? 600 : 400,
                  transition: 'all 0.3s ease',
                  boxShadow: activeSection === item.id ? '0 4px 15px rgba(230, 57, 70, 0.3)' : 'none'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '50px 60px' }}>
            
            {/* INTRODUCTION */}
            <section id="intro" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>🍪</span> 1. Qu'est-ce qu'un Cookie ?
              </h3>
              <p style={{ color: '#4a4a68', marginBottom: '20px', fontSize: '1.05rem' }}>
                Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette, smartphone) lorsque vous visitez notre site web ou utilisez notre application. Les cookies nous permettent de reconnaître votre appareil et de mémoriser certaines informations sur votre visite.
              </p>
              
              <div style={{
                background: 'linear-gradient(135deg, #fff5f7 0%, #ffeef5 100%)',
                borderLeft: '4px solid #e63946',
                padding: '24px',
                borderRadius: '0 12px 12px 0',
                marginBottom: '20px'
              }}>
                <strong style={{ color: '#e63946', fontSize: '1.05rem', display: 'block', marginBottom: '8px' }}>
                  💡 Notre engagement :
                </strong>
                <span style={{ color: '#4a4a68', lineHeight: 1.7 }}>
                  Chez POPLOVE, nous utilisons les cookies de manière transparente et respectueuse de votre vie privée. Vous avez le contrôle total sur vos préférences de cookies et pouvez les modifier à tout moment.
                </span>
              </div>

              <p style={{ color: '#4a4a68' }}>
                Cette Politique des Cookies explique quels cookies nous utilisons, pourquoi nous les utilisons, et comment vous pouvez les gérer.
              </p>
            </section>

            {/* TYPES DE COOKIES */}
            <section id="types" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>📂</span> 2. Types de Cookies Utilisés
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { 
                    icon: '🔧', 
                    title: 'Cookies Nécessaires', 
                    color: '#25D366',
                    desc: 'Ces cookies sont essentiels au fonctionnement de l\'Application. Ils permettent des fonctions de base comme la navigation, l\'accès aux zones sécurisées et la gestion de votre session. Sans ces cookies, l\'Application ne peut pas fonctionner correctement.',
                    required: true
                  },
                  { 
                    icon: '⚙️', 
                    title: 'Cookies Fonctionnels', 
                    color: '#4A90E2',
                    desc: 'Ces cookies permettent à l\'Application de se souvenir des choix que vous faites (comme votre langue, votre région ou vos préférences de profil) et d\'améliorer votre expérience utilisateur.',
                    required: false
                  },
                  { 
                    icon: '📊', 
                    title: 'Cookies Analytiques', 
                    color: '#F5A623',
                    desc: 'Ces cookies nous aident à comprendre comment les utilisateurs interagissent avec l\'Application en collectant et en rapportant des informations de manière anonyme. Ils nous permettent d\'améliorer les performances et l\'expérience utilisateur.',
                    required: false
                  },
                  { 
                    icon: '📢', 
                    title: 'Cookies Marketing', 
                    color: '#E63946',
                    desc: 'Ces cookies sont utilisés pour suivre les visiteurs sur les sites web dans le but d\'afficher des publicités pertinentes et attrayantes pour l\'utilisateur individuel. Ils sont généralement placés par des réseaux publicitaires avec notre permission.',
                    required: false
                  }
                ].map((cookie, index) => (
                  <div key={index} style={{
                    background: '#f8f9fa',
                    padding: '24px',
                    borderRadius: '16px',
                    border: `2px solid ${cookie.color}`,
                    position: 'relative'
                  }}>
                    {cookie.required && (
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: '#25D366',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        OBLIGATOIRE
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                      <span style={{ fontSize: '2.5rem' }}>{cookie.icon}</span>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#1a1a2e', margin: '0 0 10px 0', fontSize: '1.2rem' }}>{cookie.title}</h4>
                        <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.95rem', lineHeight: 1.7 }}>{cookie.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FINALITÉS */}
            <section id="finalites" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>🎯</span> 3. Finalités des Cookies
              </h3>
              
              <div style={{
                background: '#f8f9fa',
                padding: '24px',
                borderRadius: '16px',
                marginBottom: '25px'
              }}>
                <h4 style={{ color: '#1a1a2e', marginTop: 0, marginBottom: '15px' }}>Nous utilisons les cookies pour :</h4>
                <ul style={{ color: '#4a4a68', paddingLeft: '20px', lineHeight: 2 }}>
                  <li><strong style={{ color: '#1a1a2e' }}>Authentification :</strong> Maintenir votre session connectée et sécurisée.</li>
                  <li><strong style={{ color: '#1a1a2e' }}>Personnalisation :</strong> Mémoriser vos préférences (langue, région, filtres de recherche).</li>
                  <li><strong style={{ color: '#1a1a2e' }}>Performance :</strong> Analyser l'utilisation de l'Application pour améliorer nos services.</li>
                  <li><strong style={{ color: '#1a1a2e' }}>Sécurité :</strong> Détecter les activités frauduleuses et protéger votre compte.</li>
                  <li><strong style={{ color: '#1a1a2e' }}>Publicité :</strong> Afficher des annonces pertinentes (uniquement avec votre consentement).</li>
                </ul>
              </div>

              <div style={{
                background: '#fff5f5',
                borderLeft: '4px solid #e63946',
                padding: '24px',
                borderRadius: '0 12px 12px 0'
              }}>
                <h4 style={{ color: '#e63946', marginTop: 0, marginBottom: '10px' }}>🔒 Cookies Tiers</h4>
                <p style={{ color: '#4a4a68', margin: 0, lineHeight: 1.7 }}>
                  Nous pouvons également utiliser des cookies de tiers de confiance, tels que <strong>Google Analytics</strong> pour l'analyse, <strong>Facebook Pixel</strong> pour la publicité, et <strong>KKiaPay</strong> pour le traitement des paiements. Ces tiers ont leurs propres politiques de confidentialité que nous vous encourageons à consulter.
                </p>
              </div>
            </section>

            {/* DURÉE */}
            <section id="duree" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>⏱️</span> 4. Durée de Conservation
              </h3>
              
              <div style={{
                overflowX: 'auto',
                borderRadius: '16px',
                border: '1px solid #e9ecef',
                marginBottom: '25px'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ background: '#fafafa' }}>
                      <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 700, color: '#e63946', borderBottom: '2px solid #ffeef5' }}>Type de Cookie</th>
                      <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 700, color: '#1a1a2e', borderBottom: '2px solid #ffeef5' }}>Durée</th>
                      <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 700, color: '#1a1a2e', borderBottom: '2px solid #ffeef5' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: 'Session', duree: 'Session', desc: 'Supprimés à la fermeture du navigateur' },
                      { type: 'Authentification', duree: '30 jours', desc: 'Maintiennent votre connexion active' },
                      { type: 'Préférences', duree: '1 an', desc: 'Mémorisent vos choix et paramètres' },
                      { type: 'Analytiques', duree: '2 ans', desc: 'Collectent des données d\'utilisation anonymes' },
                      { type: 'Marketing', duree: '90 jours', desc: 'Suivent les interactions publicitaires' }
                    ].map((row, index) => (
                      <tr key={index} style={{ 
                        background: index % 2 === 0 ? 'white' : '#fdfbfb',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#fff5f7'}
                      onMouseOut={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fdfbfb'}
                      >
                        <td style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', fontWeight: 600, color: '#1a1a2e' }}>{row.type}</td>
                        <td style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', color: '#e63946', fontWeight: 600 }}>{row.duree}</td>
                        <td style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', color: '#4a4a68' }}>{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* GESTION DES COOKIES */}
            <section id="gestion" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>⚙️</span> 5. Gestion de vos Préférences
              </h3>
              
              <p style={{ color: '#4a4a68', marginBottom: '25px', fontSize: '1.05rem' }}>
                Vous avez le contrôle total sur vos cookies. Vous pouvez modifier vos préférences à tout moment en utilisant le panneau ci-dessous :
              </p>

              <div style={{
                background: 'linear-gradient(135deg, #fff5f7 0%, #ffeef5 100%)',
                padding: '30px',
                borderRadius: '16px',
                border: '2px solid #ff6b9d'
              }}>
                <h4 style={{ color: '#1a1a2e', marginTop: 0, marginBottom: '20px', fontSize: '1.2rem' }}>🎛️ Centre de Préférences des Cookies</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {[
                    { type: 'necessary', label: 'Cookies Nécessaires', desc: 'Essentiels au fonctionnement de l\'Application', icon: '🔧' },
                    { type: 'functional', label: 'Cookies Fonctionnels', desc: 'Améliorent votre expérience utilisateur', icon: '️' },
                    { type: 'analytics', label: 'Cookies Analytiques', desc: 'Nous aident à comprendre l\'utilisation', icon: '' },
                    { type: 'marketing', label: 'Cookies Marketing', desc: 'Publicités personnalisées', icon: '📢' }
                  ].map((pref) => (
                    <div key={pref.type} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '20px',
                      background: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e9ecef'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                        <span style={{ fontSize: '1.5rem' }}>{pref.icon}</span>
                        <div>
                          <h5 style={{ color: '#1a1a2e', margin: '0 0 5px 0', fontSize: '1rem' }}>{pref.label}</h5>
                          <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.85rem' }}>{pref.desc}</p>
                        </div>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                        <input
                          type="checkbox"
                          checked={cookiePreferences[pref.type]}
                          onChange={() => handlePreferenceChange(pref.type)}
                          disabled={pref.type === 'necessary'}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: pref.type === 'necessary' ? 'not-allowed' : 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: cookiePreferences[pref.type] ? '#e63946' : '#ccc',
                          transition: '.4s',
                          borderRadius: '34px',
                          opacity: pref.type === 'necessary' ? 0.5 : 1
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '""',
                            height: '26px',
                            width: '26px',
                            left: cookiePreferences[pref.type] ? '30px' : '4px',
                            bottom: '4px',
                            backgroundColor: 'white',
                            transition: '.4s',
                            borderRadius: '50%'
                          }}></span>
                        </span>
                      </label>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '25px', textAlign: 'center' }}>
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
                      transition: 'all 0.3s'
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
                    💾 Enregistrer mes préférences
                  </button>
                </div>
              </div>

              <div style={{
                background: '#f8f9fa',
                padding: '24px',
                borderRadius: '16px',
                marginTop: '25px'
              }}>
                <h4 style={{ color: '#1a1a2e', marginTop: 0, marginBottom: '15px' }}>🌐 Gestion via votre Navigateur</h4>
                <p style={{ color: '#4a4a68', margin: '0 0 15px', lineHeight: 1.7 }}>
                  Vous pouvez également gérer les cookies directement via les paramètres de votre navigateur :
                </p>
                <ul style={{ color: '#4a4a68', paddingLeft: '20px', lineHeight: 2 }}>
                  <li><strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
                  <li><strong>Firefox :</strong> Options → Vie privée et sécurité → Cookies</li>
                  <li><strong>Safari :</strong> Préférences → Confidentialité → Cookies</li>
                  <li><strong>Edge :</strong> Paramètres → Cookies et autorisations de site</li>
                </ul>
              </div>
            </section>

            {/* CONTACT */}
            <section id="contact" style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}></span> 6. Questions et Contact
              </h3>
              
              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b2e 100%)',
                color: 'white',
                padding: '40px',
                borderRadius: '20px',
                textAlign: 'center'
              }}>
                <h4 style={{ color: '#ff6b9d', marginTop: 0, marginBottom: '15px', fontSize: '1.3rem' }}>Des questions sur nos cookies ?</h4>
                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '25px', lineHeight: 1.7 }}>
                  Notre équipe est à votre disposition pour répondre à toutes vos questions concernant notre utilisation des cookies et la protection de vos données.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <a href="mailto:privacy@poplove.app" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
                    color: 'white',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'transform 0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    ✉️ privacy@poplove.app
                  </a>
                  <Link to="/privacy" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 24px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'background 0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  >
                    📜 Politique de Confidentialité
                  </Link>
                </div>
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
              <span style={{ fontSize: '1.5rem' }}></span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 900, color: '#e63946' }}>POPLOVE</span>
            </div>
            <p style={{ color: '#888', fontSize: '0.9rem', margin: '0 0 5px' }}>
              Transparence et contrôle total sur vos données de navigation.
            </p>
            <p style={{ color: '#aaa', fontSize: '0.85rem', margin: 0 }}>
              Dakar, Sénégal • Abidjan, Côte d'Ivoire • Lomé, Togo
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}