import ProfileCard from './ProfileCard'

export default function ProfileGrid({ profiles, loading, onViewProfile }) {
  if (loading) {
    return (
      <div className="dash-loading">
        <div className="dash-spinner" />
        <p>Chargement des profils...</p>
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className="dash-empty">
        <div className="dash-empty-icon">💔</div>
        <h3>Aucun profil trouvé</h3>
        <p>Essayez de modifier vos filtres ou votre recherche.</p>
      </div>
    )
  }

  return (
    <div className="dash-profiles">
      {profiles.map((profile) => (
        <ProfileCard 
          key={profile.id} 
          profile={profile} 
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  )
}