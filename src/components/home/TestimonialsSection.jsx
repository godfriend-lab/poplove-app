import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* ==========================================================================
   POPLOVE — Témoignages (même univers que le Hero, finition haut de gamme)
   ========================================================================== */

/*
  IMPORTANT : ces témoignages et ces photos sont des PLACEHOLDERS.
  Avant la mise en ligne, remplace-les par de vrais témoignages de vrais couples
  (avec leur accord) et leurs vraies photos : '/images/couple1.jpg', etc.
*/
const TESTIMONIALS = [
  {
    // Remplace par ta photo : '/images/couple1.jpg'
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=600&fit=crop',
    quote: 'POPLOVE est vraiment un rêve devenu réalité pour moi et la personne que je cherchais depuis toute ma vie !',
    name: 'Josh & Aminata',
    route: null
  },
  {
    // Remplace par ta photo : '/images/couple2.jpg'
    image: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&h=600&fit=crop',
    quote: 'Grâce à POPLOVE, j\'ai trouvé mon âme sœur, mon partenaire pour la vie.',
    name: 'Mona & Kofi',
    route: null
  },
  {
    // Remplace par ta photo : '/images/couple3.jpg'
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=600&fit=crop',
    quote: 'Tout a commencé par un match sur POPLOVE, et depuis nos conversations n\'ont jamais cessé de couler.',
    name: 'Damian & Aïcha',
    route: null
  },
  {
    // Remplace par ta photo : '/images/couple4.jpg'
    image: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&h=600&fit=crop',
    quote: 'Il est du Sénégal et je suis de Côte d\'Ivoire. Nous nous sommes rencontrés sur POPLOVE. Il a traversé le monde pour moi.',
    name: 'Shakila & Moussa',
    route: ['Sénégal', 'Côte d\'Ivoire']
  }
]

/* ------------------------------- Icônes ---------------------------------- */
const IconQuote = () => (
  <svg width="30" height="24" viewBox="0 0 30 24" fill="currentColor" aria-hidden="true">
    <path d="M0 24V13.800C0 6.200 4.200 1.200 11.400 0l1.100 3.600C8.700 4.700 6.600 7.200 6.300 10.600H12V24H0zm17.500 0V13.800C17.500 6.200 21.700 1.200 28.900 0L30 3.600c-3.800 1.100-5.900 3.600-6.200 7H29.500V24H17.500z" />
  </svg>
)
const IconArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
)
const IconSwap = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8h15m-4-4 4 4-4 4M20 16H5m4-4-4 4 4 4" /></svg>
)

/* ------------------------- Photo du couple (avec secours) ---------------- */
function CouplePhoto({ src, alt }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="ts-photo">
      <span className="ts-photo-ring" aria-hidden="true" />
      {!failed ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span className="ts-photo-fallback">{alt.split(' & ').map((n) => n[0]).join(' & ')}</span>
      )}
    </div>
  )
}

/* ============================== COMPOSANT ================================== */
export default function TestimonialsSection() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect() }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="ts-root" ref={ref}>
      <style>{CSS}</style>
      <div className="ts-glow ts-glow--a" />
      <div className="ts-glow ts-glow--b" />

      <div className="ts-inner">
        <header className="ts-head">
          <p className="ts-eyebrow">
            <span className="ts-eyebrow-line" />
            Témoignages
          </p>
          <h2 className="ts-heading">
            De POPLOVE
            <br />
            <em>à l'amour.</em>
          </h2>
        </header>

        <div className="ts-grid">
          {TESTIMONIALS.map((t, i) => (
            <figure className={`ts-card ${seen ? 'is-in' : ''}`} key={t.name} style={{ '--d': `${i * 120}ms` }}>
              <CouplePhoto src={t.image} alt={t.name} />
              <span className="ts-quote-icon"><IconQuote /></span>
              <blockquote className="ts-quote">{t.quote}</blockquote>
              <figcaption className="ts-name">{t.name}</figcaption>
              {t.route && (
                <p className="ts-route">
                  {t.route[0]} <IconSwap /> {t.route[1]}
                </p>
              )}
            </figure>
          ))}
        </div>

        <div className="ts-cta-wrap">
          <Link to="/register" className="ts-cta">
            Essayer maintenant
            <IconArrow />
          </Link>
          <p className="ts-cta-note">Inscription gratuite, sans engagement.</p>
        </div>
      </div>
    </section>
  )
}

