import { useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function PublishProfile({ onClose, userId, onSuccess }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    age: '',
    genre: 'Femme',
    ville: '',
    bio: '',
    whatsapp_number: '',
    interests: []
  })

  const [photos, setPhotos] = useState([])
  const [photoPreviews, setPhotoPreviews] = useState([])

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

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files)
    
    if (photos.length + files.length > 6) {
      setError('Maximum 6 photos autorisées')
      return
    }

    // Vérifier la taille des fichiers (max 5MB chacun)
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
          setPhotoPreviews(prev => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })

    setPhotos(prev => [...prev, ...files])
    setError('')
  }

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index))
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('🚀 Début publication...', { userId, photosCount: photos.length, interests: formData.interests })

    try {
      // 1. Upload TOUTES les photos vers le bucket
      const uploadedUrls = []
      
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]
        const fileExt = photo.name.split('.').pop()
        
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(7)
        
        let fileName
        if (i === 0) {
          fileName = `${userId}/card_main_${timestamp}_${randomStr}.${fileExt}`
        } else {
          fileName = `${userId}/gallery_${i}_${timestamp}_${randomStr}.${fileExt}`
        }

        console.log(`📤 Upload photo ${i + 1}/${photos.length}:`, fileName)

        let uploadSuccess = false
        let lastError = null
        
        for (let attempt = 0; attempt < 3 && !uploadSuccess; attempt++) {
          try {
            const { data, error: uploadError } = await supabase.storage
              .from('profile-photos')
              .upload(fileName, photo, { 
                upsert: true,
                contentType: photo.type,
                cacheControl: '3600'
              })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
              .from('profile-photos')
              .getPublicUrl(fileName)

            console.log(`✅ Photo ${i + 1} uploadée:`, publicUrl)
            uploadedUrls.push(publicUrl)
            uploadSuccess = true
          } catch (err) {
            lastError = err
            console.warn(`Tentative ${attempt + 1} échouée:`, err.message)
            if (attempt < 2) {
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
          }
        }

        if (!uploadSuccess) {
          throw new Error(`Échec upload photo ${i + 1}: ${lastError.message}`)
        }
      }

      console.log('📸 Toutes les URLs uploadées:', uploadedUrls)

      // ✅ CORRECTION : Nettoyer le numéro WhatsApp avant de l'enregistrer
      const cleanWhatsAppNumber = formData.whatsapp_number.replace(/[\s\-\.\(\)]/g, '')
      const finalWhatsAppNumber = cleanWhatsAppNumber.startsWith('+') ? cleanWhatsAppNumber : '+' + cleanWhatsAppNumber
      console.log('📱 Numéro WhatsApp nettoyé pour la BDD:', finalWhatsAppNumber)

      // 2. Mettre à jour le profil ET le publier
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
          prenom: formData.prenom,
          nom: formData.nom,
          age: parseInt(formData.age),
          genre: formData.genre,
          ville: formData.ville,
          bio: formData.bio,
          whatsapp_number: finalWhatsAppNumber, // ← Numéro propre et formaté
          photo_url: uploadedUrls[0] || null,
          is_verified: false,
          is_published: true,
          interests: formData.interests,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()

      if (profileError) {
        console.error('❌ Erreur mise à jour profil:', profileError)
        throw profileError
      }

      console.log('✅ Profil publié avec succès:', profileData)

      // 3. Sauvegarder les URLs supplémentaires dans user_photos (pour la galerie)
      if (uploadedUrls.length > 1) {
        const photosToInsert = uploadedUrls.slice(1).map(url => ({
          user_id: userId,
          photo_url: url,
          is_primary: false
        }))

        // Supprimer anciennes photos de galerie
        await supabase
          .from('user_photos')
          .delete()
          .eq('user_id', userId)

        const { error: photosError } = await supabase
          .from('user_photos')
          .insert(photosToInsert)

        if (photosError) console.error('Erreur user_photos:', photosError)
      }

      alert('✅ Profil publié avec succès ! Il est maintenant visible sur le dashboard.')
      onSuccess()
    } catch (err) {
      console.error('💥 Erreur complète:', err)
      setError('Erreur : ' + (err.message || 'Échec de la publication'))
    }

    setLoading(false)
  }

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
          <div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              margin: 0,
              background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              💕 Publier mon profil
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: '10px 0 0 0', fontSize: '0.9rem' }}>
              Étape {step} sur 3
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }}>×</button>
        </div>

        {/* Barre de progression */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1,
              height: '4px',
              background: s <= step ? 'linear-gradient(135deg, #ff6b9d, #e63946)' : 'rgba(255,255,255,0.1)',
              borderRadius: '2px'
            }} />
          ))}
        </div>

        {error && (
          <div style={{ background: 'rgba(230, 57, 70, 0.2)', border: '1px solid #e63946', borderRadius: '12px', padding: '12px', marginBottom: '20px', color: '#ff6b9d' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ÉTAPE 1 : Infos */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>📝 Infos personnelles</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Prénom *</label>
                  <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '1rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Nom</label>
                  <input type="text" name="nom" value={formData.nom} onChange={handleChange} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '1rem' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
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

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Ville *</label>
                <input type="text" name="ville" placeholder="Ex: Dakar, Abidjan..." value={formData.ville} onChange={handleChange} required style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '1rem' }} />
              </div>

              <div>
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
            </div>
          )}

          {/* ÉTAPE 2 : Bio et intérêts */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>✨ À propos de toi</h3>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Bio *</label>
                <textarea name="bio" placeholder="Parle-nous de toi..." value={formData.bio} onChange={handleChange} required rows="4" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', fontSize: '1rem', resize: 'vertical', fontFamily: "'Poppins', sans-serif" }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '12px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Centres d'intérêt</label>
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
            </div>
          )}

          {/* ÉTAPE 3 : Photos */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>📸 Photos pour ta carte (1 à 6)</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: '0 0 10px 0' }}>💡 La première photo sera affichée sur ta carte</p>
              
              <div
                style={{
                  border: '2px dashed rgba(255,255,255,0.3)',
                  borderRadius: '16px',
                  padding: '30px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => fileInputRef.current?.click()}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#ff6b9d'; e.currentTarget.style.background = 'rgba(255, 107, 157, 0.05)' }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📷</div>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginBottom: '5px', margin: '0 0 5px 0' }}>Clique pour ajouter des photos</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0 }}>{photos.length}/6 photos • Max 5MB par photo</p>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotoSelect} style={{ display: 'none' }} />

              {photoPreviews.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '10px' }}>
                  {photoPreviews.map((preview, index) => (
                    <div key={index} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
                      <img src={preview} alt={`Photo ${index + 1}`} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                      {index === 0 && (
                        <div style={{ position: 'absolute', top: '5px', left: '5px', background: '#ff6b9d', padding: '3px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600 }}>⭐ Principale</div>
                      )}
                      <button type="button" onClick={() => removePhoto(index)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', width: '25px', height: '25px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Boutons navigation */}
          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}>← Précédent</button>
            )}
            
            {step < 3 ? (
              <button type="button" onClick={() => setStep(step + 1)} style={{ flex: 2, padding: '14px', background: 'linear-gradient(135deg, #ff6b9d, #e63946)', border: 'none', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}>Suivant →</button>
            ) : (
              <button type="submit" disabled={loading || photos.length === 0} style={{ flex: 2, padding: '14px', background: 'linear-gradient(135deg, #25D366, #128C7E)', border: 'none', color: 'white', borderRadius: '12px', cursor: (loading || photos.length === 0) ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '1rem', opacity: (loading || photos.length === 0) ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                {loading ? '⏳ Publication en cours...' : '✅ Publier mon profil'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}