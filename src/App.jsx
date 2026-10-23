import { Routes, Route, Navigate } from 'react-router-dom'

// Pages de l'application
import Accueil from './pages/Accueil'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import Upgrade from './pages/Upgrade'
import Settings from './pages/Settings'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import CommunityGuidelines from './pages/CommunityGuidelines'
import AmbassadorAgreement from './pages/AmbassadorAgreement'
import CookiePolicy from './pages/CookiePolicy'
import CookiePreferences from './pages/CookiePreferences'
import Contact from './pages/Contact'

function App() {
  return (
    <Routes>
      {/* Page d'accueil par défaut */}
      <Route path="/" element={<Accueil />} />
      
      {/* Authentification */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Espace membre */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/upgrade" element={<Upgrade />} />
      <Route path="/settings" element={<Settings />} />
      
      {/* Pages légales */}
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/community-guidelines" element={<CommunityGuidelines />} />
      <Route path="/ambassador" element={<AmbassadorAgreement />} />
      <Route path="/cookies" element={<CookiePolicy />} />
      <Route path="/cookie-preferences" element={<CookiePreferences />} />
      
      {/* Contact */}
      <Route path="/contact" element={<Contact />} />

      {/* Redirection de sécurité si l'URL n'existe pas (404) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App