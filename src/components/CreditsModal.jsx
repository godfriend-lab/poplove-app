import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const KKIAPAY_PUBLIC_KEY = '15d623a74383830a3ac7dbc0b04a869059e29e14'

export default function CreditsModal({ onClose, currentCredits, userId, onPurchaseSuccess }) {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userData, setUserData] = useState({ email: '', phone: '221770000000' })

  // 1. Récupérer les vraies données de l'utilisateur connecté
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('phone, email')
          .eq('id', session.user.id)
          .single()
        
        setUserData({
          email: session.user.email || 'user@poplove.com',
          phone: profile?.phone || '221770000000' // Fallback si pas de téléphone
        })
      }
    }
    fetchUserData()
  }, [])

  // 2. Écouteurs d'événements globaux du SDK KKiaPay
  useEffect(() => {
    const handleSuccess = async (response) => {
      console.log('✅ Widget KKiaPay: Succès', response)
      setLoading(true)
      
      try {
        // APPEL SÉCURISÉ AU BACKEND (Le frontend ne crédite JAMAIS directement)
        const { data, error: fnError } = await supabase.functions.invoke('verify-kkiapay-payment', {
          body: {
            transactionId: response.transactionId || response.id,
            userId: userId,
            plan: selectedPlan,
            currentCredits: currentCredits
          }
        })

        if (fnError) throw fnError
        
        if (data.success) {
          alert(`✅ Paiement vérifié et crédité avec succès !\n\nNouveau solde : ${data.newCredits} crédits`)
          onPurchaseSuccess()
          onClose()
        } else {
          throw new Error(data.message || 'La vérification du paiement a échoué.')
        }
      } catch (err) {
        console.error('Erreur vérification backend:', err)
        setError('Paiement effectué mais erreur de vérification. Contactez le support avec l\'ID: ' + (response.transactionId || response.id))
      } finally {
        setLoading(false)
      }
    }

    const handleFailed = () => {
      console.error('❌ Widget KKiaPay: Échec')
      setError('Le paiement a échoué. Veuillez réessayer avec un autre moyen de paiement.')
      setLoading(false)
    }

    // Attacher les écouteurs si le SDK est chargé
    if (typeof window.addSuccessListener === 'function') {
      window.addSuccessListener(handleSuccess)
      window.addFailedListener(handleFailed)
    }

    // Nettoyage des écouteurs lors de la fermeture de la modale
    return () => {
      if (typeof window.removeSuccessListener === 'function') {
        window.removeSuccessListener(handleSuccess)
        window.removeFailedListener(handleFailed)
      }
    }
  }, [selectedPlan, userId, currentCredits, onPurchaseSuccess, onClose])

  // 3. Déclencher le paiement
  const handlePayment = () => {
    if (!selectedPlan) {
      setError('Veuillez sélectionner un forfait')
      return
    }
    if (!userId) {
      setError('Utilisateur non connecté.')
      return
    }

    // Vérifier que le SDK est bien chargé depuis index.html
    if (typeof window.openKkiapayWidget !== 'function') {
      setError('Le module de paiement est en cours de chargement. Veuillez réessayer dans un instant.')
      return
    }

    setLoading(true)
    setError('')

    // Ouvrir le widget officiel KKiaPay
    window.openKkiapayWidget({
      amount: selectedPlan.price,
      key: KKIAPAY_PUBLIC_KEY,
      sandbox: true, // ⚠️ Mettre à false quand tu passeras en production
      position: 'center',
      name: 'POPLOVE',
      email: userData.email,
      phone: userData.phone,
      reason: `Achat forfait ${selectedPlan.name} - ${selectedPlan.credits} crédits`
    })
  }

  // ... (Le design reste exactement le même que précédemment)
  const plans = [
    { id: 'starter', name: 'STARTER', price: 5000, credits: 50, duration: '30 jours', color: '#25D366', description: 'Idéal pour débuter' },
    { id: 'business', name: 'BUSINESS', price: 15000, credits: 500, duration: '30 jours', color: '#ff6b9d', popular: true, description: 'Le plus populaire' },
    { id: 'premium', name: 'PREMIUM', price: 30000, credits: 9999, duration: '30 jours', color: '#ffd700', description: 'Crédits illimités' }
  ]

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', overflow: 'auto' }} onClick={onClose}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: '24px', padding: '40px', maxWidth: '900px', width: '100%', maxHeight: '90vh', overflow: 'auto', border: '1px solid rgba(255,255,255,0.1)', color: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', margin: 0, background: 'linear-gradient(135deg, #ffd700, #ffaa00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '10px' }}>💎 Recharger mes crédits</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: '10px 0 0 0', fontSize: '1rem' }}>Solde actuel : <strong style={{ color: '#ffd700', fontSize: '1.2rem' }}>{currentCredits} crédits</strong></p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }} onMouseOver={(e) => { e.target.style.background = 'rgba(230, 57, 70, 0.8)'; e.target.style.transform = 'rotate(90deg)' }} onMouseOut={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.transform = 'rotate(0deg)' }}>×</button>
        </div>

        {error && (<div style={{ background: 'rgba(230, 57, 70, 0.2)', border: '2px solid #e63946', borderRadius: '12px', padding: '15px', marginBottom: '25px', color: '#ff6b9d', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500 }}><span style={{ fontSize: '1.2rem' }}>⚠️</span>{error}</div>)}

        <div style={{ marginBottom: '35px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ background: 'linear-gradient(135deg, #ff6b9d, #e63946)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>1</span>Choisissez votre forfait</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {plans.map(plan => (
              <div key={plan.id} onClick={() => { setSelectedPlan(plan); setError('') }} style={{ background: selectedPlan?.id === plan.id ? `linear-gradient(135deg, ${plan.color}22, ${plan.color}11)` : 'rgba(255,255,255,0.05)', border: selectedPlan?.id === plan.id ? `3px solid ${plan.color}` : '2px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '25px', cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease', transform: selectedPlan?.id === plan.id ? 'scale(1.02)' : 'scale(1)', boxShadow: selectedPlan?.id === plan.id ? `0 10px 30px ${plan.color}33` : 'none' }} onMouseOver={(e) => { if (selectedPlan?.id !== plan.id) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' } }} onMouseOut={(e) => { if (selectedPlan?.id !== plan.id) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' } }}>
                {plan.popular && (<div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'linear-gradient(135deg, #ff6b9d, #e63946)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, color: 'white', boxShadow: '0 4px 10px rgba(230, 57, 70, 0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>⭐ POPULAIRE</div>)}
                <div style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px', color: plan.color, letterSpacing: '1px' }}>{plan.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '15px', fontStyle: 'italic' }}>{plan.description}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '5px' }}>{plan.price.toLocaleString('fr-FR')} <span style={{ fontSize: '1rem', fontWeight: 600 }}>FCFA</span></div>
                <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', marginBottom: '10px' }}><strong style={{ color: plan.color, fontSize: '1.1rem' }}>{plan.credits} crédits</strong></div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{plan.duration}</div>
              </div>
            ))}
          </div>
        </div>

        {selectedPlan && (
          <div style={{ marginBottom: '30px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)' }}>📋 Récapitulatif</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: 'rgba(255,255,255,0.6)' }}>Forfait</span><span style={{ fontWeight: 600, color: selectedPlan.color }}>{selectedPlan.name}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: 'rgba(255,255,255,0.6)' }}>Crédits</span><span style={{ fontWeight: 600 }}>+{selectedPlan.credits} crédits</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: 'rgba(255,255,255,0.6)' }}>Durée</span><span style={{ fontWeight: 600 }}>{selectedPlan.duration}</span></div>
            <div style={{ borderTop: '2px solid rgba(255,255,255,0.2)', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}><span style={{ fontWeight: 700 }}>Total à payer</span><span style={{ fontWeight: 900, color: '#25D366' }}>{selectedPlan.price.toLocaleString('fr-FR')} FCFA</span></div>
          </div>
        )}

        <button onClick={handlePayment} disabled={!selectedPlan || loading} style={{ width: '100%', padding: '18px', background: selectedPlan && !loading ? 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' : 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '16px', cursor: selectedPlan && !loading ? 'pointer' : 'not-allowed', fontWeight: 800, fontSize: '1.2rem', opacity: selectedPlan && !loading ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: selectedPlan && !loading ? '0 10px 30px rgba(37, 211, 102, 0.4)' : 'none', transition: 'all 0.3s ease' }} onMouseOver={(e) => { if (selectedPlan && !loading) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 15px 40px rgba(37, 211, 102, 0.5)' } }} onMouseOut={(e) => { if (selectedPlan && !loading) { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 30px rgba(37, 211, 102, 0.4)' } }}>
          {loading ? (<><div style={{ width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /><span>Vérification sécurisée...</span></>) : (<><span style={{ fontSize: '1.5rem' }}>📱</span><span>Payer {selectedPlan ? selectedPlan.price.toLocaleString('fr-FR') + ' FCFA' : ''}</span><span style={{ fontSize: '1.2rem' }}>→</span></>)}
        </button>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><span>🔒</span><span>Paiement 100% sécurisé et vérifié par KKiaPay</span></div>
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )
}