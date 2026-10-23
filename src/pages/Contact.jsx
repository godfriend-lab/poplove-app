import { useState } from 'react'
import { sendContactEmail } from '../lib/emailjs'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const subjectOptions = [
    { value: 'signalement', label: '🚨 Signalement', desc: 'Comportement abusif ou profil suspect' },
    { value: 'ambassadeur', label: '🌟 Programme Ambassadeur', desc: 'Postuler au programme' },
    { value: 'support', label: '🛠️ Support technique', desc: 'Problème avec l\'application' },
    { value: 'compte', label: '👤 Problème de compte', desc: 'Connexion, mot de passe' },
    { value: 'paiement', label: '💳 Problème de paiement', desc: 'Erreur KKiaPay, abonnement' },
    { value: 'facturation', label: '🧾 Facturation', desc: 'Reçus, historique des transactions' },
    { value: 'verification', label: '✅ Vérification', desc: 'Obtenir le badge de profil vérifié' },
    { value: 'confidentialite', label: '🔒 Confidentialité', desc: 'Protection des données, RGPD' },
    { value: 'partenariat', label: '🤝 Partenariat', desc: 'Collaboration, sponsoring, médias' },
    { value: 'suggestion', label: '💡 Suggestion', desc: 'Idées pour améliorer POPLOVE' },
    { value: 'bug', label: '🐛 Signaler un bug', desc: 'Erreur technique, crash' },
    { value: 'autre', label: '📩 Autre demande', desc: 'Toute autre question' }
  ]

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({ type: 'error', message: '⚠️ Veuillez remplir tous les champs obligatoires (*)' })
      return
    }

    if (!formData.email.includes('@')) {
      setStatus({ type: 'error', message: '⚠️ Veuillez entrer une adresse email valide' })
      return
    }

    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const result = await sendContactEmail(formData)
      
      if (result.success) {
        setStatus({ 
          type: 'success', 
          message: '✅ Votre message a été envoyé avec succès ! Nous vous répondrons dans les 24h.' 
        })
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setStatus({ 
          type: 'error', 
          message: '❌ Une erreur est survenue. Veuillez réessayer.' 
        })
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: '❌ Erreur de connexion. Vérifiez votre internet.' 
      })
    } finally {
      setLoading(false)
    }
  }

  // Style commun pour les champs hyper-visibles
  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    background: '#f8fafc', // Fond très légèrement grisé pour contraster avec le blanc
    border: '2px solid #cbd5e1', // Bordure bien visible par défaut
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontFamily: "'Poppins', sans-serif",
    color: '#1a1a2e',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box'
  }

  const inputFocusStyle = {
    borderColor: '#e63946', // Bordure rouge POPLOVE au focus
    background: '#ffffff',
    boxShadow: '0 0 0 4px rgba(230, 57, 70, 0.15)' // Lueur rouge pour hyper-visibilité
  }

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(180deg, #fdfbfb 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      color: '#1a1a2e',
      lineHeight: 1.6
    }}>
      {/* ============ HEADER ============ */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b2e 100%)',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 15px 0'
        }}>
          💌 Contactez-Nous
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Une question ? Notre équipe est là pour vous aider rapidement.
        </p>
      </div>

      {/* ============ CONTENU ============ */}
      <div style={{ maxWidth: '1100px', margin: '-30px auto 60px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        
        {/* INFO CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {[
            { icon: '✉️', title: 'Email', value: 'support@poplove.app', desc: 'Réponse sous 24h' },
            { icon: '💬', title: 'WhatsApp', value: '+221 77 000 00 00', desc: 'Lun-Ven, 9h-18h' },
            { icon: '📍', title: 'Siège', value: 'Dakar, Sénégal', desc: 'Aussi à Abidjan & Lomé' }
          ].map((info, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '25px',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{info.icon}</div>
              <h3 style={{ color: '#e63946', margin: '0 0 5px 0', fontSize: '1.1rem', fontWeight: 700 }}>{info.title}</h3>
              <p style={{ color: '#1a1a2e', fontWeight: 700, margin: '0 0 5px 0', fontSize: '1rem' }}>{info.value}</p>
              <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>{info.desc}</p>
            </div>
          ))}
        </div>

        {/* FORMULAIRE + SIDEBAR */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '0',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          
          {/* ZONE FORMULAIRE */}
          <div style={{ padding: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', color: '#1a1a2e', marginBottom: '25px', fontWeight: 800 }}>
              ✉️ Envoyez-nous un message
            </h2>

            {status.message && (
              <div style={{
                padding: '16px 20px',
                borderRadius: '12px',
                marginBottom: '25px',
                background: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: status.type === 'success' ? '#166534' : '#991b1b',
                border: `2px solid ${status.type === 'success' ? '#86efac' : '#fca5a5'}`,
                fontWeight: 600,
                animation: 'fadeIn 0.3s ease'
              }}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', color: '#1a1a2e', fontWeight: 700, marginBottom: '8px', fontSize: '1rem' }}>
                    Nom complet <span style={{color: '#e63946'}}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    required
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#1a1a2e', fontWeight: 700, marginBottom: '8px', fontSize: '1rem' }}>
                    Email <span style={{color: '#e63946'}}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    required
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#1a1a2e', fontWeight: 700, marginBottom: '8px', fontSize: '1rem' }}>
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+221 77 000 00 00"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* SELECTEUR DE SUJET HYPER-VISIBLE */}
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', color: '#1a1a2e', fontWeight: 700, marginBottom: '12px', fontSize: '1rem' }}>
                  Sujet de votre demande <span style={{color: '#e63946'}}>*</span>
                </label>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '12px',
                  maxHeight: '350px',
                  overflowY: 'auto',
                  padding: '5px'
                }}>
                  {subjectOptions.map((option) => {
                    const isSelected = formData.subject === option.value;
                    return (
                      <label
                        key={option.value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '16px',
                          background: isSelected ? '#fff1f2' : '#f8fafc',
                          border: isSelected ? '3px solid #e63946' : '2px solid #cbd5e1',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 4px 12px rgba(230, 57, 70, 0.15)' : 'none'
                        }}
                      >
                        <input
                          type="radio"
                          name="subject"
                          value={option.value}
                          checked={isSelected}
                          onChange={handleChange}
                          style={{ accentColor: '#e63946', width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.95rem' }}>
                            {option.label}
                          </div>
                        </div>
                        {isSelected && (
                          <div style={{
                            background: '#e63946',
                            color: 'white',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 800
                          }}>✓</div>
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', color: '#1a1a2e', fontWeight: 700, marginBottom: '8px', fontSize: '1rem' }}>
                  Message <span style={{color: '#e63946'}}>*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Décrivez votre demande en détail..."
                  required
                  rows="5"
                  style={{...inputStyle, resize: 'vertical', minHeight: '120px'}}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: loading ? '#94a3b8' : 'linear-gradient(135deg, #ff6b9d, #e63946)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: loading ? 'none' : '0 8px 25px rgba(230, 57, 70, 0.3)'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(230, 57, 70, 0.4)'
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(230, 57, 70, 0.3)'
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={{ width: '22px', height: '22px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Envoi en cours...
                  </>
                ) : (
                  <>📤 Envoyer le message</>
                )}
              </button>
            </form>
          </div>

          {/* SIDEBAR INFOS (Fond sombre pour contraste) */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b2e 100%)',
            padding: '40px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h3 style={{ color: '#ff6b9d', marginTop: 0, marginBottom: '30px', fontSize: '1.4rem', fontWeight: 700 }}>
              📞 Autres moyens de contact
            </h3>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: 'white', marginBottom: '10px', fontSize: '1.1rem', fontWeight: 600 }}>🕐 Horaires de support</h4>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
                Lundi - Vendredi : 9h - 18h<br />
                Samedi : 10h - 14h<br />
                Dimanche : Fermé
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: 'white', marginBottom: '15px', fontSize: '1.1rem', fontWeight: 600 }}>🌍 Nos bureaux</h4>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.8 }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#ff6b9d' }}>🇸🇳 Dakar</strong><br />
                  Plateau, Rue de Thiong
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#ff6b9d' }}>🇨🇮 Abidjan</strong><br />
                  Cocody, Rue des Jardins
                </div>
                <div>
                  <strong style={{ color: '#ff6b9d' }}>🇹🇬 Lomé</strong><br />
                  Bè, Boulevard du 13 Janvier
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ color: '#ff6b9d', marginTop: 0, marginBottom: '10px', fontSize: '1rem', fontWeight: 700 }}>
                ⚡ Engagement
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                Nous nous engageons à répondre à toutes les demandes dans un délai de 24 heures ouvrables.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Scrollbar personnalisée pour la liste des sujets */
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  )
}