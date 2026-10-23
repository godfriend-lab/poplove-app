import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function PublishModal({ onClose, userId, onSuccess }) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    age: '',
    genre: 'Femme',
    ville: '',
    bio: '',
    whatsapp_number: '',
    photo_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          ...formData,
          age: parseInt(formData.age),
          credits: 1,
          is_verified: false
        }
      ])

    if (error) {
      setError('Erreur : ' + error.message)
    } else {
      alert('✅ Profil publié avec succès !')
      onSuccess()
    }
    setLoading(false)
  }

  return (
    <div style={{
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
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'white'
      }}>
        <h2 style={{ 
          fontFamily: "'Playfair Display', serif",
          fontSize: '2rem', 
          marginBottom: '10px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          💕 Publier mon profil
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: '30px' }}>
          Renseigne tes informations pour apparaître sur POPLOVE
        </p>

        {error && (
          <div style={{
            background: 'rgba(230, 57, 70, 0.2)',
            border: '1px solid #e63946',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '20px',
            color: '#ff6b9d'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Fields... (même code que précédemment) */}
          
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
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
                fontWeight: 600
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
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? '⏳ Publication...' : '✅ Publier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}