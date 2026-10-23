import { Link, useLocation } from 'react-router-dom'

export default function LocalizedLink({ to, children, ...props }) {
  const { pathname } = useLocation()
  
  // Extrait la langue actuelle de l'URL (ex: "/es/contact" -> "es")
  const currentLang = pathname.split('/')[1] || 'fr'
  
  // S'assure que le chemin cible commence par un slash
  const cleanTo = to.startsWith('/') ? to : `/${to}`
  
  // Construit le nouveau chemin : /es + /contact = /es/contact
  const localizedPath = `/${currentLang}${cleanTo}`

  return (
    <Link to={localizedPath} {...props}>
      {children}
    </Link>
  )
}