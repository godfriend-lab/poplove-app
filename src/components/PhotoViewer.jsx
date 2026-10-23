import { useState } from 'react'

export default function PhotoViewer({ photos, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '30px',
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          fontSize: '2rem',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s'
        }}
        onMouseOver={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.3)'
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.2)'
        }}
      >
        ×
      </button>

      {/* Bouton précédent */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            goToPrevious()
          }}
          style={{
            position: 'absolute',
            left: '30px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            fontSize: '2rem',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.3)'
            e.target.style.transform = 'scale(1.1)'
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)'
            e.target.style.transform = 'scale(1)'
          }}
        >
          ‹
        </button>
      )}

      {/* Photo principale */}
      <img
        src={photos[currentIndex]}
        alt={`Photo ${currentIndex + 1}`}
        style={{
          maxWidth: '90%',
          maxHeight: '85vh',
          objectFit: 'contain',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Bouton suivant */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            goToNext()
          }}
          style={{
            position: 'absolute',
            right: '30px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            fontSize: '2rem',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.3)'
            e.target.style.transform = 'scale(1.1)'
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)'
            e.target.style.transform = 'scale(1)'
          }}
        >
          ›
        </button>
      )}

      {/* Indicateur de position */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.2)',
          padding: '10px 20px',
          borderRadius: '50px',
          color: 'white',
          fontSize: '0.9rem',
          fontWeight: 600
        }}
      >
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  )
}