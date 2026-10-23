import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import PhotoViewer from './PhotoViewer'

// Composant Badge de Vérification (SVG Bleu)
const VerifiedBadge = ({ size = 24 }) => (
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
      marginLeft: '8px',
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

export default function ProfileDetailModal({ profile, onClose, onContact }) {
  const [showPhotoViewer, setShowPhotoViewer] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [photos, setPhotos] = useState([])
  const [loadingPhotos, setLoadingPhotos] = useState(true)

  // Tous les intérêts possibles avec leurs icônes
  const allInterests = [
    { name: 'Voyages', icon: '✈️' },
    { name: 'Musique', icon: '🎵' },
    { name: 'Lecture', icon: '📚' },
    { name: 'Sport', icon: '🏃' },
    { name: 'Cuisine', icon: '' },
    { name: 'Photographie', icon: '📷' },
    { name: 'Cinéma', icon: '🎬' },
    { name: 'Danse', icon: '💃' }
  ]

  // Récupérer UNIQUEMENT les intérêts de l'utilisateur
  const userInterests = allInterests.filter(interest => 
    profile.interests && profile.interests.includes(interest.name)
  )

  useEffect(() => {
    loadPhotos()
  }, [profile.id])

  const loadPhotos = async () => {
    setLoadingPhotos(true)
    
    try {
      const { data, error } = await supabase
        .from('user_photos')
        .select('photo_url')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: true })

      if (error) throw error

      if (data && data.length > 0) {
        setPhotos(data.map(p => p.photo_url))
      } else {
        if (profile.photo_url) {
          setPhotos([profile.photo_url])
        } else {
          setPhotos([])
        }
      }
    } catch (err) {
      console.error('Erreur chargement photos:', err)
      if (profile.photo_url) {
        setPhotos([profile.photo_url])
      }
    }
    
    setLoadingPhotos(false)
  }

  const handlePhotoClick = (index) => {
    setSelectedPhotoIndex(index)
    setShowPhotoViewer(true)
  }

  const formatName = (name) => {
    if (!name) return ''
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  }

  const displayName = profile.prenom 
    ? `${formatName(profile.prenom)}${profile.nom ? ' ' + profile.nom.toUpperCase() : ''}`
    : 'Utilisateur'

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          overflow: 'auto'
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            color: '#333',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '20px 30px',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            background: 'white',
            borderRadius: '24px 24px 0 0',
            zIndex: 10
          }}>
            <h2 style={{ fontSize: '1.3rem', color: '#333', margin: 0 }}>Voir le profil</h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '2rem',
                cursor: 'pointer',
                color: '#999',
                padding: '0 10px',
                lineHeight: 1,
                transition: 'color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.color = '#e63946'}
              onMouseOut={(e) => e.target.style.color = '#999'}
            >
              ×
            </button>
          </div>

          {/* Contenu */}
          <div style={{ padding: '30px' }}>
            {/* Info principale */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'flex-start' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid #ff6b9d',
                flexShrink: 0,
                boxShadow: '0 5px 15px rgba(255, 107, 157, 0.3)'
              }}>
                {profile.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={profile.prenom}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    color: 'white'
                  }}>
                    👤
                  </div>
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <h1 style={{ 
                  fontSize: '2rem', 
                  fontWeight: 700, 
                  marginBottom: '8px', 
                  marginTop: 0, 
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '4px'
                }}>
                  {displayName}, {profile.age}
                  
                  {/* Badge de vérification BLEU */}
                  {profile.is_verified && <VerifiedBadge size={26} />}
                </h1>
                
                <p style={{ 
                  color: '#666', 
                  fontSize: '0.95rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '5px', 
                  marginBottom: '15px', 
                  margin: '0 0 15px 0' 
                }}>
                  📍 {profile.ville || 'Sénégal'}
                </p>
                
                <button
                  onClick={onContact}
                  style={{
                    padding: '12px 30px',
                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '50px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '1rem',
                    boxShadow: '0 5px 15px rgba(37, 211, 102, 0.3)',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 8px 20px rgba(37, 211, 102, 0.5)'
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

            {/* À propos */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                color: '#e63946', 
                marginBottom: '10px', 
                fontWeight: 600, 
                margin: '0 0 10px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                💬 À propos de moi
              </h3>
              <p style={{ lineHeight: 1.7, color: '#555', margin: 0 }}>
                {profile.bio || 'Aucune bio disponible.'}
              </p>
            </div>

            {/* Centres d'intérêt - UNIQUEMENT ceux sélectionnés */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                color: '#e63946', 
                marginBottom: '15px', 
                fontWeight: 600, 
                margin: '0 0 15px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ❤️ Mes centres d'intérêt
              </h3>
              {userInterests.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {userInterests.map((interest, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(255, 107, 157, 0.1)',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        color: '#e63946',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontWeight: 500
                      }}
                    >
                      {interest.icon} {interest.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#999', fontStyle: 'italic', margin: 0 }}>
                  Aucun centre d'intérêt sélectionné
                </p>
              )}
            </div>

            {/* Photos */}
            <div style={{ marginBottom: '10px' }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                color: '#e63946', 
                marginBottom: '15px', 
                fontWeight: 600, 
                margin: '0 0 15px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                 Mes photos
              </h3>
              
              {loadingPhotos ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                  Chargement des photos...
                </div>
              ) : photos.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '30px', 
                  color: '#999', 
                  background: 'rgba(0,0,0,0.05)', 
                  borderRadius: '12px' 
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📷</div>
                  <p style={{ margin: 0 }}>Aucune photo disponible</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        onClick={() => handlePhotoClick(index)}
                        style={{
                          position: 'relative',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          aspectRatio: '1',
                          background: '#f0f0f0',
                          transition: 'transform 0.3s',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        onMouseOver={(e) => { 
                          e.currentTarget.style.transform = 'scale(1.05)'
                          e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)'
                        }}
                        onMouseOut={(e) => { 
                          e.currentTarget.style.transform = 'scale(1)'
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      >
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                  <p style={{ 
                    color: '#999', 
                    fontSize: '0.85rem', 
                    marginTop: '15px', 
                    textAlign: 'center',
                    fontStyle: 'italic'
                  }}>
                    👆 Clique sur une photo pour l'agrandir
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Viewer */}
      {showPhotoViewer && (
        <PhotoViewer
          photos={photos}
          initialIndex={selectedPhotoIndex}
          onClose={() => setShowPhotoViewer(false)}
        />
      )}
    </>
  )
}