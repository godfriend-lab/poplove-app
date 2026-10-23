import { useState, useRef, useEffect } from 'react'

export default function DownloadSection() {
  // ✅ Liste de tes 8 vidéos locales (dans public/videos/)
  // Assure-toi que les fichiers existent bien avec ces noms exacts
  const videoFiles = [
    '/videos/couple1.mp4',
    '/videos/couple2.mp4',
    '/videos/couple3.mp4',
    '/videos/couple4.mp4',
    '/videos/couple5.mp4',
    '/videos/couple6.mp4',
    '/videos/couple7.mp4',
    '/videos/couple8.mp4'
  ]

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      {/* ============ GRILLE DE 8 VIDÉOS (4x2) ============ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          width: '100%',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        {videoFiles.map((videoSrc, index) => (
          <VideoCard key={index} videoSrc={videoSrc} index={index} />
        ))}
      </div>

      {/* ============ OVERLAY SOMBRE GLOBAL ============ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 5
        }}
      />

      {/* ============ CONTENU CENTRAL ============ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          padding: '20px',
          textAlign: 'center'
        }}
      >
        {/* Logo POPLOVE */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '30px'
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(3rem, 7vw, 6rem)',
              fontWeight: 900,
              color: 'white',
              textShadow: '0 4px 30px rgba(0,0,0,0.8)',
              letterSpacing: '3px'
            }}
          >
            POPLOVE
          </span>
          <span
            style={{
              fontSize: 'clamp(3rem, 7vw, 6rem)',
              filter: 'drop-shadow(0 4px 20px rgba(255, 107, 157, 0.8))',
              animation: 'heartBeat 1.5s ease-in-out infinite'
            }}
          >
            💕
          </span>
        </div>

        {/* Badge avec lauriers */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '40px'
          }}
        >
          {/* Lauriers gauche */}
          <svg
            width="70"
            height="90"
            viewBox="0 0 100 120"
            fill="none"
            style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))' }}
          >
            <path
              d="M80 10 Q60 30 50 50 Q40 70 30 90 Q40 100 50 110"
              stroke="white"
              strokeWidth="4"
              fill="none"
            />
            {[...Array(6)].map((_, i) => (
              <ellipse
                key={i}
                cx={70 - i * 6}
                cy={20 + i * 15}
                rx="12"
                ry="6"
                fill="white"
                transform={`rotate(${-40 + i * 8} ${70 - i * 6} ${20 + i * 15})`}
              />
            ))}
          </svg>

          {/* Texte central */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                fontWeight: 900,
                color: 'white',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                lineHeight: 1,
                fontFamily: "'Playfair Display', serif"
              }}
            >
              50 000+
            </div>
            <div
              style={{
                fontSize: 'clamp(0.9rem, 1.5vw, 1.3rem)',
                fontWeight: 700,
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                letterSpacing: '3px',
                marginTop: '8px'
              }}
            >
              TÉLÉCHARGEMENTS
            </div>
          </div>

          {/* Lauriers droit (miroir) */}
          <svg
            width="70"
            height="90"
            viewBox="0 0 100 120"
            fill="none"
            style={{
              transform: 'scaleX(-1)',
              filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))'
            }}
          >
            <path
              d="M80 10 Q60 30 50 50 Q40 70 30 90 Q40 100 50 110"
              stroke="white"
              strokeWidth="4"
              fill="none"
            />
            {[...Array(6)].map((_, i) => (
              <ellipse
                key={i}
                cx={70 - i * 6}
                cy={20 + i * 15}
                rx="12"
                ry="6"
                fill="white"
                transform={`rotate(${-40 + i * 8} ${70 - i * 6} ${20 + i * 15})`}
              />
            ))}
          </svg>
        </div>

        {/* Texte "Télécharger maintenant" */}
        <div
          style={{
            fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
            fontWeight: 600,
            color: 'white',
            textShadow: '0 2px 15px rgba(0,0,0,0.8)',
            marginBottom: '35px'
          }}
        >
          Télécharger maintenant
        </div>

        {/* Boutons Google Play et App Store */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          {/* Google Play */}
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 28px',
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: '14px',
              textDecoration: 'none',
              color: 'white',
              transition: 'all 0.3s',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
              e.currentTarget.style.background = 'rgba(0,0,0,0.95)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.background = 'rgba(0,0,0,0.85)'
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M3 20.5V3.5c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35z"
              />
              <path
                fill="#EA4335"
                d="M16.81 15.12L6.05 21.34l9.49-9.49 1.27 3.27z"
              />
              <path
                fill="#FBBC05"
                d="M20.16 10.81c0 .69-.27 1.32-.71 1.79l-2.64-1.52 2.64-1.52c.44.47.71 1.1.71 1.79z"
              />
              <path
                fill="#34A853"
                d="M3.84 2.15L16.81 8.88l-1.27 3.27L3.84 2.15z"
              />
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, letterSpacing: '1px' }}>
                DISPONIBLE SUR
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>Google Play</div>
            </div>
          </a>

          {/* App Store */}
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 28px',
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              borderRadius: '14px',
              textDecoration: 'none',
              color: 'white',
              transition: 'all 0.3s',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
              e.currentTarget.style.background = 'rgba(0,0,0,0.95)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.background = 'rgba(0,0,0,0.85)'
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, letterSpacing: '1px' }}>
                Télécharger sur l'
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>App Store</div>
            </div>
          </a>
        </div>
      </div>

      <style>{`
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.15); }
          50% { transform: scale(1); }
          75% { transform: scale(1.15); }
        }
      `}</style>
    </section>
  )
}

// ============ COMPOSANT VIDÉO INDIVIDUEL ============
function VideoCard({ videoSrc, index }) {
  const videoRef = useRef(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Forcer la lecture après chargement
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(`⚠️ Vidéo ${index} ne peut pas être lue:`, err)
        })
      }
    }
  }, [videoSrc, index])

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        background: '#1a1a2e'
      }}
    >
      {!hasError ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onError={(e) => {
            console.error(`❌ Erreur vidéo ${index}:`, videoSrc)
            setHasError(true)
          }}
          onLoadedData={() => {
            console.log(`✅ Vidéo ${index} chargée:`, videoSrc)
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '100%',
            minHeight: '100%'
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo.
        </video>
      ) : (
        // Fallback : couleur de fond si la vidéo ne charge pas
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, #ff6b9d22, #e6394622)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '3rem'
          }}
        >
          💕
        </div>
      )}

      {/* Overlay léger sur chaque carte */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.15)',
          zIndex: 2
        }}
      />
    </div>
  )
}