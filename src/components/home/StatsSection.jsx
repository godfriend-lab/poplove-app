export default function StatsSection() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #ffeef5 0%, #ffd6e7 100%)', // Rose clair POPLOVE
      padding: '100px 60px',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '80px',
        alignItems: 'center'
      }}>
        {/* ============ COLONNE GAUCHE : Badge #1 ============ */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            position: 'relative',
            width: '300px',
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Lauriers gauche (SVG) */}
            <svg
              width="120"
              height="200"
              viewBox="0 0 100 200"
              style={{
                position: 'absolute',
                left: '-20px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              <path
                d="M80 20 Q60 40 50 60 Q40 80 30 100 Q40 120 50 140 Q60 160 80 180"
                fill="none"
                stroke="#e63946"
                strokeWidth="3"
              />
              {[...Array(8)].map((_, i) => (
                <ellipse
                  key={i}
                  cx={70 - i * 5}
                  cy={30 + i * 20}
                  rx="15"
                  ry="8"
                  fill="#e63946"
                  transform={`rotate(${-30 + i * 5} ${70 - i * 5} ${30 + i * 20})`}
                />
              ))}
            </svg>

            {/* Lauriers droit (SVG) */}
            <svg
              width="120"
              height="200"
              viewBox="0 0 100 200"
              style={{
                position: 'absolute',
                right: '-20px',
                top: '50%',
                transform: 'translateY(-50%) scaleX(-1)'
              }}
            >
              <path
                d="M80 20 Q60 40 50 60 Q40 80 30 100 Q40 120 50 140 Q60 160 80 180"
                fill="none"
                stroke="#e63946"
                strokeWidth="3"
              />
              {[...Array(8)].map((_, i) => (
                <ellipse
                  key={i}
                  cx={70 - i * 5}
                  cy={30 + i * 20}
                  rx="15"
                  ry="8"
                  fill="#e63946"
                  transform={`rotate(${-30 + i * 5} ${70 - i * 5} ${30 + i * 20})`}
                />
              ))}
            </svg>

            {/* Contenu central du badge */}
            <div style={{ textAlign: 'center', zIndex: 2 }}>
              <div style={{
                fontSize: '6rem',
                fontWeight: 900,
                color: '#e63946',
                lineHeight: 1,
                fontFamily: "'Playfair Display', serif"
              }}>
                #1
              </div>
              <div style={{
                fontSize: '1.3rem',
                fontWeight: 600,
                color: '#333',
                marginTop: '10px',
                lineHeight: 1.3
              }}>
                App de Rencontre
                <br />
                en Afrique
              </div>
            </div>
          </div>
        </div>

        {/* ============ COLONNE DROITE : Texte + Boutons ============ */}
        <div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: '#333',
            lineHeight: 1.2,
            marginBottom: '40px',
            fontFamily: "'Playfair Display', serif"
          }}>
            Conçue pour vous aider à trouver l'amour
            <br />
            <span style={{ color: '#e63946' }}>partout dans le monde</span>
          </h2>

          {/* Boutons Google Play et App Store */}
          <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            {/* Google Play */}
            <a
              href="#"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                background: '#000',
                borderRadius: '12px',
                textDecoration: 'none',
                color: 'white',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M3 20.5V3.5c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35z"/>
                <path fill="#EA4335" d="M16.81 15.12L6.05 21.34l9.49-9.49 1.27 3.27z"/>
                <path fill="#FBBC05" d="M20.16 10.81c0 .69-.27 1.32-.71 1.79l-2.64-1.52 2.64-1.52c.44.47.71 1.1.71 1.79z"/>
                <path fill="#34A853" d="M3.84 2.15L16.81 8.88l-1.27 3.27L3.84 2.15z"/>
              </svg>
              <div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>DISPONIBLE SUR</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>Google Play</div>
              </div>
            </a>

            {/* App Store */}
            <a
              href="#"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                background: '#000',
                borderRadius: '12px',
                textDecoration: 'none',
                color: 'white',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Télécharger sur l'</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>App Store</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}