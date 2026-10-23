import { calculateAge, getLookingForLabel, getCompatibilityLabel } from '../hooks/useMatching'

export default function ProfileCard({ profile, onViewProfile, onContact }) {
  const age = calculateAge(profile.birth_date)
  const mainPhoto = profile.photos?.[0] || null
  const compat = profile.compatibility || { score: 0, level: 'faible' }
  const compatInfo = getCompatibilityLabel(compat.score)

  const cleanPhone = profile.phone?.replace(/[\s\-\+\(\)]/g, '') || ''

  const handleContact = () => {
    if (!cleanPhone) {
      alert('⚠️ Cet utilisateur n\'a pas renseigné son numéro de téléphone.')
      return
    }
    const message = encodeURIComponent(
      `Bonjour ${profile.first_name} ! 👋\n\nJe vous ai découvert(e) sur POPLOVE et j'aimerais faire votre connaissance. 😊`
    )
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank')
  }

  return (
    <div className={`dash-card compat-${compat.level}`}>
      {/* Badge de compatibilité */}
      <div className="compatibility-badge" style={{ background: compatInfo.color }}>
        <span className="compat-emoji">{compatInfo.emoji}</span>
        <span className="compat-score">{compat.score}%</span>
      </div>

      <div className="dash-card-photo">
        {mainPhoto ? (
          <img src={mainPhoto} alt={`${profile.first_name} ${profile.last_name}`} />
        ) : (
          <div className="dash-card-no-photo">
            <span>👤</span>
            <p>Pas de photo</p>
          </div>
        )}
        {profile.photos?.length > 1 && (
          <span className="dash-card-photos-count">+{profile.photos.length - 1} photos</span>
        )}
      </div>
      
      <div className="dash-card-info">
        <h3>
          {profile.first_name}
          {age && <span className="dash-card-age">, {age}</span>}
        </h3>
        <p className="dash-card-location">📍 {profile.city}, {profile.country}</p>
        {profile.looking_for && (
          <p className="dash-card-looking">{getLookingForLabel(profile.looking_for)}</p>
        )}
        
        {/* Points communs rapides */}
        {compat.details?.interests?.count > 0 && (
          <div className="common-interests-preview">
            <span> {compat.details.interests.count} intérêt{compat.details.interests.count > 1 ? 's' : ''} en commun</span>
          </div>
        )}
      </div>

      <div className="dash-card-actions">
        <button 
          className="dash-action-btn dash-action-view" 
          onClick={() => onViewProfile(profile)}
        >
          👁️ Voir le profil
        </button>
        <button 
          className="dash-action-btn dash-action-contact"
          onClick={handleContact}
          title={cleanPhone ? `Contacter sur WhatsApp` : 'Numéro non disponible'}
        >
          💬 Contacter
        </button>
      </div>
    </div>
  )
}