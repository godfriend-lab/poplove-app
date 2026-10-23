import { Link } from 'react-router-dom'

export default function FooterSection() {
  return (
    <footer style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ============ PARTIE PRINCIPALE DU FOOTER ============ */}
      <div style={{
        background: 'white',
        padding: '80px 60px 60px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Sélecteur de langue */}
        <div style={{ marginBottom: '40px' }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.95rem',
            color: '#333',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#e63946' }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = '#ddd' }}
          >
            <span>🌐</span>
            <span>Fr</span>
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '60px',
          alignItems: 'start'
        }}>
          {/* ============ COLONNE 1 : LEGAL ============ */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#333',
              marginBottom: '20px',
              marginTop: 0
            }}>
              Légal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'Conditions d\'utilisation', to: '/terms' },
                { label: 'Politique de confidentialité', to: '/privacy' },
                { label: 'Règles de la communauté', to: '/community-guidelines' },
                { label: 'Accord Ambassadeur Public', to: '/ambassador' },
                { label: 'Politique des cookies', to: '/cookies' },
                { label: 'Préférences des cookies', to: '/cookie-preferences' }
              ].map((item, index) => (
                <li key={index} style={{ marginBottom: '15px' }}>
                  <Link
                    to={item.to}
                    style={{
                      color: '#666',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'color 0.3s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.color = '#e63946' }}
                    onMouseOut={(e) => { e.currentTarget.style.color = '#666' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ============ COLONNE 2 : COMPANY ============ */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#333',
              marginBottom: '20px',
              marginTop: 0
            }}>
              Entreprise
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '15px' }}>
                <Link
                  to="/contact"
                  style={{
                    color: '#666',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#e63946' }}
                  onMouseOut={(e) => { e.currentTarget.style.color = '#666' }}
                >
                  Contactez-nous
                </Link>
              </li>
              <li style={{ marginBottom: '15px' }}>
                <a
                  href="mailto:support@poplove.app"
                  style={{
                    color: '#666',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'color 0.3s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#e63946' }}
                  onMouseOut={(e) => { e.currentTarget.style.color = '#666' }}
                >
                  <span>✉️</span>
                  <span>support@poplove.app</span>
                </a>
              </li>
            </ul>
          </div>

          {/* ============ COLONNE 3 : FOLLOW US + LOGO ============ */}
          <div>
            {/* Logo POPLOVE */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '40px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: '#e63946',
                  letterSpacing: '1px'
                }}>
                  poplove
                </span>
                <span style={{
                  fontSize: '1.5rem',
                  color: '#ff6b9d',
                  marginTop: '-10px'
                }}>
                  💕
                </span>
              </div>
            </div>

            {/* Follow us */}
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#333',
              marginBottom: '20px',
              marginTop: 0
            }}>
              Suivez-nous
            </h4>
            <div style={{
              display: 'flex',
              gap: '15px'
            }}>
              {/* Facebook */}
              <a
                href="https://facebook.com/poplove"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '45px',
                  height: '45px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  background: 'white'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#e63946'
                  e.currentTarget.style.background = '#e63946'
                  e.currentTarget.querySelector('svg').style.fill = 'white'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#ddd'
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.querySelector('svg').style.fill = '#333'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#333">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/poplove"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '45px',
                  height: '45px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  background: 'white'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#e63946'
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
                  e.currentTarget.querySelector('svg').style.stroke = 'white'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#ddd'
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.querySelector('svg').style.stroke = '#333'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com/@poplove"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '45px',
                  height: '45px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  background: 'white'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#e63946'
                  e.currentTarget.style.background = '#000'
                  e.currentTarget.querySelector('svg').style.fill = 'white'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#ddd'
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.querySelector('svg').style.fill = '#333'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#333">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ============ BANDE DE COPYRIGHT ============ */}
      <div style={{
        background: 'linear-gradient(135deg, #ffeef5 0%, #ffd6e7 100%)', // Rose clair POPLOVE
        padding: '25px 60px',
        textAlign: 'center'
      }}>
        <p style={{
          color: '#666',
          fontSize: '0.9rem',
          margin: '0 0 8px 0',
          lineHeight: 1.5
        }}>
          Copyright © 2026 POPLOVE. Tous droits réservés.
        </p>
        <p style={{
          color: '#888',
          fontSize: '0.85rem',
          margin: 0
        }}>
          Dakar, Sénégal • Abidjan, Côte d'Ivoire • Lomé, Togo
        </p>
      </div>
    </footer>
  )
}