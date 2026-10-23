import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

/* ==========================================================================
   POPLOVE — Page Premium (Copywriting Persuasif & High-End)
   ========================================================================== */

const PLANS = [
  { id: 'weekly', name: 'Découverte', value: 1, unit: 'semaine', weeks: 1, usd: 3, local: 1500 },
  { id: 'monthly', name: 'Passion', value: 1, unit: 'mois', weeks: 4, usd: 9, local: 4500 },
  { id: 'quarterly', name: 'Premium', value: 3, unit: 'mois', weeks: 13, usd: 12, local: 6000, popular: true },
  { id: 'biannual', name: 'Illimité', value: 6, unit: 'mois', weeks: 26, usd: 20, local: 10000 }
]

const SLIDES = [
  {
    title: 'Accédez aux meilleurs profils du monde.',
    text: 'Europe, Amérique, Afrique, Asie : notre algorithme vous connecte aux personnes les plus compatibles, où qu\'elles soient.',
    hue: 340,
    icon: '🌍'
  },
  {
    title: 'Propulsé en tête des suggestions.',
    text: 'Notre algorithme IA priorise votre profil. Soyez vu par les personnes qui comptent vraiment avant tout le monde.',
    hue: 280,
    icon: '🚀'
  },
  {
    title: 'Le secret est levé.',
    text: 'Voyez exactement qui a liké ou visité votre profil. Ne laissez plus aucune opportunité de rencontre vous échapper.',
    hue: 20,
    icon: '👁️'
  },
  {
    title: 'Marquez les esprits immédiatement.',
    text: 'Utilisez des Super Likes pour montrer un intérêt réel. Les profils avec Super Like ont 3x plus de chances de match.',
    hue: 320,
    icon: '💎'
  },
  {
    title: 'Contrôle total et discrétion.',
    text: 'Parcourez les profils en mode invisible. Vous décidez qui voit votre activité, quand vous le souhaitez.',
    hue: 250,
    icon: '🛡️'
  }
]

/*
  LOGOS DES MOYENS DE PAIEMENT
  - Fichiers locaux à placer dans /public/payments/ :
      yas.png     → logo Yas (ex T-Money)  (carré bleu, logo jaune)
      moov.png    → logo Moov Africa       (carte bleue arrondie)
      paypal.png  → logo PayPal (optionnel, sinon le CDN est utilisé)
  - Les autres logos officiels viennent de Simple Icons (CDN).
  - `full: true`  → l'image remplit toute la carte (logos avec fond de couleur)
  - `fallback`    → image de secours si la première ne charge pas
*/
const PAYMENTS = [
  { id: 'visa', name: 'Visa', src: 'https://cdn.simpleicons.org/visa/1A1F71' },
  { id: 'mastercard', name: 'Mastercard', inline: 'mastercard' },
  { id: 'paypal', name: 'PayPal', src: '/payments/paypal.png', fallback: 'https://cdn.simpleicons.org/paypal/003087' },
  { id: 'yas', name: 'Yas (T-Money)', src: '/payments/yas.png', full: true, bg: '#0A2E8C', color: '#FFD200' },
  { id: 'moov', name: 'Moov Africa', src: '/payments/moov.png', full: true, bg: '#0063B4', color: '#F26B00' },
  { id: 'stripe', name: 'Stripe', src: 'https://cdn.simpleicons.org/stripe/635BFF' },
  { id: 'bitcoin', name: 'Bitcoin', src: 'https://cdn.simpleicons.org/bitcoin/F7931A', crypto: true },
  { id: 'ethereum', name: 'Ethereum', src: 'https://cdn.simpleicons.org/ethereum/3C3C3D', crypto: true },
  { id: 'usdt', name: 'USDT', src: 'https://cdn.simpleicons.org/tether/26A17B', crypto: true }
]

const formatPrice = (plan, currency) =>
  currency === 'USD' ? `$${plan.usd}` : `${plan.local.toLocaleString('fr-FR')} FCFA`

const savingFor = (plan, currency) => {
  const base = currency === 'USD' ? PLANS[0].usd : PLANS[0].local
  const price = currency === 'USD' ? plan.usd : plan.local
  const pct = Math.round((1 - price / (base * plan.weeks)) * 100)
  return pct > 0 ? pct : 0
}

