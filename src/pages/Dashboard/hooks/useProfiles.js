import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabaseClient'

export function useProfiles() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  // Vérifier l'authentification
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setCurrentUser(session?.user || null)
    }
    checkUser()
  }, [])

  // Charger les profils
  const loadProfiles = async (filters = {}) => {
    if (!currentUser) return
    
    setLoading(true)
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      // Filtre par genre
      if (filters.gender && filters.gender !== 'all') {
        query = query.eq('gender', filters.gender)
      }

      // Filtre par ville
      if (filters.city?.trim()) {
        query = query.ilike('city', `%${filters.city.trim()}%`)
      }

      const { data, error } = await query
      if (error) throw error
      setProfiles(data || [])
    } catch (err) {
      console.error('Erreur chargement profils:', err)
    } finally {
      setLoading(false)
    }
  }

  // Recharger quand les filtres changent
  useEffect(() => {
    loadProfiles()
  }, [currentUser])

  return { profiles, loading, currentUser, loadProfiles }
}

// Utilitaire pour calculer l'âge
export function calculateAge(birthDate) {
  if (!birthDate) return null
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

// Utilitaires pour les labels
export const getLookingForLabel = (value) => {
  const labels = {
    relation: ' Relation sérieuse',
    mariage: '💍 Mariage',
    amitie: '🤝 Amitié',
    discuter: '💬 Échanger'
  }
  return labels[value] || value
}

export const getSmokingLabel = (value) => {
  const labels = {
    never: '🚭 Jamais',
    occasionally: '🚬 Occasionnellement',
    regularly: '🔥 Régulièrement',
    former: '✅ Ancien fumeur'
  }
  return labels[value] || value
}

export const getDrinkingLabel = (value) => {
  const labels = {
    never: '🚱 Jamais',
    occasionally: '🥂 Occasionnellement',
    socially: '🍷 Socialement',
    regularly: '🍺 Régulièrement'
  }
  return labels[value] || value
}

export const getOrientationLabel = (value) => {
  const labels = {
    heterosexual: '💑 Hétérosexuel',
    homosexual: '🏳️‍ Homosexuel',
    bisexual: ' Bisexuel',
    pansexual: ' Pansexuel',
    asexual: ' Asexuel',
    other: ' Autre'
  }
  return labels[value] || value
}