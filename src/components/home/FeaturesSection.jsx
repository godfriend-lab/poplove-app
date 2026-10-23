import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* ==========================================================================
   POPLOVE — Section Atouts (même univers que le Hero, finition haut de gamme)
   ========================================================================== */

/* ------------------------------- Icônes ---------------------------------- */
const Svg = ({ size = 28, children, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...r}>{children}</svg>
)
const IconHeartRing = () => (
  <Svg>
    <path d="M12 20.5s-7-4.3-9-8.6C1.600 8.700 3.200 5.300 6.500 5.300c2 0 3.400 1 5.500 3.200 2.100-2.200 3.500-3.200 5.500-3.200 3.300 0 4.900 3.400 3.500 6.600-2 4.300-9 8.600-9 8.600z" />
  </Svg>
)
const IconShield = () => (
  <Svg>
    <path d="M12 3 4.500 6v5.500c0 4.600 3 8 7.500 9.500 4.500-1.500 7.500-4.900 7.500-9.500V6z" />
    <path d="m8.800 12.200 2.400 2.400 4.200-4.600" />
  </Svg>
)
const IconPeople = () => (
  <Svg>
    <circle cx="9" cy="8.500" r="3.200" />
    <path d="M3 20c0-3.300 2.700-5.500 6-5.500s6 2.200 6 5.500" />
    <path d="M16 5.600a3.200 3.200 0 0 1 0 5.800M18 14.800c2 .7 3.300 2.400 3.300 5.200" />
  </Svg>
)
const IconArrow = () => (
  <Svg size={18}><path d="M5 12h14m-6-6 6 6-6 6" strokeWidth="1.8" /></Svg>
)

/* ---------------------------------- Données ------------------------------ */
const FEATURES = [
  {
    Icon: IconHeartRing,
    value: 70,
    kicker: 'Intentions sincères',
    title: 'des membres cherchent une relation sérieuse',
    description:
      'Rejoignez une communauté où la majorité des membres recherchent des connexions sincères et durables, ici comme à l\'autre bout du monde.',
  },
  {
    Icon: IconShield,
    value: 90,
    kicker: 'Confiance',
    title: 'des profils sont vérifiés par photo',
    description:
      'Une vérification rigoureuse pour une expérience plus sûre et plus authentique, afin de construire de vraies relations.',
  },
  {
    Icon: IconPeople,
    value: 60,
    kicker: 'Communauté',
    title: 'des utilisateurs sont des femmes',
    description:
      'Un environnement inclusif qui augmente vos chances de rencontrer quelqu\'un qui correspond vraiment à vos préférences.',
  },
]

/* ----------------------- Compteur animé à l'apparition ------------------- */
function useInView(threshold = 0.35) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect() }
    }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen]
}

function Counter({ to, run }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setN(to); return }
    let raf
    const start = performance.now()
    const dur = 1400
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1)
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, to])
  return <>{n}</>
}

/* ============================== COMPOSANT ================================== */
export default function FeaturesSection() {
  const [ref, seen] = useInView()

  return (
    <section className="fs-root" ref={ref}>
      <style>{CSS}</style>
      <div className="fs-glow fs-glow--a" />
      <div className="fs-glow fs-glow--b" />

      <div className="fs-inner">
        <header className="fs-head">
          <p className="fs-eyebrow">
            <span className="fs-eyebrow-line" />
            Pourquoi POPLOVE
          </p>
          <h2 className="fs-heading">
            Des rencontres vraies,
            <br />
            <em>sans frontières.</em>
          </h2>
        </header>

        <div className="fs-grid">
          {FEATURES.map(({ Icon, value, kicker, title, description }, i) => (
            <article className={`fs-card ${seen ? 'is-in' : ''}`} key={value} style={{ '--d': `${i * 120}ms` }}>
              <div className="fs-icon"><Icon /></div>
              <p className="fs-kicker">{kicker}</p>
              <div className="fs-stat">
                <Counter to={value} run={seen} /><span>%</span>
              </div>
              <h3 className="fs-title">{title}</h3>
              <p className="fs-desc">{description}</p>
            </article>
          ))}
        </div>

        <div className="fs-cta-wrap">
          <Link to="/register" className="fs-cta">
            Essayer maintenant
            <IconArrow />
          </Link>
          <p className="fs-cta-note">Inscription gratuite, sans engagement.</p>
        </div>
      </div>
    </section>
  )
}

