// Composant Badge de Vérification (SVG Bleu)
const VerifiedBadge = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Profil vérifié"
    title="Profil vérifié"
    style={{ 
      display: 'inline-block', 
      verticalAlign: 'middle', 
      marginLeft: '6px',
      filter: 'drop-shadow(0 2px 4px rgba(29, 155, 240, 0.4))'
    }}
  >
    {/* Forme du badge bleu */}
    <path
      fill="#1D9BF0"
      d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4
      0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415
      13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.416-.165-.866-.25-1.336-.25
      -2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4C2.375 9.55
      1.5 10.92 1.5 12.5c0 1.495.782 2.798 1.942 3.486-.02.17-.032.344
      -.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25
      .62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25
      .415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4
      0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484Z"
    />
    {/* Coche blanche */}
    <path
      d="M9.7 15.4L6.8 12.5L8.1 11.2L9.7 12.8L14.9 7.6L16.2 8.9L9.7 15.4Z"
      fill="white"
    />
  </svg>
)

export default function ProfileCard({ profile, onViewProfile, onContact, index = 0 }) {
  // Vérifie si le profil est "Nouveau" (ex: créé il y a moins de 7 jours, ou via un flag is_new)
  const isNew = profile.is_new || false 

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)', // Style Glassmorphism adapté au thème sombre
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)'
        e.currentTarget.style.boxShadow = '0 20px 50px rgba(230, 57, 70, 0.2)'
        e.currentTarget.style.borderColor = 'rgba(255, 107, 157, 0.3)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)'
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* ============ ZONE PHOTO ============ */}
      <div style={{ position: 'relative', height: '380px', overflow: 'hidden' }}>
        <img
          src={profile.photo_url || 'https://via.placeholder.com/400x500?text=POPLOVE'}
          alt={`Photo de ${profile.prenom}`}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseOver={(e) => { e.target.style.transform = 'scale(1.05)' }}
          onMouseOut={(e) => { e.target.style.transform = 'scale(1)' }}
        />
        
        {/* Badges en haut de la photo */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          right: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          {/* Badge Nouveau */}
          {isNew && (
            <div style={{
              background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}>
              ✨ Nouveau
            </div>
          )}

          {/* Badge Vérifié (En haut à droite) */}
          {profile.is_verified && (
            <div style={{
              background: 'rgba(29, 155, 240, 0.9)',
              backdropFilter: 'blur(5px)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M9.7 15.4L6.8 12.5L8.1 11.2L9.7 12.8L14.9 7.6L16.2 8.9L9.7 15.4Z" />
              </svg>
              Vérifié
            </div>
          )}
        </div>

        {/* Overlay d'informations en bas de la photo */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
          padding: '30px 20px 20px',
          color: 'white'
        }}>
          <h3 style={{ 
            fontSize: '1.6rem', 
            fontWeight: 800, 
            marginBottom: '6px', 
            margin: '0 0 6px 0',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '4px'
          }}>
            {profile.prenom}, {profile.age}
            
            {/* Badge de vérification à côté de l'âge */}
            {profile.is_verified && <VerifiedBadge size={22} />}
          </h3>
          
          <p style={{ 
            fontSize: '0.95rem', 
            opacity: 0.9, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            margin: 0,
            fontWeight: 500
          }}>
            📍 {profile.ville || 'Localisation non précisée'}
          </p>
        </div>
      </div>

      {/* ============ ZONE ACTIONS ============ */}
      <div style={{ padding: '20px', display: 'flex', gap: '12px', background: 'rgba(0,0,0,0.2)' }}>
        <button
          onClick={(e) => { e.stopPropagation(); onViewProfile(); }}
          style={{
            flex: 1,
            padding: '14px',
            background: 'transparent',
            border: '2px solid rgba(255, 107, 157, 0.5)',
            color: '#ff6b9d',
            borderRadius: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 107, 157, 0.1)'
            e.target.style.borderColor = '#ff6b9d'
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent'
            e.target.style.borderColor = 'rgba(255, 107, 157, 0.5)'
          }}
        >
          👁️ Voir
        </button>
        
        <button
          onClick={(e) => { e.stopPropagation(); onContact(); }}
          style={{
            flex: 2,
            padding: '14px',
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            border: 'none',
            color: 'white',
            borderRadius: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 5px 15px rgba(37, 211, 102, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.5)'
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 5px 15px rgba(37, 211, 102, 0.3)'
          }}
        >
          💬 Contacter
        </button>
      </div>
    </div>
  )
}