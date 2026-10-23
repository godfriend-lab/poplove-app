import { Link } from 'react-router-dom'

export default function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      // REMPLACE PAR TON IMAGE : '/images/step1-profile.png'
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=600&fit=crop',
      title: 'Créez votre profil',
      description: 'Partagez des détails sur vous et ajoutez de superbes photos pour montrer votre personnalité.'
    },
    {
      number: '2',
      // REMPLACE PAR TON IMAGE : '/images/step2-match.png'
      image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=600&fit=crop',
      title: 'Découvrez les célibataires',
      description: 'Parcourez les profils vérifiés de célibataires près de chez vous pour trouver votre match parfait.'
    },
    {
      number: '3',
      // REMPLACE PAR TON IMAGE : '/images/step3-whatsapp.png'
      // OU utilise le mockup WhatsApp intégré ci-dessous
      image: null, // null = utiliser le mockup WhatsApp intégré
      title: 'Contactez via WhatsApp',
      description: 'Entrez en contact directement via WhatsApp. Simple, rapide et sécurisé.'
    }
  ]

  // Mockup de conversation WhatsApp (pour l'étape 3)
  const WhatsAppMockup = () => (
    <div style={{
      width: '280px',
      height: '450px',
      background: '#e5ddd5',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      position: 'relative',
      margin: '0 auto',
      border: '8px solid #333'
    }}>
      {/* Header WhatsApp */}
      <div style={{
        background: '#075e54',
        padding: '12px 15px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          width: '35px',
          height: '35px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.2rem'
        }}>
          💕
        </div>
        <div>
          <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>Aminata</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>en ligne</div>
        </div>
      </div>

      {/* Fond de conversation */}
      <div style={{
        padding: '15px',
        height: 'calc(100% - 60px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'%3E%3Cpath fill=\'%23d4c9b8\' fill-opacity=\'0.3\' d=\'M0 0h100v100H0z\'/%3E%3C/svg%3E")'
      }}>
        {/* Message reçu */}
        <div style={{
          alignSelf: 'flex-start',
          background: 'white',
          padding: '10px 12px',
          borderRadius: '8px',
          maxWidth: '80%',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          position: 'relative'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#333', lineHeight: 1.4 }}>
            Salut ! J'ai vu ton profil sur POPLOVE 💕
          </div>
          <div style={{ fontSize: '0.65rem', color: '#999', textAlign: 'right', marginTop: '4px' }}>
            14:32
          </div>
        </div>

        {/* Message envoyé */}
        <div style={{
          alignSelf: 'flex-end',
          background: '#dcf8c6',
          padding: '10px 12px',
          borderRadius: '8px',
          maxWidth: '80%',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#333', lineHeight: 1.4 }}>
            Salut Aminata ! Ton profil m'a beaucoup plu 😊
          </div>
          <div style={{ fontSize: '0.65rem', color: '#999', textAlign: 'right', marginTop: '4px' }}>
            14:33 ✓✓
          </div>
        </div>

        {/* Message reçu */}
        <div style={{
          alignSelf: 'flex-start',
          background: 'white',
          padding: '10px 12px',
          borderRadius: '8px',
          maxWidth: '80%',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#333', lineHeight: 1.4 }}>
            Merci ! On se rencontre quand ? ☕
          </div>
          <div style={{ fontSize: '0.65rem', color: '#999', textAlign: 'right', marginTop: '4px' }}>
            14:35
          </div>
        </div>

        {/* Message envoyé */}
        <div style={{
          alignSelf: 'flex-end',
          background: '#dcf8c6',
          padding: '10px 12px',
          borderRadius: '8px',
          maxWidth: '80%',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#333', lineHeight: 1.4 }}>
            Ce weekend ? Je connais un super café 🌹
          </div>
          <div style={{ fontSize: '0.65rem', color: '#999', textAlign: 'right', marginTop: '4px' }}>
            14:36 ✓✓
          </div>
        </div>
      </div>

      {/* Badge POPLOVE */}
      <div style={{
        position: 'absolute',
        top: '-15px',
        right: '-15px',
        background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
        color: 'white',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        boxShadow: '0 4px 10px rgba(230, 57, 70, 0.4)'
      }}>
        💕
      </div>
    </div>
  )

  return (
    <section style={{
      background: 'white',
      padding: '100px 60px',
      fontFamily: "'Poppins', sans-serif",
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Titre */}
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 700,
          color: '#333',
          marginBottom: '20px',
          fontFamily: "'Playfair Display', serif"
        }}>
          Comment ça marche
        </h2>
        
        {/* Sous-titre */}
        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          marginBottom: '60px'
        }}>
          Commencez sur POPLOVE en 3 étapes simples :
        </p>

        {/* 3 Colonnes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '50px',
          marginBottom: '60px'
        }}>
          {steps.map((step, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              {/* Numéro dans cercle bleu + Image */}
              <div style={{
                position: 'relative',
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'center'
              }}>
                {/* Numéro */}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '60px',
                  background: '#5dade2', // Bleu comme Bumpy
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  zIndex: 2,
                  boxShadow: '0 4px 15px rgba(93, 173, 226, 0.4)',
                  border: '4px solid white'
                }}>
                  {step.number}
                </div>

                {/* Image ou Mockup WhatsApp */}
                {step.image ? (
                  <img
                    src={step.image}
                    alt={step.title}
                    style={{
                      width: '100%',
                      maxWidth: '280px',
                      height: '400px',
                      objectFit: 'cover',
                      borderRadius: '20px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                      marginTop: '20px'
                    }}
                  />
                ) : (
                  <div style={{ marginTop: '20px' }}>
                    <WhatsAppMockup />
                  </div>
                )}
              </div>

              {/* Titre */}
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#333',
                marginBottom: '15px'
              }}>
                {step.title}
              </h3>

              {/* Description */}
              <p style={{
                color: '#666',
                lineHeight: 1.6,
                fontSize: '1rem',
                margin: 0
              }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bouton Try Now */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to="/register"
            style={{
              display: 'inline-block',
              padding: '18px 60px',
              background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
              color: 'white',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.1rem',
              boxShadow: '0 10px 30px rgba(230, 57, 70, 0.3)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(230, 57, 70, 0.4)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(230, 57, 70, 0.3)'
            }}
          >
            Essayer maintenant
          </Link>
        </div>
      </div>
    </section>
  )
}