/* ------------------------------- Icônes ---------------------------------- */
const Svg = ({ size = 20, children, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...r}>{children}</svg>
)
const IconClose = () => (<Svg size={22}><path d="M18 6 6 18M6 6l12 12" /></Svg>)
const IconLock = () => (<Svg size={16}><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></Svg>)
const IconArrow = () => (<Svg size={18}><path d="M5 12h14m-6-6 6 6-6 6" /></Svg>)
const IconCheck = () => (<Svg size={18}><path d="M20 6 9 17l-5-5" strokeWidth="2.5" /></Svg>)

const MastercardLogo = () => (
  <svg viewBox="0 0 48 30" width="44" height="28" role="img" aria-label="Mastercard">
    <circle cx="17" cy="15" r="13" fill="#EB001B" />
    <circle cx="31" cy="15" r="13" fill="#F79E1B" />
    <path d="M24 4.2a13 13 0 0 1 0 21.6 13 13 0 0 1 0-21.6z" fill="#FF5F00" />
  </svg>
)

function PayLogo({ item }) {
  const [src, setSrc] = useState(item.src)
  const [failed, setFailed] = useState(false)

  if (item.inline === 'mastercard') return <MastercardLogo />

  if (failed || !src) {
    return <span className="up-pay-text" style={{ color: item.color || '#261935' }}>{item.name}</span>
  }

  return (
    <img
      src={src}
      alt={item.name}
      height="26"
      loading="lazy"
      onError={() => {
        if (item.fallback && src !== item.fallback) setSrc(item.fallback)
        else setFailed(true)
      }}
    />
  )
}

