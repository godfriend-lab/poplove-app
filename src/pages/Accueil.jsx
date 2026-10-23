import { useState, useEffect } from 'react'
import HeroSection from '../components/home/HeroSection'
import StatsSection from '../components/home/StatsSection'
import FeaturesSection from '../components/home/FeaturesSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import HowItWorksSection from '../components/home/HowItWorksSection'
import DownloadSection from '../components/home/DownloadSection'
import FooterSection from '../components/home/FooterSection'
import { useTranslation } from 'react-i18next'

export default function Accueil() {
  const { t } = useTranslation()
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Afficher/masquer le bouton "retour en haut"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Retour en haut de page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: '#fff', overflowX: 'hidden' }}>
      
      {/* ============ SECTIONS PRINCIPALES ============ */}
      <HeroSection />
      
      <StatsSection />
      
      <FeaturesSection />
      
      <TestimonialsSection />
      
      <HowItWorksSection />
      
      <DownloadSection />
      
      <FooterSection />

      {/* ============ BOUTON SCROLL TO TOP ============ */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '55px',
            height: '55px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b9d, #e63946)',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(230, 57, 70, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)'
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(230, 57, 70, 0.7)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(230, 57, 70, 0.5)'
          }}
          aria-label="Retour en haut"
        >
          ↑
        </button>
      )}

      {/* ============ STYLES GLOBAUX ============ */}
      <style>{`
        * {
          scroll-behavior: smooth;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        /* Scrollbar personnalisée POPLOVE */
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #ff6b9d, #e63946);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #e63946, #c44569);
        }
        
        /* Animation d'apparition */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}