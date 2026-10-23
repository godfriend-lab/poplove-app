import { createContext, useContext, useState, useEffect } from 'react'
import { availableLanguages, t } from '../i18n/translations'
import { supabase } from '../lib/supabaseClient'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState('fr')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLanguage()
  }, [])

  const loadLanguage = async () => {
    // 1. Essayer de charger depuis localStorage
    const savedLang = localStorage.getItem('poplove_language')
    if (savedLang && availableLanguages.find(l => l.code === savedLang)) {
      setCurrentLang(savedLang)
      setLoading(false)
      return
    }

    // 2. Essayer de charger depuis la base de données
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('language')
          .eq('id', session.user.id)
          .single()
        
        if (profile?.language && availableLanguages.find(l => l.code === profile.language)) {
          setCurrentLang(profile.language)
          localStorage.setItem('poplove_language', profile.language)
          setLoading(false)
          return
        }
      }
    } catch (err) {
      console.error('Erreur chargement langue:', err)
    }

    // 3. Utiliser la langue par défaut (français)
    setCurrentLang('fr')
    setLoading(false)
  }

  const changeLanguage = async (langCode) => {
    if (!availableLanguages.find(l => l.code === langCode)) {
      console.error(`Langue ${langCode} non disponible`)
      return
    }

    setCurrentLang(langCode)
    localStorage.setItem('poplove_language', langCode)

    // Sauvegarder dans la base de données si l'utilisateur est connecté
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await supabase
          .from('profiles')
          .update({ language: langCode })
          .eq('id', session.user.id)
      }
    } catch (err) {
      console.error('Erreur sauvegarde langue:', err)
    }
  }

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage, loading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export function useTranslate() {
  const { currentLang } = useLanguage()
  
  const translate = (key) => {
    return t(key, currentLang)
  }

  return translate
}

export default LanguageContext