/* ============================== COMPOSANT ================================== */
export default function Upgrade() {
  const navigate = useNavigate()
  const [currency, setCurrency] = useState('FCFA')
  const [selected, setSelected] = useState('quarterly')
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)
  const plansRef = useRef(null)

  const plan = useMemo(() => PLANS.find((p) => p.id === selected), [selected])

  /* Défilement automatique du carrousel */
  useEffect(() => {
    if (paused) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [paused])

  /* Centre le forfait choisi dans la liste (mobile) */
  useEffect(() => {
    const el = plansRef.current?.querySelector(`[data-plan="${selected}"]`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [selected])

  const go = (dir) => setSlide((s) => (s + dir + SLIDES.length) % SLIDES.length)
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; setPaused(true) }
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    touchX.current = null
    setPaused(false)
  }

  const handleContinue = () => {
    navigate(`/checkout?plan=${plan.id}&currency=${currency}`)
  }

  const onPlanKey = (e, index) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = PLANS[(index + (e.key === 'ArrowRight' ? 1 : -1) + PLANS.length) % PLANS.length]
    setSelected(next.id)
    plansRef.current?.querySelector(`[data-plan="${next.id}"]`)?.focus()
  }

  return (
    <div className="up-root">
      <style>{CSS}</style>
      <div className="up-glow up-glow--a" />
      <div className="up-glow up-glow--b" />

      {/* ---------- En-tête ---------- */}
      <header className="up-top">
        <button type="button" className="up-close" onClick={() => navigate('/dashboard')} aria-label="Retour">
          <IconClose />
        </button>
        <span className="up-top-title">POPLOVE <span className="text-gold">Premium</span></span>
        <div className="up-currency" role="group" aria-label="Devise">
          {['FCFA', 'USD'].map((c) => (
            <button key={c} type="button" aria-pressed={currency === c} className={currency === c ? 'is-on' : ''} onClick={() => setCurrency(c)}>{c === 'FCFA' ? '🇹🇬 FCFA' : '💵 USD'}</button>
          ))}
        </div>
      </header>

      <main className="up-main">
        {/* ---------- Carrousel de Promesses ---------- */}
        <section
          className="up-hero"
          aria-roledescription="carrousel"
          aria-label="Avantages Premium"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="up-slides" style={{ transform: `translateX(-${slide * 100}%)` }}>
            {SLIDES.map((s, i) => (
              <div className="up-slide" key={s.title} aria-hidden={i !== slide} style={{ '--h': s.hue }}>
                <div className="up-icon-hero">{s.icon}</div>
                <h1 className="up-slide-title">{s.title}</h1>
                <p className="up-slide-text">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="up-dots" role="tablist" aria-label="Choisir un avantage">
            {SLIDES.map((s, i) => (
              <button key={s.title} type="button" role="tab" aria-selected={i === slide} aria-label={`Avantage ${i + 1}`} className={i === slide ? 'is-on' : ''} onClick={() => setSlide(i)} />
            ))}
          </div>
        </section>

        {/* ---------- Section Confiance ---------- */}
        <section className="up-trust">
          <div className="up-trust-item">
            <IconCheck />
            <span>Algorithme de matching IA</span>
          </div>
          <div className="up-trust-item">
            <IconCheck />
            <span>Profils 100% vérifiés</span>
          </div>
          <div className="up-trust-item">
            <IconCheck />
            <span>Annulation à tout moment</span>
          </div>
        </section>

        {/* ---------- Forfaits ---------- */}
        <section className="up-plans-wrap" aria-label="Choisir un forfait">
          <h2 className="up-plans-title">Choisissez votre niveau d'accès</h2>
          <div className="up-plans" ref={plansRef} role="radiogroup">
            {PLANS.map((p, i) => {
              const on = p.id === selected
              const save = savingFor(p, currency)
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  data-plan={p.id}
                  className={`up-plan ${on ? 'is-on' : ''}`}
                  onClick={() => setSelected(p.id)}
                  onKeyDown={(e) => onPlanKey(e, i)}
                >
                  {p.popular && <span className="up-badge">Le plus choisi</span>}
                  <span className="up-plan-name">{p.name}</span>
                  <span className="up-plan-duration">{p.value} {p.unit}{p.value > 1 && p.unit !== 'mois' ? 's' : ''}</span>
                  <span className="up-plan-price">{formatPrice(p, currency)}</span>
                  {save > 0 ? <span className="up-save">Économisez {save}%</span> : <span className="up-save up-save--ghost" aria-hidden="true">.</span>}
                </button>
              )
            })}
          </div>
        </section>

        <p className="up-legal">
          En appuyant sur « Continuer », vous débloquez l'accès Premium pour {plan.value} {plan.unit}{plan.value > 1 && plan.unit !== 'mois' ? 's' : ''}.
          Paiement sécurisé. <Link to="/terms">Conditions</Link> & <Link to="/privacy">Confidentialité</Link>.
        </p>

        <button type="button" className="up-cta" onClick={handleContinue}>
          Débloquer l'accès Premium <IconArrow />
        </button>

        {/* ---------- Paiement ---------- */}
        <section className="up-pay" aria-label="Moyens de paiement">
          <h2>Paiement flexible et sécurisé</h2>
          <p className="up-pay-sub">Carte bancaire, Mobile Money ou cryptomonnaie : choisissez ce qui vous convient.</p>
          <ul className="up-pay-list">
            {PAYMENTS.map((p) => (
              <li
                key={p.id}
                className={`up-pay-card ${p.full ? 'up-pay-card--full' : ''}`}
                style={p.full ? { background: p.bg } : undefined}
                title={p.name}
              >
                <PayLogo item={p} />
                {p.crypto && <span className="up-pay-tag">Crypto</span>}
              </li>
            ))}
          </ul>
          <p className="up-secure"><IconLock /> Transactions chiffrées de bout en bout (SSL 256-bit)</p>
        </section>
      </main>
    </div>
  )
}

/* ================================== STYLES ================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,800&family=Manrope:wght@400;500;600;700;800&display=swap');

.up-root {
  --bg: #0b0710; --surface: #1b1126; --surface-2: #261935;
  --line: rgba(246, 234, 240, .1); --line-strong: rgba(246, 234, 240, .2);
  --text: #f7eef2; --muted: #ab9aa7;
  --rose: #ff5c8a; --rose-deep: #d6335f; --rose-soft: #ff9cb8; --gold: #ffd25e;
  --serif: 'Fraunces', Georgia, serif; --sans: 'Manrope', system-ui, sans-serif;
  position: relative; min-height: 100vh; overflow-x: hidden;
  background: var(--bg); color: var(--text); font-family: var(--sans); -webkit-font-smoothing: antialiased;
}
.up-root *, .up-root *::before, .up-root *::after { box-sizing: border-box; }
.up-root button { font-family: inherit; }
.up-root a { color: inherit; }
.up-root :focus-visible { outline: 2px solid var(--rose-soft); outline-offset: 3px; }

.up-glow { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; }
.up-glow--a { width: 600px; height: 600px; top: -200px; left: 50%; margin-left: -500px; background: #ff4d83; opacity: .25; animation: up-drift 18s ease-in-out infinite alternate; }
.up-glow--b { width: 500px; height: 500px; top: 100px; left: 50%; margin-left: 100px; background: #7b2ff7; opacity: .2; animation: up-drift 22s ease-in-out infinite alternate-reverse; }
@keyframes up-drift { from { transform: translate(0, 0); } to { transform: translate(50px, 40px); } }

.text-gold { color: var(--gold); }

/* En-tête */
.up-top { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; max-width: 1040px; margin: 0 auto; padding: 20px 20px; }
.up-close { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 50%; border: 1px solid var(--line); background: rgba(255,255,255,.04); color: var(--text); cursor: pointer; transition: background .2s, transform .2s; justify-self: start; }
.up-close:hover { background: rgba(255,255,255,.1); transform: rotate(90deg); }
.up-top-title { font-family: var(--serif); font-weight: 700; font-size: 1.2rem; letter-spacing: .06em; }
.up-currency { justify-self: end; display: inline-flex; padding: 4px; border-radius: 999px; background: rgba(255,255,255,.05); border: 1px solid var(--line); }
.up-currency button { border: 0; background: none; color: var(--muted); font-weight: 700; font-size: .8rem; padding: 8px 14px; border-radius: 999px; cursor: pointer; transition: all .25s; }
.up-currency button.is-on { background: linear-gradient(135deg, var(--rose), var(--rose-deep)); color: #fff; box-shadow: 0 6px 16px -6px rgba(255, 92, 138, .8); }

.up-main { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; padding: 20px 20px 80px; display: flex; flex-direction: column; align-items: center; }

/* Carrousel */
.up-hero { width: 100%; overflow: hidden; padding-top: 20px; touch-action: pan-y; }
.up-slides { display: flex; transition: transform .7s cubic-bezier(.65, 0, .25, 1); }
.up-slide { flex: 0 0 100%; text-align: center; padding: 8px 12px 0; }
.up-icon-hero { font-size: 3.5rem; margin-bottom: 20px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)); animation: float 3s ease-in-out infinite; }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.up-slide-title { font-family: var(--serif); font-weight: 800; font-size: clamp(2rem, 6vw, 3.2rem); line-height: 1.1; letter-spacing: -.02em; margin: 0 0 16px; text-wrap: balance; background: linear-gradient(135deg, #fff, var(--rose-soft)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.up-slide-text { color: var(--muted); font-size: 1.1rem; line-height: 1.6; margin: 0 auto; max-width: 44ch; }
.up-dots { display: flex; justify-content: center; gap: 8px; margin: 32px 0 40px; flex-wrap: wrap; }
.up-dots button { width: 8px; height: 8px; padding: 0; border-radius: 99px; border: 0; background: rgba(255,255,255,.22); cursor: pointer; transition: all .3s; position: relative; }
.up-dots button::after { content: ''; position: absolute; inset: -10px -4px; }
.up-dots button.is-on { width: 32px; background: linear-gradient(90deg, var(--rose), var(--gold)); }

/* Section Confiance */
.up-trust { display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; margin-bottom: 40px; padding: 16px; background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid var(--line); }
.up-trust-item { display: flex; align-items: center; gap: 8px; color: var(--text); font-size: 0.9rem; font-weight: 600; }
.up-trust-item svg { color: var(--gold); }

/* Forfaits */
.up-plans-wrap { width: 100%; margin: 0 -20px; }
.up-plans-title { font-family: var(--serif); font-size: 1.8rem; font-weight: 700; text-align: center; margin-bottom: 24px; }
.up-plans { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 22px 0 6px; }
.up-plan { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; min-height: 210px; padding: 28px 12px 20px; border-radius: 24px; cursor: pointer; text-align: center;
  background: rgba(255,255,255,.04); border: 1.5px solid var(--line); color: var(--text); backdrop-filter: blur(8px); transition: transform .3s cubic-bezier(.2,.7,.2,1), background .25s, border-color .25s, box-shadow .3s; }
.up-plan:hover { border-color: var(--line-strong); transform: translateY(-4px); }
.up-plan.is-on { background: #fff; color: #1a1020; border-color: #fff; transform: translateY(-12px) scale(1.05); box-shadow: 0 30px 60px -20px rgba(255, 92, 138, .7), 0 0 0 4px rgba(255, 92, 138, .3); z-index: 2; }
.up-plan-name { font-family: var(--serif); font-weight: 700; font-size: 1.3rem; margin-bottom: 4px; }
.up-plan-duration { font-size: .9rem; font-weight: 600; opacity: .7; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
.up-plan-price { font-size: 1.8rem; font-weight: 800; margin-bottom: 12px; line-height: 1; }
.up-save { font-size: .75rem; font-weight: 800; padding: 6px 12px; border-radius: 8px; background: rgba(255, 210, 94, .16); color: var(--gold); white-space: nowrap; }
.up-plan.is-on .up-save { background: var(--gold); color: #3a2600; }
.up-save--ghost { visibility: hidden; }
.up-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, var(--rose), var(--rose-deep)); color: #fff; font-size: .7rem; font-weight: 800; padding: 6px 14px; border-radius: 99px; white-space: nowrap; box-shadow: 0 8px 20px -6px rgba(255, 92, 138, .9); }

.up-legal { color: var(--muted); font-size: .85rem; line-height: 1.6; text-align: center; max-width: 56ch; margin: 36px 0 24px; }
.up-legal a { color: var(--text); font-weight: 700; text-decoration: underline; text-decoration-color: var(--rose); text-underline-offset: 3px; }

.up-cta { width: 100%; max-width: 560px; min-height: 64px; display: inline-flex; align-items: center; justify-content: center; gap: 12px; border: 0; border-radius: 18px; cursor: pointer; font-size: 1.1rem; font-weight: 800; color: #fff;
  background: linear-gradient(135deg, var(--rose), var(--rose-deep)); box-shadow: 0 20px 40px -14px rgba(255, 92, 138, .9); position: relative; overflow: hidden; transition: transform .2s, box-shadow .2s, filter .2s; }
.up-cta::after { content: ''; position: absolute; inset: 0; background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.4) 50%, transparent 70%); transform: translateX(-120%); animation: up-shine 4s ease-in-out infinite; }
@keyframes up-shine { 0%, 60% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
.up-cta:hover { transform: translateY(-3px); filter: brightness(1.08); box-shadow: 0 24px 50px -14px rgba(255, 92, 138, 1); }
.up-cta:active { transform: translateY(1px); }

/* Paiement */
.up-pay { width: 100%; margin-top: 70px; padding-top: 40px; border-top: 1px solid var(--line); text-align: center; }
.up-pay h2 { font-family: var(--serif); font-size: 1.5rem; font-weight: 700; margin: 0 0 8px; }
.up-pay-sub { margin: 0 0 28px; color: var(--muted); font-size: .92rem; }
.up-pay-list { list-style: none; margin: 0 0 28px; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.up-pay-card { position: relative; height: 68px; display: grid; place-items: center; padding: 0 16px; border-radius: 16px; background: #fff; overflow: hidden; box-shadow: 0 10px 24px -14px rgba(0,0,0,.7); transition: transform .25s, box-shadow .25s; }
.up-pay-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px -14px rgba(255, 92, 138, .6); }
.up-pay-card img { display: block; max-width: 100%; height: 28px; width: auto; object-fit: contain; }
.up-pay-card--full { padding: 0; }
.up-pay-card--full img { width: 100%; height: 100%; max-width: none; object-fit: contain; }
.up-pay-text { font-weight: 800; font-size: 1rem; letter-spacing: -.01em; }
.up-pay-tag { position: absolute; top: 6px; right: 8px; font-size: .6rem; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; padding: 2px 7px; border-radius: 99px; background: rgba(255, 210, 94, .25); color: #7a5600; }
.up-secure { display: inline-flex; align-items: center; gap: 8px; margin: 0; color: var(--muted); font-size: .88rem; font-weight: 600; }
.up-secure svg { color: #4fd1a1; }

/* Responsive */
@media (max-width: 768px) {
  .up-top-title { display: none; }
  .up-top { grid-template-columns: 1fr 1fr; }
  .up-plans-wrap { margin: 0 -20px; width: calc(100% + 40px); }
  .up-plans { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 16px; padding: 24px 20px 14px; scrollbar-width: none; }
  .up-plans::-webkit-scrollbar { display: none; }
  .up-plan { flex: 0 0 150px; scroll-snap-align: center; min-height: 190px; }
  .up-trust { gap: 16px; }
  .up-trust-item { font-size: 0.85rem; }
  .up-pay-list { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .up-cta { font-size: 1rem; min-height: 56px; }
}
@media (prefers-reduced-motion: reduce) {
  .up-root *, .up-root *::before, .up-root *::after { animation: none !important; transition: none !important; }
}
`