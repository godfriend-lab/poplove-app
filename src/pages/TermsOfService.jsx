import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('glossary')

  // Défilement fluide vers la section
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100 // Compensation pour la navbar sticky
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
      const sections = ['glossary', 'introduction', 'registration', 'payments', 'safety', 'content', 'privacy', 'liability']
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
        {/* Cercle décoratif en arrière-plan */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(230, 57, 70, 0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <span style={{ fontSize: '3rem' }}>💕</span>
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
            <span style={{ fontSize: '3rem' }}>💕</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            color: 'white',
            fontWeight: 300,
            margin: '10px 0 20px',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            Conditions d'Utilisation
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
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Entrée en vigueur : 18 Octobre 2026</span>
          </div>
        </div>
      </div>

      {/* ============ CONTENU PRINCIPAL ============ */}
      <div style={{ maxWidth: '1000px', margin: '-40px auto 60px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        
        {/* Carte principale */}
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
              { id: 'glossary', label: 'Glossaire' },
              { id: 'introduction', label: 'Introduction' },
              { id: 'registration', label: 'Inscription' },
              { id: 'payments', label: 'Paiements' },
              { id: 'safety', label: 'Sécurité' },
              { id: 'content', label: 'Contenu' },
              { id: 'privacy', label: 'Confidentialité' },
              { id: 'liability', label: 'Responsabilité' }
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
            
            {/* GLOSSAIRE */}
            <section id="glossary" style={{ marginBottom: '60px' }}>
              <h3 style={{
                fontSize: '1.8rem',
                color: '#1a1a2e',
                marginBottom: '30px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ color: '#e63946' }}>📖</span> 1. Glossaire
              </h3>
              
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #f0f0f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ background: '#fafafa' }}>
                      <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 700, color: '#e63946', borderBottom: '2px solid #ffeef5', width: '30%' }}>Terme</th>
                      <th style={{ padding: '18px 24px', textAlign: 'left', fontWeight: 700, color: '#1a1a2e', borderBottom: '2px solid #ffeef5' }}>Définition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { term: 'Compte', def: 'Le compte utilisateur créé sur l\'Application ou le Site pour accéder au Service, nécessitant des informations exactes, actuelles et complètes.' },
                      { term: 'Application (App)', def: 'L\'application mobile/web POPLOVE accessible via poplove.app ou via les stores (App Store, Google Play).' },
                      { term: 'POPLOVE', def: 'La marque de rencontre géolocalisée exploitée par la Société, accessible via l\'Application POPLOVE ou le Site poplove.app.' },
                      { term: 'Support', def: 'Le contact support client de POPLOVE : support@poplove.app' },
                      { term: 'Contact Légal', def: 'Le contact légal/notifications de POPLOVE : legal@poplove.app' },
                      { term: 'Société', def: 'POPLOVE SARL (Dakar, Sénégal • Abidjan, Côte d\'Ivoire • Lomé, Togo) ou POPLOVE Inc. selon le lieu de résidence.' },
                      { term: 'Données', def: 'Toutes les données partagées dans l\'Application ou le Site avec la Société ou d\'autres utilisateurs.' },
                      { term: 'Utilisation Abusive', def: 'Création ou utilisation non autorisée d\'un Compte sans permission, entraînant une suspension et une action possible.' },
                      { term: 'Politique de Confidentialité', def: 'Le document détaillant comment les données personnelles sont collectées, utilisées et protégées par la Société.' },
                      { term: 'Email Vérifié', def: 'Une adresse email que l\'Utilisateur a confirmée en suivant le lien ou le code de vérification envoyé par la Société.' }
                    ].map((row, index) => (
                      <tr key={index} style={{ 
                        background: index % 2 === 0 ? 'white' : '#fdfbfb',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#fff5f7'}
                      onMouseOut={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fdfbfb'}
                      >
                        <td style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', fontWeight: 600, color: '#e63946', verticalAlign: 'top' }}>{row.term}</td>
                        <td style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', color: '#4a4a68', verticalAlign: 'top' }}>{row.def}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #fff5f7 0%, #ffeef5 100%)',
                borderLeft: '4px solid #e63946',
                padding: '24px',
                borderRadius: '0 12px 12px 0',
                marginTop: '30px'
              }}>
                <strong style={{ color: '#e63946', fontSize: '1.05rem', display: 'block', marginBottom: '8px' }}>
                  ⚠️ IMPORTANT :
                </strong>
                <span style={{ color: '#4a4a68', lineHeight: 1.7 }}>
                  Veuillez lire attentivement ces conditions d'utilisation ("Conditions") avant d'utiliser l'application ou le site. En créant un compte ou en utilisant le Service, vous acceptez d'être légalement lié par ces conditions.
                </span>
              </div>
            </section>

            {/* INTRODUCTION */}
            <section id="introduction" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>📌</span> 2. Introduction
              </h3>
              <p style={{ color: '#4a4a68', marginBottom: '20px' }}>
                <strong style={{ color: '#1a1a2e' }}>2.1</strong> Les présentes Conditions s'appliquent à l'Application ou au Site, où l'Utilisateur peut s'inscrire et rencontrer d'autres Utilisateurs à des fins légales et privées.
              </p>
              <p style={{ color: '#4a4a68', marginBottom: '20px' }}>
                <strong style={{ color: '#1a1a2e' }}>2.2</strong> En utilisant le Service, vous reconnaissez avoir lu, compris et accepté d'être légalement lié par les présentes Conditions. Ce document constitue un accord valide et juridiquement contraignant entre Vous et la Société.
              </p>
            </section>

            {/* INSCRIPTION */}
            <section id="registration" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>👤</span> 3. Inscription et Éligibilité
              </h3>
              <p style={{ color: '#4a4a68', marginBottom: '20px' }}>
                <strong style={{ color: '#1a1a2e' }}>3.1</strong> Pour être un Utilisateur inscrit, vous devez être un individu âgé d'au moins <strong style={{ color: '#e63946' }}>18 ans</strong>, légalement capable de conclure un contrat contraignant, et non soumis à des sanctions gouvernementales.
              </p>
              
              <div style={{
                background: '#f8f9fa',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #e9ecef',
                margin: '25px 0'
              }}>
                <h4 style={{ color: '#1a1a2e', marginTop: 0, marginBottom: '15px', fontSize: '1.1rem' }}>📋 Informations requises pour l'inscription :</h4>
                <ul style={{ paddingLeft: '20px', color: '#4a4a68', margin: 0, lineHeight: 2 }}>
                  <li>Prénom et âge</li>
                  <li>Objectif d'inscription (relation, mariage, chat, etc.)</li>
                  <li>Genre et photos avec visage entièrement visible</li>
                  <li>Localisation (via adresse IP) et langues parlées</li>
                </ul>
              </div>

              <p style={{ color: '#4a4a68' }}>
                <strong style={{ color: '#1a1a2e' }}>3.2</strong> <strong>Vérification :</strong> Nous pouvons exiger une vérification d'identité ou biométrique. Un badge de vérification ne garantit pas à 100% l'identité ou les intentions d'un Utilisateur.
              </p>
            </section>

            {/* PAIEMENTS */}
            <section id="payments" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>💳</span> 4. Paiements et Abonnements
              </h3>
              <p style={{ color: '#4a4a68', marginBottom: '20px' }}>
                L'accès de base est gratuit, mais des fonctionnalités Premium sont disponibles via abonnement (1 semaine, 1 mois, 3 mois, 6 mois).
              </p>
              
              <div style={{
                background: 'linear-gradient(135deg, #fff5f7 0%, #ffeef5 100%)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #ffd6e7',
                margin: '25px 0'
              }}>
                <h4 style={{ color: '#e63946', marginTop: 0, marginBottom: '15px' }}>🔄 Renouvellement et Annulation</h4>
                <p style={{ color: '#4a4a68', margin: 0, lineHeight: 1.7 }}>
                  Les abonnements se renouvellent automatiquement. Vous pouvez annuler à tout moment depuis les paramètres de votre compte. La suppression de l'application <strong>ne constitue pas</strong> une annulation d'abonnement.
                </p>
              </div>

              <p style={{ color: '#4a4a68' }}>
                <strong style={{ color: '#1a1a2e' }}>4.1</strong> Les transactions sont finales et non remboursables, sauf disposition contraire de la loi applicable (ex: droit de rétractation de 14 jours dans l'EEE/UK).
              </p>
            </section>

            {/* SÉCURITÉ */}
            <section id="safety" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>🛡️</span> 5. Sécurité et Signalement
              </h3>
              
              <div style={{
                background: '#fff5f5',
                borderLeft: '4px solid #e63946',
                padding: '24px',
                borderRadius: '0 12px 12px 0',
                marginBottom: '25px'
              }}>
                <h4 style={{ color: '#e63946', marginTop: 0, marginBottom: '10px' }}>🚫 Tolérance Zéro</h4>
                <p style={{ color: '#4a4a68', margin: 0, lineHeight: 1.7 }}>
                  Nous avons une politique de tolérance zéro pour l'abus et l'exploitation des mineurs (CSAE/CSAM), le harcèlement, et les arnaques. Tout compte signalé et vérifié comme abusif sera immédiatement et définitivement supprimé, et signalé aux autorités compétentes.
                </p>
              </div>

              <p style={{ color: '#4a4a68' }}>
                <strong style={{ color: '#1a1a2e' }}>5.1</strong> Vous pouvez signaler un comportement dangereux à tout moment. Nous gardons les signalements confidentiels et agissons rapidement sur les menaces crédibles.
              </p>
            </section>

            {/* CONTENU */}
            <section id="content" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>📸</span> 6. Contenu Utilisateur
              </h3>
              <p style={{ color: '#4a4a68', marginBottom: '20px' }}>
                En publiant du contenu, vous accordez à POPLOVE une licence mondiale, non exclusive et libre de redevances pour utiliser, afficher et distribuer ce contenu dans le but d'exploiter et de promouvoir le Service.
              </p>
              <p style={{ color: '#4a4a68' }}>
                Vous restez seul responsable du contenu que vous publiez et garantissez qu'il ne viole pas les droits de propriété intellectuelle de tiers.
              </p>
            </section>

            {/* CONFIDENTIALITÉ */}
            <section id="privacy" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>🔒</span> 7. Confidentialité
              </h3>
              <p style={{ color: '#4a4a68', marginBottom: '20px' }}>
                La protection de vos données est notre priorité. Notre <Link to="/privacy" style={{ color: '#e63946', textDecoration: 'none', fontWeight: 600 }}>Politique de Confidentialité</Link> fait partie intégrante de ces Conditions.
              </p>
              <p style={{ color: '#4a4a68' }}>
                Bien que nous utilisions des mesures de sécurité de niveau industriel, aucune transmission sur Internet n'est garantie à 100% sécurisée.
              </p>
            </section>

            {/* RESPONSABILITÉ */}
            <section id="liability" style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>⚖️</span> 8. Limitation de Responsabilité
              </h3>
              
              <div style={{
                background: '#1a1a2e',
                color: 'white',
                padding: '30px',
                borderRadius: '16px',
                marginBottom: '25px'
              }}>
                <h4 style={{ color: '#ff6b9d', marginTop: 0, marginBottom: '15px' }}>⚠️ AVERTISSEMENT LÉGAL</h4>
                <p style={{ margin: '0 0 15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.9)' }}>
                  L'UTILISATION DU SERVICE EST À VOS RISQUES EXCLUSIFS. LE SERVICE EST FOURNI "TEL QUEL". LA SOCIÉTÉ EXCLUT TOUTE GARANTIE EXPRESSE OU IMPLICITE, Y COMPRIS LA QUALITÉ MARCHANDE ET L'ADÉQUATION À UN USAGE PARTICULIER.
                </p>
                <p style={{ margin: 0, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  La responsabilité de la Société ne pourra en aucun cas dépasser le montant total que vous avez payé à la Société au cours des 12 derniers mois.
                </p>
              </div>

              <p style={{ color: '#4a4a68' }}>
                Rien dans ces Conditions ne limite la responsabilité de la Société en cas de décès ou de blessure corporelle causés par notre négligence, ou pour toute responsabilité qui ne peut être légalement exclue.
              </p>
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
              Des questions ? Contactez notre équipe juridique à <a href="mailto:legal@poplove.app" style={{ color: '#e63946', textDecoration: 'none' }}>legal@poplove.app</a>
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