import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function AmbassadorAgreement() {
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
      const sections = ['intro', 'role', 'submission', 'license', 'compensation', 'exclusivity', 'warranties', 'termination', 'confidentiality', 'misc']
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
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255, 107, 157, 0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <span style={{ fontSize: '3rem' }}></span>
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
            <span style={{ fontSize: '3rem' }}>🌟</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            color: 'white',
            fontWeight: 300,
            margin: '10px 0 20px',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            Accord Ambassadeur Public
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
            <span style={{ color: '#ff6b9d', fontWeight: 600 }}>Programme Officiel</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>|</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Mis à jour : 18 Octobre 2026</span>
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
              { id: 'role', label: 'Rôle' },
              { id: 'submission', label: 'Soumission' },
              { id: 'license', label: 'Licence' },
              { id: 'compensation', label: 'Rémunération' },
              { id: 'exclusivity', label: 'Exclusivité' },
              { id: 'warranties', label: 'Garanties' },
              { id: 'termination', label: 'Résiliation' },
              { id: 'confidentiality', label: 'Confidentialité' },
              { id: 'misc', label: 'Divers' }
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
                <span style={{ color: '#e63946' }}>📜</span> 1. Introduction et Parties
              </h3>
              
              <div style={{
                background: 'linear-gradient(135deg, #fff5f7 0%, #ffeef5 100%)',
                padding: '30px',
                borderRadius: '16px',
                marginBottom: '25px'
              }}>
                <p style={{ color: '#4a4a68', marginBottom: '15px', lineHeight: 1.8 }}>
                  Le présent accord public ("Accord") est conclu entre :
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '2px solid #ff6b9d'
                  }}>
                    <h4 style={{ color: '#e63946', margin: '0 0 10px 0', fontSize: '1rem' }}> La Société</h4>
                    <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
                      <strong>POPLOVE SARL</strong><br />
                      Dakar, Sénégal • Abidjan, Côte d'Ivoire • Lomé, Togo<br />
                      ("Société", "POPLOVE" ou "Nous")
                    </p>
                  </div>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '2px solid #ffd700'
                  }}>
                    <h4 style={{ color: '#e63946', margin: '0 0 10px 0', fontSize: '1rem' }}> L'Ambassadeur</h4>
                    <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
                      Personne physique, utilisateur de l'Application POPLOVE, qui participe au Programme Ambassadeur<br />
                      ("Ambassadeur", "Vous")
                    </p>
                  </div>
                </div>
                <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.95rem' }}>
                  Ensemble désignés comme les "Parties".
                </p>
              </div>
            </section>

            {/* RÔLE */}
            <section id="role" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>🎯</span> 2. Rôle et Objectifs
              </h3>
              
              <div style={{
                background: '#f8f9fa',
                padding: '24px',
                borderRadius: '16px',
                marginBottom: '20px'
              }}>
                <h4 style={{ color: '#1a1a2e', marginTop: 0, marginBottom: '15px' }}>📌 Mission de l'Ambassadeur</h4>
                <p style={{ color: '#4a4a68', margin: 0, lineHeight: 1.8 }}>
                  L'Ambassadeur s'engage à créer et livrer du contenu vidéo mettant en avant ou promouvant l'Application POPLOVE (le "Contenu"), conformément aux directives et instructions fournies par POPLOVE SARL. Ces vidéos présenteront des fonctionnalités, services ou aspects spécifiques de l'Application pour utilisation dans les campagnes marketing et de médias sociaux de la Société.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '15px'
              }}>
                {[
                  { icon: '', title: 'Création de Contenu', desc: 'Produire au moins 1 vidéo de haute qualité respectant le brief créatif fourni.' },
                  { icon: '', title: 'Promotion Authentique', desc: 'Partager votre expérience réelle avec POPLOVE de manière authentique et engageante.' },
                  { icon: '', title: 'Rayonnement Local', desc: 'Contribuer à faire connaître POPLOVE dans votre communauté et réseau social.' }
                ].map((item, index) => (
                  <div key={index} style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{item.icon}</div>
                    <h4 style={{ color: '#1a1a2e', margin: '0 0 10px 0', fontSize: '1rem' }}>{item.title}</h4>
                    <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SOUMISSION */}
            <section id="submission" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}></span> 3. Soumission et Exigences du Contenu
              </h3>

              <div style={{
                background: '#fff5f5',
                borderLeft: '4px solid #e63946',
                padding: '24px',
                borderRadius: '0 12px 12px 0',
                marginBottom: '25px'
              }}>
                <h4 style={{ color: '#e63946', marginTop: 0, marginBottom: '10px' }}>⚠️ Exigences Critiques</h4>
                <ul style={{ color: '#4a4a68', margin: 0, paddingLeft: '20px', lineHeight: 1.8 }}>
                  <li>Le Contenu doit être de <strong>haute qualité</strong> (minimum 1080p, bon éclairage, audio clair).</li>
                  <li>Le Contenu doit être <strong>conforme au brief créatif</strong> fourni par POPLOVE.</li>
                  <li>Tout écart par rapport aux instructions peut entraîner le <strong>rejet du Contenu</strong>.</li>
                  <li>POPLOVE se réserve le droit de demander des <strong>modifications ou re-tournages</strong> aux frais de l'Ambassadeur.</li>
                </ul>
              </div>

              <div style={{
                background: '#f8f9fa',
                padding: '24px',
                borderRadius: '16px'
              }}>
                <h4 style={{ color: '#1a1a2e', marginTop: 0, marginBottom: '15px' }}>🎨 Contrôle Créatif</h4>
                <p style={{ color: '#4a4a68', margin: 0, lineHeight: 1.8 }}>
                  Une fois le Contenu soumis, POPLOVE SARL dispose d'un <strong>contrôle créatif total</strong> sur la manière dont le Contenu est édité, adapté et distribué sur diverses plateformes, incluant mais sans s'y limiter : réseaux sociaux, sites web, emails et publicité payante.
                </p>
              </div>
            </section>

            {/* LICENCE */}
            <section id="license" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>📋</span> 4. Licence d'Utilisation du Contenu
              </h3>

              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b2e 100%)',
                color: 'white',
                padding: '30px',
                borderRadius: '16px',
                marginBottom: '25px'
              }}>
                <h4 style={{ color: '#ff6b9d', marginTop: 0, marginBottom: '15px' }}>🌍 Licence Perpétuelle et Mondiale</h4>
                <p style={{ margin: '0 0 15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>
                  L'Ambassadeur accorde à POPLOVE SARL une licence <strong>illimitée, perpétuelle, irrévocable, mondiale et libre de redevances</strong> pour utiliser, modifier, distribuer, reproduire et afficher le Contenu à toutes fins commerciales, promotionnelles et marketing, sans approbation ou compensation supplémentaire.
                </p>
                <p style={{ margin: 0, lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                  Cette licence s'applique à tous les médias, connus ou à inventer à l'avenir.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '15px'
              }}>
                {[
                  { title: 'Utilisation Perpétuelle', desc: 'POPLOVE peut utiliser le Contenu sans limite de temps, sans notification supplémentaire.' },
                  { title: 'Aucune Compensation Supplémentaire', desc: 'L\'abonnement gratuit d\'un mois constitue la compensation complète et définitive.' },
                  { title: 'Renonciation aux Droits Futurs', desc: 'L\'Ambassadeur renonce à tout droit de réclamer des paiements, redevances ou compensations futures.' }
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef'
                  }}>
                    <h4 style={{ color: '#e63946', margin: '0 0 10px 0', fontSize: '1rem' }}>{item.title}</h4>
                    <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* RÉMUNÉRATION */}
            <section id="compensation" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>💎</span> 5. Rémunération
              </h3>

              <div style={{
                background: 'linear-gradient(135deg, #fff5f7 0%, #ffeef5 100%)',
                padding: '30px',
                borderRadius: '16px',
                textAlign: 'center',
                marginBottom: '25px'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎁</div>
                <h4 style={{ color: '#e63946', margin: '0 0 15px 0', fontSize: '1.3rem' }}>Abonnement Gratuit d'Un Mois</h4>
                <p style={{ color: '#4a4a68', margin: 0, lineHeight: 1.8, fontSize: '1.05rem' }}>
                  Upon successful submission and approval of the Content, the Ambassador will receive a <strong>free one-month subscription</strong> to the POPLOVE App. This subscription will be activated upon the acceptance of the Content by POPLOVE SARL.
                </p>
              </div>

              <div style={{
                background: '#f8f9fa',
                padding: '24px',
                borderRadius: '16px'
              }}>
                <h4 style={{ color: '#1a1a2e', marginTop: 0, marginBottom: '15px' }}>💰 Aucune Rémunération Additionnelle</h4>
                <p style={{ color: '#4a4a68', margin: '0 0 15px', lineHeight: 1.8 }}>
                  L'Ambassadeur reconnaît qu'aucun paiement monétaire, redevance ou autre forme de compensation ne sera fourni au-delà de l'abonnement gratuit d'un mois.
                </p>
                <div style={{
                  background: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  borderLeft: '4px solid #ffd700'
                }}>
                  <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.95rem' }}>
                    <strong>Responsabilité Fiscale :</strong> L'Ambassadeur reconnaît que toute obligation fiscale résultant de l'abonnement gratuit ou de toute autre compensation non monétaire fournie en vertu du présent Accord est de la seule responsabilité de l'Ambassadeur. POPLOVE SARL ne fournira aucun conseil fiscal et ne retiendra aucune taxe au nom de l'Ambassadeur.
                  </p>
                </div>
              </div>
            </section>

            {/* EXCLUSIVITÉ */}
            <section id="exclusivity" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}></span> 6. Exclusivité
              </h3>

              <div style={{
                background: '#fff5f5',
                border: '2px solid #e63946',
                padding: '24px',
                borderRadius: '16px',
                marginBottom: '25px'
              }}>
                <h4 style={{ color: '#e63946', marginTop: 0, marginBottom: '10px' }}>🚫 Accord de Non-Concurrence</h4>
                <p style={{ color: '#4a4a68', margin: 0, lineHeight: 1.8 }}>
                  L'Ambassadeur s'engage à ne pas s'engager dans la promotion, l'endossement ou la publicité de toute application, produit ou service qui concurrence directement ou indirectement l'Application POPLOVE. Cette restriction s'applique <strong>à la fois pendant la durée du présent Accord et pour une période d'un an suivant la résiliation</strong> du présent Accord.
                </p>
              </div>

              <div style={{
                background: '#f8f9fa',
                padding: '24px',
                borderRadius: '16px'
              }}>
                <h4 style={{ color: '#1a1a2e', marginTop: 0, marginBottom: '15px' }}>⚖️ Conséquences en Cas de Violation</h4>
                <p style={{ color: '#4a4a68', margin: '0 0 15px', lineHeight: 1.8 }}>
                  Si l'Ambassadeur viole cette disposition d'exclusivité, POPLOVE SARL se réserve le droit de :
                </p>
                <ul style={{ color: '#4a4a68', margin: 0, paddingLeft: '20px', lineHeight: 2 }}>
                  <li><strong>Résilier immédiatement</strong> le présent Accord.</li>
                  <li>L'Ambassadeur <strong>perdra tous les avantages restants</strong>, y compris l'abonnement d'un mois.</li>
                  <li>L'Ambassadeur pourra être <strong>tenu responsable des dommages</strong> résultant de la violation.</li>
                </ul>
              </div>
            </section>

            {/* GARANTIES */}
            <section id="warranties" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>✅</span> 7. Déclarations et Garanties de l'Ambassadeur
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[
                  { icon: '✨', title: 'Œuvre Originale', desc: 'L\'Ambassadeur déclare et garantit que le Contenu créé et soumis en vertu du présent Accord est sa propre œuvre originale et ne porte pas atteinte aux droits de propriété intellectuelle, droits à la vie privée ou tout autre droit de tout tiers.' },
                  { icon: '', title: 'Âge et Capacité Légale', desc: 'L\'Ambassadeur confirme qu\'il a au moins 18 ans et a le droit légal de conclure le présent Accord et d\'accorder les droits décrits herein.' },
                  { icon: '🚫', title: 'Aucun Endossement de Produits Concurrents', desc: 'L\'Ambassadeur affirme qu\'il n\'est actuellement engagé dans aucun accord qui entrerait en conflit avec les obligations en vertu du présent Accord, spécifiquement en ce qui concerne la promotion d\'applications ou services concurrents.' }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px',
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '12px'
                  }}>
                    <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                    <div>
                      <h4 style={{ color: '#1a1a2e', margin: '0 0 10px 0', fontSize: '1.1rem' }}>{item.title}</h4>
                      <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* RÉSILIATION */}
            <section id="termination" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>🛑</span> 8. Résiliation
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                <div style={{
                  background: '#fff5f7',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '2px solid #ff6b9d'
                }}>
                  <h4 style={{ color: '#e63946', marginTop: 0, marginBottom: '15px' }}> Résiliation par POPLOVE</h4>
                  <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.95rem', lineHeight: 1.7 }}>
                    POPLOVE SARL se réserve le droit de résilier le présent Accord à tout moment et pour quelque raison que ce soit, incluant mais sans s'y limiter les violations de la clause d'exclusivité ou le défaut de soumettre le Contenu dans les délais convenus.
                  </p>
                </div>
                <div style={{
                  background: '#fff5f7',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '2px solid #ffd700'
                }}>
                  <h4 style={{ color: '#e63946', marginTop: 0, marginBottom: '15px' }}>👤 Résiliation par l'Ambassadeur</h4>
                  <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.95rem', lineHeight: 1.7 }}>
                    L'Ambassadeur peut résilier le présent Accord moyennant un préavis écrit à POPLOVE SARL. Cependant, si la résiliation intervient après la soumission du Contenu, la licence d'utilisation du Contenu reste en vigueur et aucune compensation supplémentaire ne sera fournie.
                  </p>
                </div>
              </div>

              <div style={{
                background: '#f8f9fa',
                padding: '24px',
                borderRadius: '16px'
              }}>
                <h4 style={{ color: '#1a1a2e', marginTop: 0, marginBottom: '15px' }}>📋 Effets de la Résiliation</h4>
                <p style={{ color: '#4a4a68', margin: 0, lineHeight: 1.8 }}>
                  Upon termination, all rights granted to POPLOVE SARL to use the Content will remain in effect, and the Ambassador will not be entitled to any further compensation.
                </p>
              </div>
            </section>

            {/* CONFIDENTIALITÉ */}
            <section id="confidentiality" style={{ marginBottom: '60px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}>🔐</span> 9. Confidentialité
              </h3>

              <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b2e 100%)',
                color: 'white',
                padding: '30px',
                borderRadius: '16px'
              }}>
                <h4 style={{ color: '#ff6b9d', marginTop: 0, marginBottom: '15px' }}>🤫 Informations Confidentielles</h4>
                <p style={{ margin: '0 0 15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>
                  L'Ambassadeur s'engage à ne pas divulguer toute information confidentielle fournie par POPLOVE SARL, incluant les détails sur les stratégies marketing de l'Application, les pratiques opérationnelles ou les plans futurs.
                </p>
                <p style={{ margin: 0, lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                  Cette obligation s'étend au-delà de la résiliation du présent Accord.
                </p>
              </div>
            </section>

            {/* DIVERS */}
            <section id="misc" style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#e63946' }}></span> 10. Dispositions Diverses
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { title: 'Droit Applicable', desc: 'Le présent Accord est régi et interprété conformément aux lois en vigueur au Sénégal, Côte d\'Ivoire et Togo, selon le lieu de résidence de l\'Ambassadeur.' },
                  { title: 'Accord Intégral', desc: 'Le présent Accord constitue l\'accord intégral entre les Parties et remplace tout accord antérieur, discussions ou négociations, qu\'oraux ou écrits, concernant l\'objet des présentes, sauf les Conditions d\'Utilisation, la Politique de Confidentialité et toute autre politique de la Société.' },
                  { title: 'Amendements', desc: 'Tout amendement ou modification du présent Accord peut être publié sur le site web de POPLOVE, et les Parties conviennent qu\'il entre en vigueur le jour de sa publication.' },
                  { title: 'Divisibilité', desc: 'Si une disposition du présent Accord est jugée invalide ou inapplicable par un tribunal compétent, le reste du Accord restera en pleine force et effet.' },
                  { title: 'Renonciation', desc: 'Aucune renonciation à un terme ou condition du présent Accord ne sera interprétée comme une renonciation à tout autre terme ou condition.' }
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '12px',
                    borderLeft: '4px solid #e63946'
                  }}>
                    <h4 style={{ color: '#1a1a2e', margin: '0 0 10px 0', fontSize: '1.1rem' }}>{item.title}</h4>
                    <p style={{ color: '#4a4a68', margin: 0, fontSize: '0.95rem', lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                ))}
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
              Programme Ambassadeur Officiel • Rejoignez notre communauté de créateurs
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