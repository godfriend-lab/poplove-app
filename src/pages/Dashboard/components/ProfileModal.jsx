import { useState } from 'react'
import { 
  calculateAge, 
  getLookingForLabel, 
  getSmokingLabel, 
  getDrinkingLabel, 
  getOrientationLabel, 
  getCompatibilityLabel 
} from '../hooks/useMatching'

export default function ProfileModal({ profile, onClose }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null)
  
  if (!profile) return null

  const age = calculateAge(profile.birth_date)
  const cleanPhone = profile.phone?.replace(/[\s\-\+\(\)]/g, '') || ''
  const compat = profile.compatibility || { score: 0, details: {} }
  const compatInfo = getCompatibilityLabel(compat.score)
  const allPhotos = profile.photos || []

  // Gestion de la lightbox
  const openPhotoViewer = (index) => setSelectedPhotoIndex(index)
  const closePhotoViewer = () => setSelectedPhotoIndex(null)
  const nextPhoto = () => setSelectedPhotoIndex((prev) => (prev + 1) % allPhotos.length)
  const prevPhoto = () => setSelectedPhotoIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length)

  // Navigation clavier
  const handleKeyDown = (e) => {
    if (selectedPhotoIndex === null) return
    if (e.key === 'Escape') closePhotoViewer()
    if (e.key === 'ArrowRight') nextPhoto()
    if (e.key === 'ArrowLeft') prevPhoto()
  }

  const handleContact = () => {
    if (!cleanPhone) {
      alert('️ Cet utilisateur n\'a pas renseigné son numéro de téléphone.')
      return
    }
    const message = encodeURIComponent(
      `Bonjour ${profile.first_name} ! 👋\n\nJe vous ai découvert(e) sur POPLOVE et j'aimerais faire votre connaissance. 😊`
    )
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank')
  }

  const getBarWidth = (score, max) => {
    if (!max || max === 0) return 0
    return Math.min((score / max) * 100, 100)
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose} aria-label="Fermer">✕</button>
          
          {/* ==================== HEADER ==================== */}
          <div className="modal-header">
            <div className="modal-photo">
              {allPhotos[0] ? (
                <img 
                  src={allPhotos[0]} 
                  alt={`${profile.first_name} ${profile.last_name}`}
                  onClick={() => openPhotoViewer(0)}
                  className="modal-photo-clickable"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                <div className="modal-no-photo">👤</div>
              )}
              
              <div className="modal-compat-badge" style={{ background: compatInfo.color }}>
                <span className="modal-compat-emoji">{compatInfo.emoji}</span>
                <span className="modal-compat-score">{compat.score}%</span>
              </div>
            </div>
            
            <div className="modal-title">
              <h2>
                {profile.first_name} {profile.last_name}
                {age && <span className="modal-age">, {age} ans</span>}
              </h2>
              <p className="modal-location">📍 {profile.city}, {profile.country}</p>
              {profile.looking_for && (
                <p className="modal-looking">{getLookingForLabel(profile.looking_for)}</p>
              )}
            </div>
          </div>

          {/* ==================== BODY ==================== */}
          <div className="modal-body">
            
            {/* --- Analyse de compatibilité --- */}
            {compat.details && Object.keys(compat.details).length > 0 && (
              <div className="modal-section compat-details-section">
                <h3>🎯 Analyse de compatibilité</h3>
                
                {compat.details.interests && compat.details.interests.count > 0 && (
                  <div className="compat-detail-item">
                    <div className="compat-detail-header">
                      <span>🎨 Intérêts en commun</span>
                      <span className="compat-detail-score">
                        {compat.details.interests.score}/{compat.details.interests.max} pts
                      </span>
                    </div>
                    <div className="compat-bar">
                      <div 
                        className="compat-bar-fill" 
                        style={{ 
                          width: `${getBarWidth(compat.details.interests.score, compat.details.interests.max)}%`,
                          background: 'linear-gradient(90deg, #ff5c8a, #d6335f)'
                        }}
                      />
                    </div>
                    <div className="common-interests-list">
                      {compat.details.interests.common.map((interest, idx) => (
                        <span key={idx} className="common-tag">✓ {interest}</span>
                      ))}
                    </div>
                  </div>
                )}

                {compat.details.relationship && (
                  <div className="compat-detail-item">
                    <div className="compat-detail-header">
                      <span>💕 Relation compatible</span>
                      <span className="compat-detail-score">
                        {compat.details.relationship.score}/{compat.details.relationship.max} pts
                      </span>
                    </div>
                    <div className="compat-bar">
                      <div 
                        className="compat-bar-fill" 
                        style={{ 
                          width: `${getBarWidth(compat.details.relationship.score, compat.details.relationship.max)}%`,
                          background: compat.details.relationship.compatible ? '#4fd1a1' : '#ff4757'
                        }}
                      />
                    </div>
                    <p className="compat-note">
                      {compat.details.relationship.compatible 
                        ? '✅ Vous recherchez tous les deux quelque chose de similaire' 
                        : '⚠️ Vos attentes relationnelles diffèrent'}
                    </p>
                  </div>
                )}

                {(compat.details.city || compat.details.country) && (
                  <div className="compat-detail-item">
                    <div className="compat-detail-header">
                      <span> Localisation</span>
                      <span className="compat-detail-score">
                        {(compat.details.city?.score || 0) + (compat.details.country?.score || 0)}/25 pts
                      </span>
                    </div>
                    <div className="compat-bar">
                      <div 
                        className="compat-bar-fill" 
                        style={{ 
                          width: `${getBarWidth((compat.details.city?.score || 0) + (compat.details.country?.score || 0), 25)}%`,
                          background: '#ffb04a'
                        }}
                      />
                    </div>
                    <p className="compat-note">
                      {compat.details.city?.match 
                        ? `🏙️ Vous êtes tous les deux à ${profile.city}` 
                        : compat.details.country?.match 
                          ? `🌍 Vous êtes dans le même pays (${profile.country})` 
                          : '🌐 Vous êtes dans des pays différents'}
                    </p>
                  </div>
                )}

                {compat.details.age && compat.details.age.userAge && (
                  <div className="compat-detail-item">
                    <div className="compat-detail-header">
                      <span>🎂 Âge</span>
                      <span className="compat-detail-score">
                        {compat.details.age.score}/{compat.details.age.max} pts
                      </span>
                    </div>
                    <div className="compat-bar">
                      <div 
                        className="compat-bar-fill" 
                        style={{ 
                          width: `${getBarWidth(compat.details.age.score, compat.details.age.max)}%`,
                          background: '#9ad46b'
                        }}
                      />
                    </div>
                    <p className="compat-note">
                      Différence d'âge : {compat.details.age.diff} an{compat.details.age.diff > 1 ? 's' : ''}
                    </p>
                  </div>
                )}

                {compat.details.lifestyle?.checks?.length > 0 && (
                  <div className="compat-detail-item">
                    <div className="compat-detail-header">
                      <span>🌟 Mode de vie</span>
                      <span className="compat-detail-score">
                        {compat.details.lifestyle.score}/{compat.details.lifestyle.max} pts
                      </span>
                    </div>
                    <div className="lifestyle-compat-grid">
                      {compat.details.lifestyle.checks.map((check, idx) => (
                        <div 
                          key={idx} 
                          className={`lifestyle-check ${
                            check.match === true ? 'match' : 
                            check.match === 'partial' ? 'partial' : 'no-match'
                          }`}
                        >
                          <span>{check.label}</span>
                          <span>
                            {check.match === true ? '✅' : 
                             check.match === 'partial' ? '🟡' : '❌'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- À propos --- */}
            {profile.description && (
              <div className="modal-section">
                <h3>📝 À propos</h3>
                <p className="modal-description">{profile.description}</p>
              </div>
            )}

            {/* --- Centres d'intérêt --- */}
            {profile.interests?.length > 0 && (
              <div className="modal-section">
                <h3>🎯 Centres d'intérêt ({profile.interests.length})</h3>
                <div className="modal-interests">
                  {profile.interests.map((interest, idx) => {
                    const isCommon = compat.details?.interests?.common?.includes(interest)
                    return (
                      <span 
                        key={idx} 
                        className={`modal-interest-tag ${isCommon ? 'is-common' : ''}`}
                      >
                        {isCommon && '✓ '}{interest}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* --- Mode de vie --- */}
            {(profile.smoking_status || profile.drinking_status || profile.sexual_orientation) && (
              <div className="modal-section">
                <h3>🌟 Mode de vie</h3>
                <div className="modal-lifestyle">
                  {profile.smoking_status && (
                    <div className="lifestyle-item">
                      <span className="lifestyle-label">🚬 Tabac :</span>
                      <span>{getSmokingLabel(profile.smoking_status)}</span>
                    </div>
                  )}
                  {profile.drinking_status && (
                    <div className="lifestyle-item">
                      <span className="lifestyle-label">🍷 Alcool :</span>
                      <span>{getDrinkingLabel(profile.drinking_status)}</span>
                    </div>
                  )}
                  {profile.sexual_orientation && (
                    <div className="lifestyle-item">
                      <span className="lifestyle-label">💕 Orientation :</span>
                      <span>{getOrientationLabel(profile.sexual_orientation)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- Photos (cliquables) --- */}
            {allPhotos.length > 1 && (
              <div className="modal-section">
                <h3>📸 Photos ({allPhotos.length})</h3>
                <div className="modal-photos-grid">
                  {allPhotos.slice(1).map((photo, idx) => (
                    <img 
                      key={idx} 
                      src={photo} 
                      alt={`Photo ${idx + 2}`} 
                      className="modal-photo-thumb modal-photo-clickable"
                      onClick={() => openPhotoViewer(idx + 1)}
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ==================== FOOTER ==================== */}
          <div className="modal-footer">
            <button className="modal-btn modal-btn-pass" onClick={onClose}>
              ✕ Passer
            </button>
            <button className="modal-btn modal-btn-like">
              ♥ J'aime
            </button>
            <button 
              className="modal-btn modal-btn-contact"
              onClick={handleContact}
              title={cleanPhone ? `Contacter sur WhatsApp` : 'Numéro non disponible'}
            >
              💬 Contacter
            </button>
          </div>
        </div>
      </div>

      {/* ==================== LIGHTBOX ==================== */}
      {selectedPhotoIndex !== null && (
        <div 
          className="photo-lightbox" 
          onClick={closePhotoViewer}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Visionneuse de photos"
        >
          <button className="lightbox-close" onClick={closePhotoViewer} aria-label="Fermer">✕</button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); prevPhoto() }} aria-label="Photo précédente">‹</button>
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); nextPhoto() }} aria-label="Photo suivante">›</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={allPhotos[selectedPhotoIndex]} 
              alt={`Photo ${selectedPhotoIndex + 1}`}
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <div className="lightbox-counter">
              {selectedPhotoIndex + 1} / {allPhotos.length}
            </div>
          </div>
        </div>
      )}

      {/* ==================== STYLES LIGHTBOX ==================== */}
      <style>{`
        .photo-lightbox {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease;
          outline: none;
        }

        .lightbox-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 1.8rem;
          cursor: pointer;
          z-index: 2001;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lightbox-close:hover {
          background: #d6335f;
          transform: rotate(90deg);
        }

        .lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 2.5rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2001;
        }

        .lightbox-nav:hover {
          background: #ff5c8a;
          transform: translateY(-50%) scale(1.1);
        }

        .lightbox-prev { left: 20px; }
        .lightbox-next { right: 20px; }

        .lightbox-content {
          max-width: 90vw;
          max-height: 90vh;
          position: relative;
          animation: zoomIn 0.3s ease;
        }

        .lightbox-content img {
          max-width: 100%;
          max-height: 90vh;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .lightbox-counter {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .modal-photo-clickable {
          cursor: zoom-in;
          transition: transform 0.3s;
        }

        .modal-photo-clickable:hover {
          transform: scale(1.02);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 768px) {
          .lightbox-nav {
            width: 45px;
            height: 45px;
            font-size: 1.8rem;
          }
          .lightbox-prev { left: 10px; }
          .lightbox-next { right: 10px; }
          .lightbox-close {
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </>
  )
}