/* ================================== STYLES ================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400;1,500;1,700&family=Manrope:wght@400;500;600;700;800&display=swap');

.ts-root {
  --rose: #ff6b9d; --rose-deep: #e63946; --gold: #f4d58d;
  --serif: 'Playfair Display', Georgia, serif; --sans: 'Manrope', system-ui, sans-serif;
  position: relative; overflow: hidden; padding: 120px 24px 130px;
  background: linear-gradient(180deg, #0b0710 0%, #160a1d 50%, #0b0710 100%);
  color: #fff; font-family: var(--sans); -webkit-font-smoothing: antialiased; text-align: center;
}
.ts-root *, .ts-root *::before, .ts-root *::after { box-sizing: border-box; }
.ts-root :focus-visible { outline: 2px solid var(--rose); outline-offset: 3px; }

.ts-glow { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; }
.ts-glow--a { width: 560px; height: 560px; top: -100px; left: 50%; margin-left: -280px; background: #ff4d83; opacity: .13; }
.ts-glow--b { width: 480px; height: 480px; bottom: -160px; right: -140px; background: #7b2ff7; opacity: .15; }

.ts-inner { position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; }

/* Titre */
.ts-head { margin-bottom: 76px; }
.ts-eyebrow { display: inline-flex; align-items: center; gap: 14px; margin: 0 0 22px; font-size: .75rem; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: var(--gold); }
.ts-eyebrow-line { width: 40px; height: 1px; background: var(--gold); }
.ts-heading { margin: 0; font-family: var(--serif); font-weight: 700; font-size: clamp(2.2rem, 4.6vw, 3.6rem); line-height: 1.1; letter-spacing: -.02em; }
.ts-heading em { font-style: italic; font-weight: 500; background: linear-gradient(135deg, #ff9cb8, var(--rose) 45%, var(--rose-deep)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; padding-right: .1em; }

/* Cartes */
.ts-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; margin-bottom: 76px; }
.ts-card { position: relative; margin: 0; padding: 44px 26px 34px; display: flex; flex-direction: column; align-items: center; border-radius: 28px; overflow: hidden;
  background: linear-gradient(160deg, rgba(255,255,255,.07), rgba(255,255,255,.02));
  border: 1px solid rgba(255,255,255,.12); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  opacity: 0; transform: translateY(26px);
  transition: opacity .8s ease var(--d), transform .8s cubic-bezier(.2,.7,.2,1) var(--d), border-color .3s, box-shadow .3s; }
.ts-card.is-in { opacity: 1; transform: none; }
.ts-card::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,156,184,.7), transparent); }
.ts-card:hover { border-color: rgba(255,156,184,.4); box-shadow: 0 30px 60px -30px rgba(255,92,138,.5); }

/* Photo */
.ts-photo { position: relative; width: 148px; height: 148px; margin-bottom: 28px; }
.ts-photo img, .ts-photo-fallback { position: absolute; inset: 6px; width: calc(100% - 12px); height: calc(100% - 12px); border-radius: 50%; object-fit: cover; }
.ts-photo-fallback { display: grid; place-items: center; font-family: var(--serif); font-weight: 700; font-size: 1.6rem; color: #fff; background: linear-gradient(135deg, var(--rose), var(--rose-deep)); }
.ts-photo-ring { position: absolute; inset: 0; border-radius: 50%; padding: 1.5px; background: conic-gradient(from 140deg, var(--gold), var(--rose), var(--rose-deep), var(--gold));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }

.ts-quote-icon { display: inline-flex; margin-bottom: 16px; color: var(--gold); opacity: .85; }
.ts-quote { margin: 0 0 22px; font-family: var(--serif); font-style: italic; font-weight: 400; font-size: 1.06rem; line-height: 1.65; color: rgba(255,255,255,.88); flex: 1; }
.ts-name { font-weight: 800; font-size: .8rem; letter-spacing: .2em; text-transform: uppercase; color: #fff; }
.ts-route { display: inline-flex; align-items: center; gap: 8px; margin: 12px 0 0; padding: 6px 14px; border-radius: 999px; font-size: .75rem; font-weight: 600; color: rgba(255,255,255,.8);
  background: rgba(244,213,141,.08); border: 1px solid rgba(244,213,141,.28); }
.ts-route svg { color: var(--gold); }

/* Appel à l'action */
.ts-cta-wrap { text-align: center; }
.ts-cta { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 12px; min-width: 320px; min-height: 62px; padding: 0 36px; border-radius: 18px; color: #fff; font-weight: 800; font-size: 1.05rem; text-decoration: none;
  background: linear-gradient(135deg, var(--rose), var(--rose-deep)); box-shadow: 0 20px 44px -16px rgba(255,92,138,.9); transition: transform .25s, box-shadow .25s, filter .25s; }
.ts-cta::after { content: ''; position: absolute; inset: 0; background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.38) 50%, transparent 70%); transform: translateX(-120%); animation: ts-shine 4.5s ease-in-out infinite; }
@keyframes ts-shine { 0%, 60% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
.ts-cta:hover { transform: translateY(-3px); filter: brightness(1.07); box-shadow: 0 26px 54px -16px rgba(255,92,138,1); }
.ts-cta-note { margin: 18px 0 0; font-size: .85rem; color: rgba(255,255,255,.55); }

/* Responsive */
@media (max-width: 1100px) {
  .ts-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 680px) {
  .ts-root { padding: 84px 20px 96px; }
  .ts-head { margin-bottom: 52px; }
  .ts-grid { grid-template-columns: 1fr; gap: 18px; margin-bottom: 56px; }
  .ts-cta { min-width: 0; width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .ts-root *, .ts-root *::before, .ts-root *::after { animation: none !important; transition: none !important; }
  .ts-card { opacity: 1; transform: none; }
}
`