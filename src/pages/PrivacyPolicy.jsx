import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('intro')

  // Défilement fluide vers la section
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setActiveSection(id)
    }
  }

  // Détection automatique de la section active au scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['intro', 'collecte', 'utilisation', 'partage', 'droits', 'securite', 'contact']
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
            <span style={{ fontSize: '3rem' }}>🔒</span>
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
            <span style={{ fontSize: '3rem' }}>🔒</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            color: 'white',
            fontWeight: 300,
            margin: '10px 0 20px',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            Politique de Confidentialité
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
            <span style={{ color: '#ff6b9d', fontWeight: 600 }}>v2.1</span>
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
          
          {/* Navigation Sticky Intérieure */}
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
              { id: 'collecte', label: 'Données Collectées' },
              { id: 'utilisation', label: 'Utilisation' },
              { id: 'partage', label: 'Partage' },
              { id: 'droits', label: 'Vos Droits' },
              { id: 'securite', label: 'Sécurité' },
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
                <span style={{ color: '#e63946' }}>👋</span> 1. Introduction
              </h3>
              <p style={{ color: '#4a4a68', marginBottom: '20px', fontSize: '1.05rem' }}>
                Chez <strong style={{ color: '#e63946' }}>POPLOVE</strong>, votre vie privée est notre priorité absolue. Cette Politique de Confidentialité explique de manière transparente quelles données nous collectons, comment nous les utilisons, et les droits dont vous disposez sur vos informations personnelles.
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
                  Nous ne vendons jamais vos données personnelles à des tiers. Vos informations sont utilisées exclusivement pour vous connecter avec des personnes compatibles et garantir la sécurité de notre communauté.
                </span>
              </div>
            </section>

            {/* DONNÉES COLLECTÉES */}
            <section id="collecte" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>📂</span> 2. Données que nous collectons
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                {[
                  { icon: '👤', title: 'Données d\'inscription', desc: 'Prénom, âge, genre, adresse e-mail vérifiée et numéro de téléphone.' },
                  { icon: '📸', title: 'Données de profil', desc: 'Photos, biographie, centres d\'intérêt, et préférences de recherche.' },
                  { icon: '📍', title: 'Géolocalisation', desc: 'Votre position approximative (ville) pour vous proposer des profils à proximité. (Désactivable dans les paramètres).' },
                  { icon: '💳', title: 'Données de paiement', desc: 'Informations de transaction traitées de manière sécurisée par nos partenaires (ex: KKiaPay, Apple, Google). Nous ne stockons pas vos numéros de carte.' }
                ].map((item, index) => (
                  <div key={index} style={{
                    background: '#f8f9fa',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid #e9ecef',
                    transition: 'transform 0.3s, box-shadow 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)'
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(230, 57, 70, 0.1)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{item.icon}</div>
                    <h4 style={{ color: '#1a1a2e', margin: '0 0 10px 0', fontSize: '1.1rem' }}>{item.title}</h4>
                    <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{
                background: '#fff5f5',
                border: '1px solid #ffd6e7',
                padding: '24px',
                borderRadius: '16px'
              }}>
                <h4 style={{ color: '#e63946', marginTop: 0, marginBottom: '10px' }}>⚠️ Données Sensibles</h4>
                <p style={{ color: '#4a4a68', margin: 0, lineHeight: 1.7, fontSize: '0.95rem' }}>
                  En tant qu'application de rencontre, nous pouvons traiter des données sensibles (comme votre orientation sexuelle) <strong>uniquement si vous choisissez de les partager volontairement</strong> dans votre profil. Conformément aux lois sur la protection des données, nous traitons ces informations avec le plus haut niveau de confidentialité et uniquement pour vous proposer des matchs pertinents.
                </p>
              </div>
            </section>

            {/* UTILISATION DES DONNÉES */}
            <section id="utilisation" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>⚙️</span> 3. Comment nous utilisons vos données
              </h3>
              <ul style={{ color: '#4a4a68', paddingLeft: '20px', lineHeight: 2 }}>
                <li><strong style={{ color: '#1a1a2e' }}>Fournir le service :</strong> Créer votre profil, vous montrer des célibataires compatibles et permettre la communication via WhatsApp.</li>
                <li><strong style={{ color: '#1a1a2e' }}>Sécurité et modération :</strong> Détecter les faux profils, les arnaques et les comportements abusifs pour protéger notre communauté.</li>
                <li><strong style={{ color: '#1a1a2e' }}>Amélioration du produit :</strong> Analyser les tendances d'utilisation (de manière anonymisée) pour améliorer l'expérience utilisateur.</li>
                <li><strong style={{ color: '#1a1a2e' }}>Communications :</strong> Vous envoyer des notifications importantes concernant votre compte ou des mises à jour du service (vous pouvez vous désinscrire à tout moment).</li>
              </ul>
            </section>

            {/* PARTAGE DES DONNÉES */}
            <section id="partage" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>🤝</span> 4. Partage des données avec des tiers
              </h3>
              <p style={{ color: '#4a4a68', marginBottom: '20px' }}>
                Nous ne vendons pas vos données. Nous partageons uniquement les informations strictement nécessaires avec des partenaires de confiance pour faire fonctionner l'application :
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[
                  { name: 'Prestataires de paiement', desc: 'KKiaPay, Apple App Store, Google Play Store (pour traiter vos achats de crédits de manière sécurisée).' },
                  { name: 'Hébergeurs cloud', desc: 'Des fournisseurs de services cloud sécurisés (ex: Supabase, AWS) pour stocker vos données avec un chiffrement de bout en bout.' },
                  { name: 'Obligations légales', desc: 'Les autorités compétentes uniquement si nous y sommes légalement contraints (par exemple, en cas de menace grave ou d\'activité illégale avérée).' }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px',
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '12px'
                  }}>
                    <span style={{ color: '#e63946', fontSize: '1.2rem', marginTop: '2px' }}>✓</span>
                    <div>
                      <strong style={{ color: '#1a1a2e', display: 'block', marginBottom: '5px' }}>{item.name}</strong>
                      <span style={{ color: '#4a4a68', fontSize: '0.95rem' }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* VOS DROITS */}
            <section id="droits" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>⚖️</span> 5. Vos droits sur vos données
              </h3>
              <p style={{ color: '#4a4a68', marginBottom: '20px' }}>
                Conformément aux lois applicables (y compris le RGPD pour les utilisateurs concernés et les lois locales sur la protection des données en Afrique de l'Ouest), vous disposez des droits suivants :
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                {[
                  { title: 'Droit d\'accès', desc: 'Demander une copie de toutes les données que nous détenons sur vous.' },
                  { title: 'Droit de rectification', desc: 'Modifier ou mettre à jour vos informations inexactes ou incomplètes.' },
                  { title: 'Droit à l\'effacement', desc: 'Demander la suppression définitive de votre compte et de vos données (via les paramètres de l\'app).' },
                  { title: 'Droit d\'opposition', desc: 'Vous opposer au traitement de vos données à des fins de marketing direct.' }
                ].map((right, index) => (
                  <div key={index} style={{
                    padding: '20px',
                    background: 'white',
                    border: '1px solid #e9ecef',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                  }}>
                    <h4 style={{ color: '#e63946', margin: '0 0 10px 0', fontSize: '1rem' }}>{right.title}</h4>
                    <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>{right.desc}</p>
                  </div>
                ))}
              </div>
              <p style={{ color: '#4a4a68', marginTop: '20px', fontSize: '0.95rem' }}>
                Pour exercer ces droits, contactez-nous à <a href="mailto:privacy@poplove.app" style={{ color: '#e63946', fontWeight: 600, textDecoration: 'none' }}>privacy@poplove.app</a>. Nous nous engageons à répondre sous 30 jours.
              </p>
            </section>

            {/* SÉCURITÉ */}
            <section id="securite" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>🛡️</span> 6. Sécurité et Conservation
              </h3>
              <p style={{ color: '#4a4a68', marginBottom: '20px' }}>
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles de niveau industriel (chiffrement des données, accès restreint, audits réguliers) pour protéger vos informations contre tout accès non autorisé, perte ou altération.
              </p>
              <p style={{ color: '#4a4a68' }}>
                <strong style={{ color: '#1a1a2e' }}>Durée de conservation :</strong> Nous conservons vos données aussi longtemps que votre compte est actif. Si vous supprimez votre compte, vos données personnelles sont anonymisées ou supprimées sous 30 jours, sauf si la loi nous oblige à les conserver plus longtemps (par exemple, pour des raisons de prévention de la fraude).
              </p>
            </section>

            {/* CONTACT */}
            <section id="contact" style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>📬</span> 7. Contact et Délégué à la Protection des Données
              </h3>
              
              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b2e 100%)',
                color: 'white',
                padding: '40px',
                borderRadius: '20px',
                textAlign: 'center'
              }}>
                <h4 style={{ color: '#ff6b9d', marginTop: 0, marginBottom: '15px', fontSize: '1.3rem' }}>Une question sur vos données ?</h4>
                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '25px', lineHeight: 1.7 }}>
                  Notre équipe dédiée à la protection de la vie privée est à votre disposition pour répondre à toutes vos interrogations ou traiter vos demandes d'exercice de droits.
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
                  <Link to="/terms" style={{
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
                    📜 Voir les Conditions d'Utilisation
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
              <span style={{ fontSize: '1.5rem' }}>💕</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 900, color: '#e63946' }}>POPLOVE</span>
            </div>
            <p style={{ color: '#888', fontSize: '0.9rem', margin: '0 0 5px' }}>
              Engagement envers la transparence et la protection de vos données.
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