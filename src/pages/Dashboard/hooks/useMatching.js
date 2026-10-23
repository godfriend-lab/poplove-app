import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../../../lib/supabaseClient'

// ============================================================================
// CONFIGURATION DU SCORING (poids de chaque critère sur 100)
// ============================================================================
const WEIGHTS = {
  interests: 40,        // Intérêts en commun (max 40 pts)
  relationship: 25,     // Compatibilité relationnelle (max 25 pts)
  city: 15,             // Même ville (15 pts)
  country: 10,          // Même pays (10 pts)
  age: 10,              // Âge proche (max 10 pts)
  lifestyle: 10,        // Mode de vie compatible (max 10 pts)
}

// ============================================================================
// COMPATIBILITÉ DES TYPES DE RELATION
// ============================================================================
const RELATIONSHIP_COMPATIBILITY = {
  relation: ['relation', 'mariage'],
  mariage: ['relation', 'mariage'],
  amitie: ['amitie', 'discuter'],
  discuter: ['discuter', 'amitie', 'relation'],
}

// ============================================================================
// CALCUL DE L'ÂGE
// ============================================================================
export function calculateAge(birthDate) {
  if (!birthDate) return null
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

// ============================================================================
// FONCTION PRINCIPALE DE CALCUL DE COMPATIBILITÉ
// ============================================================================
export function calculateCompatibility(userProfile, otherProfile) {
  if (!userProfile || !otherProfile) return { score: 0, details: {} }
  if (userProfile.id === otherProfile.id) return { score: 0, details: {} }

  let score = 0
  const details = {}

  // 1. INTÉRÊTS EN COMMUN (max 40 pts)
  const userInterests = userProfile.interests || []
  const otherInterests = otherProfile.interests || []
  const commonInterests = userInterests.filter(i => otherInterests.includes(i))
  const maxCommon = Math.min(userInterests.length, otherInterests.length, 20)
  const interestScore = maxCommon > 0 ? (commonInterests.length / maxCommon) * WEIGHTS.interests : 0
  score += interestScore
  details.interests = {
    score: Math.round(interestScore),
    max: WEIGHTS.interests,
    common: commonInterests,
    count: commonInterests.length
  }

  // 2. COMPATIBILITÉ RELATIONNELLE (max 25 pts)
  const userLookingFor = userProfile.looking_for
  const otherLookingFor = otherProfile.looking_for
  let relationScore = 0
  if (userLookingFor && otherLookingFor) {
    const compatible = RELATIONSHIP_COMPATIBILITY[userLookingFor] || []
    if (compatible.includes(otherLookingFor)) {
      relationScore = userLookingFor === otherLookingFor ? WEIGHTS.relationship : WEIGHTS.relationship * 0.7
    }
  }
  score += relationScore
  details.relationship = {
    score: Math.round(relationScore),
    max: WEIGHTS.relationship,
    compatible: relationScore > 0
  }

  // 3. MÊME VILLE (15 pts)
  const cityScore = (userProfile.city && otherProfile.city && 
    userProfile.city.toLowerCase() === otherProfile.city.toLowerCase()) 
    ? WEIGHTS.city : 0
  score += cityScore
  details.city = {
    score: cityScore,
    max: WEIGHTS.city,
    match: cityScore > 0
  }

  // 4. MÊME PAYS (10 pts)
  const countryScore = (userProfile.country && otherProfile.country && 
    userProfile.country.toLowerCase() === otherProfile.country.toLowerCase()) 
    ? WEIGHTS.country : 0
  score += countryScore
  details.country = {
    score: countryScore,
    max: WEIGHTS.country,
    match: countryScore > 0
  }

  // 5. ÂGE PROCHE (max 10 pts) - différence de ±5 ans = 10 pts, ±10 ans = 5 pts
  const userAge = calculateAge(userProfile.birth_date)
  const otherAge = calculateAge(otherProfile.birth_date)
  let ageScore = 0
  if (userAge && otherAge) {
    const diff = Math.abs(userAge - otherAge)
    if (diff <= 3) ageScore = WEIGHTS.age
    else if (diff <= 5) ageScore = WEIGHTS.age * 0.8
    else if (diff <= 10) ageScore = WEIGHTS.age * 0.5
    else if (diff <= 15) ageScore = WEIGHTS.age * 0.2
  }
  score += ageScore
  details.age = {
    score: Math.round(ageScore),
    max: WEIGHTS.age,
    userAge,
    otherAge,
    diff: userAge && otherAge ? Math.abs(userAge - otherAge) : null
  }

  // 6. MODE DE VIE COMPATIBLE (max 10 pts)
  let lifestyleScore = 0
  const lifestyleChecks = []

  // Tabac compatible
  if (userProfile.smoking_status && otherProfile.smoking_status) {
    if (userProfile.smoking_status === otherProfile.smoking_status) {
      lifestyleScore += 3.5
      lifestyleChecks.push({ label: 'Tabac', match: true })
    } else if (
      (userProfile.smoking_status === 'never' && otherProfile.smoking_status === 'former') ||
      (userProfile.smoking_status === 'former' && otherProfile.smoking_status === 'never')
    ) {
      lifestyleScore += 2
      lifestyleChecks.push({ label: 'Tabac', match: 'partial' })
    } else {
      lifestyleChecks.push({ label: 'Tabac', match: false })
    }
  }

  // Alcool compatible
  if (userProfile.drinking_status && otherProfile.drinking_status) {
    if (userProfile.drinking_status === otherProfile.drinking_status) {
      lifestyleScore += 3.5
      lifestyleChecks.push({ label: 'Alcool', match: true })
    } else if (
      (userProfile.drinking_status === 'never' && otherProfile.drinking_status === 'occasionally') ||
      (userProfile.drinking_status === 'occasionally' && otherProfile.drinking_status === 'never')
    ) {
      lifestyleScore += 2
      lifestyleChecks.push({ label: 'Alcool', match: 'partial' })
    } else {
      lifestyleChecks.push({ label: 'Alcool', match: false })
    }
  }

  score += lifestyleScore
  details.lifestyle = {
    score: Math.round(lifestyleScore),
    max: WEIGHTS.lifestyle,
    checks: lifestyleChecks
  }

  return {
    score: Math.round(score),
    details
  }
}

// ============================================================================
// HOOK PRINCIPAL : useMatching
// ============================================================================
export function useMatching() {
  const [profiles, setProfiles] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  // Charger l'utilisateur connecté et son profil
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setCurrentUser(null)
          return
        }
        setCurrentUser(session.user)

        // Charger le profil complet de l'utilisateur
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) throw error
        setUserProfile(profileData)
      } catch (err) {
        console.error('Erreur chargement utilisateur:', err)
      }
    }
    loadUser()
  }, [])

  // Charger tous les profils et calculer la compatibilité
  useEffect(() => {
    const loadProfiles = async () => {
      if (!currentUser || !userProfile) return
      
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', currentUser.id) // Exclure l'utilisateur lui-même
          .order('created_at', { ascending: false })

        if (error) throw error

        // Calculer le score de compatibilité pour chaque profil
        const profilesWithScore = (data || []).map(profile => {
          const { score, details } = calculateCompatibility(userProfile, profile)
          return {
            ...profile,
            compatibility: {
              score,
              details,
              level: score >= 80 ? 'excellent' : 
                     score >= 60 ? 'bon' : 
                     score >= 40 ? 'moyen' : 'faible'
            }
          }
        })

        // Trier par score de compatibilité décroissant
        profilesWithScore.sort((a, b) => b.compatibility.score - a.compatibility.score)

        setProfiles(profilesWithScore)
      } catch (err) {
        console.error('Erreur chargement profils:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfiles()
  }, [currentUser, userProfile])

  return { profiles, loading, userProfile, currentUser }
}

// ============================================================================
// LABELS POUR L'AFFICHAGE
// ============================================================================
export const getCompatibilityLabel = (score) => {
  if (score >= 80) return { text: 'Excellent match', color: '#4fd1a1', emoji: '💖' }
  if (score >= 60) return { text: 'Bon match', color: '#ffb04a', emoji: '' }
  if (score >= 40) return { text: 'Match moyen', color: '#ff9cb8', emoji: '💗' }
  return { text: 'Faible compatibilité', color: '#ab9aa7', emoji: '🤍' }
}

export const getLookingForLabel = (value) => {
  const labels = {
    relation: '💕 Relation sérieuse',
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
    homosexual: '️‍🌈 Homosexuel',
    bisexual: '💗 Bisexuel',
    pansexual: '💖 Pansexuel',
    asexual: '🤍 Asexuel',
    other: '💫 Autre'
  }
  return labels[value] || value
}