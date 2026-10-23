import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CommunityGuidelines() {
  const [activeSection, setActiveSection] = useState('intro')

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
      const sections = ['intro', 'respect', 'authenticite', 'securite', 'mineurs', 'contenu', 'sanctions']
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
          bottom: '-30%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(230, 57, 70, 0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <span style={{ fontSize: '3rem' }}>🛡️</span>
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
            <span style={{ fontSize: '3rem' }}>🛡️</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            color: 'white',
            fontWeight: 300,
            margin: '10px 0 20px',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            Règles de la Communauté
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
            <span style={{ color: '#ff6b9d', fontWeight: 600 }}>Sécurité & Respect</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>|</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Tolérance Zéro</span>
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
              { id: 'respect', label: 'Respect' },
              { id: 'authenticite', label: 'Authenticité' },
              { id: 'securite', label: 'Sécurité' },
              { id: 'mineurs', label: 'Protection des Mineurs' },
              { id: 'contenu', label: 'Contenu' },
              { id: 'sanctions', label: 'Sanctions' }
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
                <span style={{ color: '#e63946' }}>🤝</span> 1. Notre Engagement
              </h3>
              <p style={{ color: '#4a4a68', marginBottom: '20px', fontSize: '1.05rem' }}>
                Chez <strong style={{ color: '#e63946' }}>POPLOVE</strong>, nous croyons que tout le monde mérite de trouver l'amour ou l'amitié dans un environnement <strong>sain, respectueux et sécurisé</strong>. 
              </p>
              <p style={{ color: '#4a4a68' }}>
                Ces Règles de la Communauté s'appliquent à tous les utilisateurs, à tous les profils et à toutes les interactions sur notre plateforme (messages, photos, bios). En utilisant POPLOVE, vous vous engagez à respecter ces règles.
              </p>
            </section>

            {/* RESPECT */}
            <section id="respect" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>❤️</span> 2. Soyez Respectueux
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {[
                  { icon: '🚫', title: 'Tolérance Zéro au Harcèlement', desc: 'Les insultes, le harcèlement, le stalking (traque) ou les messages menaçants sont strictement interdits.' },
                  { icon: '⚖️', title: 'Pas de Discrimination', desc: 'Nous n\'tolérons aucun discours haineux basé sur la race, l\'ethnie, la religion, le genre, l\'orientation sexuelle ou le handicap.' },
                  { icon: '🛑', title: 'Respect du Consentement', desc: 'Si quelqu\'un ne répond pas ou demande à arrêter la conversation, respectez son choix immédiatement. "Non" signifie non.' }
                ].map((item, index) => (
                  <div key={index} style={{
                    background: '#f8f9fa',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid #e9ecef'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{item.icon}</div>
                    <h4 style={{ color: '#1a1a2e', margin: '0 0 10px 0', fontSize: '1.1rem' }}>{item.title}</h4>
                    <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* AUTHENTICITÉ */}
            <section id="authenticite" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>✨</span> 3. Soyez Authentique
              </h3>
              <ul style={{ color: '#4a4a68', paddingLeft: '20px', lineHeight: 2 }}>
                <li><strong style={{ color: '#1a1a2e' }}>Soyez vous-même :</strong> Utilisez vos propres photos récentes et où votre visage est clairement visible.</li>
                <li><strong style={{ color: '#1a1a2e' }}>Pas d'usurpation d'identité (Catfishing) :</strong> Il est strictement interdit de se faire passer pour une autre personne (célébrité, connaissance ou personne fictive).</li>
                <li><strong style={{ color: '#1a1a2e' }}>Un seul compte :</strong> Chaque personne n'a le droit de créer qu'un seul compte POPLOVE. Les comptes multiples seront supprimés.</li>
                <li><strong style={{ color: '#1a1a2e' }}>Pas de comptes professionnels ou commerciaux :</strong> POPLOVE est réservé aux rencontres personnelles. La promotion de services, de marques ou de réseaux sociaux est interdite.</li>
              </ul>
            </section>

            {/* SÉCURITÉ */}
            <section id="securite" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>🔒</span> 4. Gardez vos Informations en Sécurité
              </h3>
              
              <div style={{
                background: '#fff5f5',
                border: '2px solid #e63946',
                padding: '24px',
                borderRadius: '16px',
                marginBottom: '25px'
              }}>
                <h4 style={{ color: '#e63946', marginTop: 0, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⚠️ RÈGLE D'OR : Ne donnez JAMAIS d'argent
                </h4>
                <p style={{ color: '#4a4a68', margin: 0, lineHeight: 1.7 }}>
                  Ne répondez pas aux demandes d'argent, de cartes cadeaux, de transfert de fonds ou d'aide financière, quelle que soit l'histoire racontée (urgence médicale, blocage de compte, voyage). <strong>POPLOVE ne vous demandera jamais d'argent en dehors de l'achat de crédits via l'application.</strong>
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[
                  'Ne partagez pas votre adresse personnelle, votre lieu de travail ou vos informations bancaires avec des inconnus.',
                  'Méfiez-vous des profils qui refusent systématiquement les appels vidéo ou les rencontres en lieu public.',
                  'Pour votre première rencontre, choisissez toujours un lieu public et informez un ami ou un membre de votre famille de vos plans.'
                ].map((tip, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <span style={{ color: '#25D366', fontSize: '1.2rem', marginTop: '2px' }}>✓</span>
                    <span style={{ color: '#4a4a68', lineHeight: 1.6 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* PROTECTION DES MINEURS */}
            <section id="mineurs" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>👶</span> 5. Protection Absolue des Mineurs
              </h3>
              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b2e 100%)',
                color: 'white',
                padding: '30px',
                borderRadius: '16px'
              }}>
                <h4 style={{ color: '#ff6b9d', marginTop: 0, marginBottom: '15px' }}>🚫 Interdit aux moins de 18 ans</h4>
                <p style={{ margin: '0 0 15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.9)' }}>
                  L'utilisation de POPLOVE est strictement réservée aux adultes de 18 ans et plus. Nous utilisons des systèmes de vérification et de modération pour détecter et supprimer immédiatement tout compte appartenant à un mineur.
                </p>
                <p style={{ margin: 0, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                  <strong>Tolérance Zéro pour le CSAM :</strong> Tout contenu, message ou comportement suggérant l'exploitation, la sollicitation ou l'abus sexuel d'un mineur entraîne un bannissement immédiat et définitif, ainsi qu'un signalement obligatoire aux autorités compétentes (police, cybercriminalité).
                </p>
              </div>
            </section>

            {/* CONTENU */}
            <section id="contenu" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>📸</span> 6. Règles concernant le Contenu
              </h3>
              <p style={{ color: '#4a4a68', marginBottom: '20px' }}>
                Les photos et textes de votre profil, ainsi que vos messages, doivent respecter les critères suivants. Est interdit :
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                {[
                  { title: 'Nudité et contenu sexuel', desc: 'Photos de nudité, poses sexuellement suggestives ou sollicitation d\'actes sexuels.' },
                  { title: 'Violence et illégalité', desc: 'Images de violence, d\'armes, de drogues ou de toute activité illégale.' },
                  { title: 'Spam et publicité', desc: 'Liens vers des sites externes, promotion de services ou envoi de messages en masse.' },
                  { title: 'Informations privées', desc: 'Partage de numéros de téléphone, adresses ou réseaux sociaux d\'autres personnes sans leur consentement.' }
                ].map((rule, index) => (
                  <div key={index} style={{
                    padding: '20px',
                    background: '#fff5f7',
                    border: '1px solid #ffd6e7',
                    borderRadius: '12px'
                  }}>
                    <h4 style={{ color: '#e63946', margin: '0 0 10px 0', fontSize: '1rem' }}>❌ {rule.title}</h4>
                    <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>{rule.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SANCTIONS */}
            <section id="sanctions" style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>⚖️</span> 7. Signalement et Sanctions
              </h3>
              <p style={{ color: '#4a4a68', marginBottom: '20px' }}>
                Nous prenons chaque signalement au sérieux. Notre équipe de modération examine les rapports 24h/24 et 7j/7.
              </p>
              
              <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '16px', marginBottom: '25px' }}>
                <h4 style={{ color: '#1a1a2e', marginTop: 0, marginBottom: '15px' }}>Comment signaler un comportement ?</h4>
                <ol style={{ color: '#4a4a68', paddingLeft: '20px', lineHeight: 2 }}>
                  <li>Allez sur le profil de la personne ou ouvrez la conversation.</li>
                  <li>Cliquez sur l'icône <strong>"⋮"</strong> ou <strong>"Signaler"</strong>.</li>
                  <li>Sélectionnez la raison du signalement et ajoutez des détails si nécessaire.</li>
                  <li>Notre équipe examinera le cas et prendra les mesures appropriées.</li>
                </ol>
              </div>

              <h4 style={{ color: '#1a1a2e', marginBottom: '15px' }}>Échelle des sanctions :</h4>
              <ul style={{ color: '#4a4a68', paddingLeft: '20px', lineHeight: 2 }}>
                <li><strong>Avertissement :</strong> Pour les infractions mineures ou involontaires.</li>
                <li><strong>Suspension temporaire :</strong> Perte d'accès au compte pour une durée déterminée (ex: 3 à 7 jours) avec obligation de vérifier son identité au retour.</li>
                <li><strong>Bannissement définitif :</strong> Pour les violations graves (arnaques, harcèlement, contenu illégal, récidive). L'adresse IP et les informations de l'appareil peuvent être bloquées pour empêcher la création d'un nouveau compte.</li>
                <li><strong>Signalement aux autorités :</strong> En cas d'activité criminelle avérée (menaces, exploitation de mineurs, fraude financière).</li>
              </ul>
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
              Ensemble, construisons une communauté bienveillante et sécurisée.
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