/* ================================== STYLES ================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Manrope:wght@400;500;600;700;800&display=swap');

.fs-root {
  --rose: #ff6b9d; --rose-deep: #e63946; --gold: #f4d58d;
  --serif: 'Playfair Display', Georgia, serif; --sans: 'Manrope', system-ui, sans-serif;
  position: relative; overflow: hidden; padding: 120px 24px 130px;
  background: linear-gradient(180deg, #0b0710 0%, #120a1a 55%, #0b0710 100%);
  color: #fff; font-family: var(--sans); -webkit-font-smoothing: antialiased;
}
.fs-root *, .fs-root *::before, .fs-root *::after { box-sizing: border-box; }
.fs-root :focus-visible { outline: 2px solid var(--rose); outline-offset: 3px; }

.fs-glow { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; }
.fs-glow--a { width: 520px; height: 520px; top: -160px; left: -140px; background: #ff4d83; opacity: .16; }
.fs-glow--b { width: 480px; height: 480px; bottom: -180px; right: -120px; background: #7b2ff7; opacity: .16; }

.fs-inner { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; }

/* Titre de section */
.fs-head { text-align: center; margin-bottom: 72px; }
.fs-eyebrow { display: inline-flex; align-items: center; gap: 14px; margin: 0 0 22px; font-size: .75rem; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: var(--gold); }
.fs-eyebrow-line { width: 40px; height: 1px; background: var(--gold); }
.fs-heading { margin: 0; font-family: var(--serif); font-weight: 700; font-size: clamp(2.2rem, 4.6vw, 3.6rem); line-height: 1.1; letter-spacing: -.02em; }
.fs-heading em { font-style: italic; font-weight: 500; background: linear-gradient(135deg, #ff9cb8, var(--rose) 45%, var(--rose-deep)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; padding-right: .1em; }

/* Cartes */
.fs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 72px; }
.fs-card { position: relative; padding: 40px 32px 36px; border-radius: 28px; text-align: left; overflow: hidden;
  background: linear-gradient(160deg, rgba(255,255,255,.07), rgba(255,255,255,.02));
  border: 1px solid rgba(255,255,255,.12); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  opacity: 0; transform: translateY(26px);
  transition: opacity .8s ease var(--d), transform .8s cubic-bezier(.2,.7,.2,1) var(--d), border-color .3s, box-shadow .3s; }
.fs-card.is-in { opacity: 1; transform: none; }
.fs-card::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,156,184,.7), transparent); opacity: .7; }
.fs-card:hover { border-color: rgba(255,156,184,.4); box-shadow: 0 30px 60px -30px rgba(255,92,138,.5); }

.fs-icon { width: 58px; height: 58px; display: grid; place-items: center; margin-bottom: 26px; border-radius: 18px; color: var(--gold);
  background: rgba(244,213,141,.08); border: 1px solid rgba(244,213,141,.28); }
.fs-kicker { margin: 0 0 10px; font-size: .72rem; font-weight: 700; letter-spacing: .24em; text-transform: uppercase; color: rgba(255,255,255,.55); }
.fs-stat { font-family: var(--serif); font-weight: 700; font-size: clamp(3.6rem, 6vw, 4.8rem); line-height: 1; letter-spacing: -.03em; margin-bottom: 16px;
  background: linear-gradient(135deg, #fff 20%, #ff9cb8); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; font-variant-numeric: tabular-nums; }
.fs-stat span { font-size: .5em; margin-left: 2px; }
.fs-title { margin: 0 0 14px; font-size: 1.1rem; font-weight: 700; line-height: 1.4; color: #fff; }
.fs-desc { margin: 0; font-size: .95rem; line-height: 1.7; color: rgba(255,255,255,.66); }

/* Appel à l'action */
.fs-cta-wrap { text-align: center; }
.fs-cta { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 12px; min-width: 320px; min-height: 62px; padding: 0 36px; border-radius: 18px; color: #fff; font-weight: 800; font-size: 1.05rem; text-decoration: none;
  background: linear-gradient(135deg, var(--rose), var(--rose-deep)); box-shadow: 0 20px 44px -16px rgba(255,92,138,.9); transition: transform .25s, box-shadow .25s, filter .25s; }
.fs-cta::after { content: ''; position: absolute; inset: 0; background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.38) 50%, transparent 70%); transform: translateX(-120%); animation: fs-shine 4.5s ease-in-out infinite; }
@keyframes fs-shine { 0%, 60% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
.fs-cta:hover { transform: translateY(-3px); filter: brightness(1.07); box-shadow: 0 26px 54px -16px rgba(255,92,138,1); }
.fs-cta-note { margin: 18px 0 0; font-size: .85rem; color: rgba(255,255,255,.55); }

/* Responsive */
@media (max-width: 900px) {
  .fs-root { padding: 80px 20px 90px; }
  .fs-head { margin-bottom: 48px; }
  .fs-grid { grid-template-columns: 1fr; gap: 18px; margin-bottom: 52px; }
  .fs-card { padding: 32px 26px 30px; }
}
@media (max-width: 480px) {
  .fs-cta { min-width: 0; width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .fs-root *, .fs-root *::before, .fs-root *::after { animation: none !important; transition: none !important; }
  .fs-card { opacity: 1; transform: none; }
}
`