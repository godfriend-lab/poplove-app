import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function EditProfileModal({ onClose, userId, userProfile, onProfileUpdated }) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef(null)

  // Sécuriser la lecture des intérêts (au cas où Supabase les renvoie en string JSON)
  const initialInterests = Array.isArray(userProfile?.interests)
    ? userProfile.interests
    : (typeof userProfile?.interests === 'string' ? JSON.parse(userProfile.interests) : [])

  const [formData, setFormData] = useState({
    prenom: userProfile?.prenom || '',
    nom: userProfile?.nom || '',
    age: userProfile?.age || '',
    genre: userProfile?.genre || 'Femme',
    ville: userProfile?.ville || '',
    bio: userProfile?.bio || '',
    whatsapp_number: userProfile?.whatsapp_number || '',
    interests: initialInterests
  })

  const [photoPreview, setPhotoPreview] = useState(userProfile?.photo_url || '')
  const [existingPhotos, setExistingPhotos] = useState([])
  const [newPhotos, setNewPhotos] = useState([])
  const [newPhotoPreviews, setNewPhotoPreviews] = useState([])

  const allInterests = [
    { name: 'Voyages', icon: '✈️' },
    { name: 'Musique', icon: '🎵' },
    { name: 'Lecture', icon: '📚' },
    { name: 'Sport', icon: '🏃' },
    { name: 'Cuisine', icon: '🍳' },
    { name: 'Photographie', icon: '📷' },
    { name: 'Cinéma', icon: '🎬' },
    { name: 'Danse', icon: '💃' }
  ]

  useEffect(() => {
    loadExistingPhotos()
  }, [userId])

  const loadExistingPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('user_photos')
        .select('photo_url, id')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (error) throw error
      if (data) setExistingPhotos(data)
    } catch (err) {
      console.error('Erreur chargement photos:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleInterest = (interestName) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestName)
        ? prev.interests.filter(i => i !== interestName)
        : [...prev.interests, interestName]
    }))
  }

  // Upload photo de profil principale (Avatar)
  const handleAvatarSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('La photo doit faire moins de 5MB')
      return
    }

    setUploading(true)
    setError('')

    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result)
    reader.readAsDataURL(file)

    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      setError('Erreur upload : ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ photo_url: publicUrl })
      .eq('id', userId)

    if (updateError) {
      setError('Erreur mise à jour : ' + updateError.message)
    } else {
      setSuccess('✅ Photo de profil mise à jour !')
      setTimeout(() => setSuccess(''), 3000)
    }

    setUploading(false)
  }

  // Ajouter de nouvelles photos
  const handleNewPhotosSelect = (e) => {
    const files = Array.from(e.target.files)
    const totalPhotos = existingPhotos.length + newPhotos.length
    
    if (totalPhotos + files.length > 6) {
      setError(`Maximum 6 photos autorisées. Vous en avez déjà ${totalPhotos}.`)
      return
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`Le fichier ${file.name} dépasse 5MB`)
        return
      }
    }

    const newPreviews = []
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result)
        if (newPreviews.length === files.length) {
          setNewPhotoPreviews(prev => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })

    setNewPhotos(prev => [...prev, ...files])
    setError('')
  }

  // Supprimer une photo existante (Base de données + Storage)
  const removeExistingPhoto = async (photoId, photoUrl) => {
    try {
      // 1. Supprimer de la base de données
      await supabase.from('user_photos').delete().eq('id', photoId)

      // 2. Supprimer du Storage (extraire le chemin relatif)
      const path = photoUrl.split('/profile-photos/')[1]
      if (path) {
        await supabase.storage.from('profile-photos').remove([path])
      }

      setExistingPhotos(prev => prev.filter(p => p.id !== photoId))
      setSuccess('✅ Photo supprimée')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      setError('Erreur suppression : ' + err.message)
    }
  }

  // Supprimer une nouvelle photo (pas encore uploadée)
  const removeNewPhoto = (index) => {
    setNewPhotos(prev => prev.filter((_, i) => i !== index))
    setNewPhotoPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // ✅ CORRECTION CRITIQUE : Nettoyer le numéro WhatsApp avant sauvegarde
      const cleanWhatsAppNumber = formData.whatsapp_number.replace(/[\s\-\.\(\)]/g, '')
      const finalWhatsAppNumber = cleanWhatsAppNumber.startsWith('+') ? cleanWhatsAppNumber : '+' + cleanWhatsAppNumber

      // 1. Mettre à jour les informations du profil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          prenom: formData.prenom,
          nom: formData.nom,
          age: parseInt(formData.age),
          genre: formData.genre,
          ville: formData.ville,
          bio: formData.bio,
          whatsapp_number: finalWhatsAppNumber, // ← Numéro propre et formaté
          interests: formData.interests,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (profileError) throw profileError

      // 2. Upload des nouvelles photos
      if (newPhotos.length > 0) {
        const newPhotoUrls = []
        
        for (let i = 0; i < newPhotos.length; i++) {
          const photo = newPhotos[i]
          const fileExt = photo.name.split('.').pop()
          const timestamp = Date.now()
          const randomStr = Math.random().toString(36).substring(7)
          const fileName = `${userId}/gallery_${timestamp}_${randomStr}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('profile-photos')
            .upload(fileName, photo)

          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage
            .from('profile-photos')
            .getPublicUrl(fileName)

          newPhotoUrls.push(publicUrl)
        }

        // Insérer les nouvelles photos dans user_photos
        const photosToInsert = newPhotoUrls.map(url => ({
          user_id: userId,
          photo_url: url,
          is_primary: false
        }))

        const { error: insertError } = await supabase
          .from('user_photos')
          .insert(photosToInsert)

        if (insertError) throw insertError
      }

      setSuccess('✅ Profil mis à jour avec succès !')
      setTimeout(() => {
        onProfileUpdated()
        onClose()
      }, 1500)
    } catch (err) {
      console.error('Erreur mise à jour profil:', err)
      setError('Erreur : ' + err.message)
    }

    setLoading(false)
  }

  const totalPhotos = existingPhotos.length + newPhotos.length

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
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
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'white'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem',
            margin: 0,
            background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ✏️ Modifier mon profil
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }}>×</button>
        </div>

        {error && (
          <div style={{ background: 'rgba(230, 57, 70, 0.2)', border: '1px solid #e63946', borderRadius: '12px', padding: '12px', marginBottom: '20px', color: '#ff6b9d' }}>{error}</div>
        )}

        {success && (
          <div style={{ background: 'rgba(37, 211, 102, 0.2)', border: '1px solid #25D366', borderRadius: '12px', padding: '12px', marginBottom: '20px', color: '#25D366' }}>{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* PHOTO DE PROFIL */}
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>📸 Photo de profil (Avatar)</h3>
            
            <div
              style={{
                width: '150px',
                height: '150px',
                margin: '0 auto 15px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid #ff6b9d',
                cursor: 'pointer',
                position: 'relative',
                background: 'rgba(255,255,255,0.1)'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem' }}>📷</div>
              )}
              
              {uploading && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>⏳</div>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarSelect} style={{ display: 'none' }} />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                padding: '10px 25px',
                background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
                border: 'none',
                color: 'white',
                borderRadius: '50px',
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              {uploading ? 'Upload...' : '📤 Changer la photo'}
            </button>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '10px' }}>JPG, PNG • Max 5MB</p>
          </div>

          {/* INFOS PERSONNELLES */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Prénom *</label>
              <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '1rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Nom</label>
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '1rem' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Âge *</label>
              <input type="number" name="age" min="18" max="99" value={formData.age} onChange={handleChange} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '1rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Genre *</label>
              <select name="genre" value={formData.genre} onChange={handleChange} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '1rem' }}>
                <option value="Femme">👩 Femme</option>
                <option value="Homme">👨 Homme</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Ville *</label>
            <input type="text" name="ville" placeholder="Ex: Dakar, Abidjan..." value={formData.ville} onChange={handleChange} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '1rem' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>📱 Numéro WhatsApp *</label>
            <input 
              type="tel" 
              name="whatsapp_number" 
              placeholder="+221 77 XXX XX XX" 
              value={formData.whatsapp_number} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '1rem' }} 
            />
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '5px' }}>
              💡 Le format sera automatiquement nettoyé (ex: +221771234567)
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Bio *</label>
            <textarea name="bio" placeholder="Parle-nous de toi..." value={formData.bio} onChange={handleChange} required rows="3" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '1rem', resize: 'vertical', fontFamily: "'Poppins', sans-serif" }} />
          </div>

          {/* CENTRES D'INTÉRÊT */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>❤️ Centres d'intérêt</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {allInterests.map((interest) => {
                const isSelected = formData.interests.includes(interest.name)
                return (
                  <button
                    key={interest.name}
                    type="button"
                    onClick={() => toggleInterest(interest.name)}
                    style={{
                      padding: '10px 18px',
                      background: isSelected ? 'linear-gradient(135deg, #ff6b9d, #e63946)' : 'rgba(255,255,255,0.1)',
                      border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '50px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {interest.icon} {interest.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* GESTION DES PHOTOS */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>📸 Mes photos ({totalPhotos}/6)</h3>
            
            {/* Photos existantes */}
            {existingPhotos.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '10px' }}>Photos actuelles :</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {existingPhotos.map((photo, index) => (
                    <div key={photo.id} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
                      <img src={photo.photo_url} alt={`Photo ${index + 1}`} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeExistingPhoto(photo.id, photo.photo_url)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          background: 'rgba(230, 57, 70, 0.9)',
                          border: 'none',
                          color: 'white',
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nouvelles photos */}
            {newPhotoPreviews.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '10px' }}>Nouvelles photos :</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {newPhotoPreviews.map((preview, index) => (
                    <div key={index} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
                      <img src={preview} alt={`Nouvelle photo ${index + 1}`} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeNewPhoto(index)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          background: 'rgba(230, 57, 70, 0.9)',
                          border: 'none',
                          color: 'white',
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton ajouter photos */}
            {totalPhotos < 6 && (
              <div
                style={{
                  border: '2px dashed rgba(255,255,255,0.3)',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('new-photos-input').click()}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#ff6b9d'; e.currentTarget.style.background = 'rgba(255, 107, 157, 0.05)' }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>➕</div>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, margin: 0 }}>
                  Ajouter des photos ({6 - totalPhotos} restantes)
                </p>
              </div>
            )}

            <input id="new-photos-input" type="file" accept="image/*" multiple onChange={handleNewPhotosSelect} style={{ display: 'none' }} />
            
            {totalPhotos >= 6 && (
              <p style={{ color: '#ff6b9d', fontSize: '0.85rem', marginTop: '10px', textAlign: 'center' }}>
                Limite de 6 photos atteinte
              </p>
            )}
          </div>

          {/* BOUTONS */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                padding: '14px',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                border: 'none',
                color: 'white',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? '⏳ Enregistrement...' : '💾 Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}