import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* ==========================================================================
   POPLOVE — Hero (Rencontres internationales, finition haut de gamme)
   ========================================================================== */

const LANGS = [
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'en', label: 'English', short: 'EN' }
]

const REGIONS = ['Europe', 'Amériques', 'Afrique', 'Asie']

/* ------------------------------- Icônes ---------------------------------- */
const Svg = ({ size = 18, children, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...r}>{children}</svg>
)
const IconGlobe = () => (<Svg size={16}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" /></Svg>)
const IconChevron = ({ open }) => (
  <Svg size={14} style={{ transition: 'transform .25s', transform: open ? 'rotate(180deg)' : 'none' }}><path d="m6 9 6 6 6-6" /></Svg>
)
const IconCheck = () => (<Svg size={14}><path d="M20 6 9 17l-5-5" strokeWidth="2.2" /></Svg>)
const IconMail = () => (<Svg size={20}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></Svg>)
const IconArrow = () => (<Svg size={16}><path d="M5 12h14m-6-6 6 6-6 6" /></Svg>)
const IconHeart = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.6 4.8 6.2 4.8c2.1 0 3.7 1.1 5.8 3.4 2.1-2.3 3.7-3.4 5.8-3.4 3.6 0 5.3 3.6 3.8 7C19.5 16.4 12 21 12 21z" />
  </svg>
)
const IconStar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="m12 2.8 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.6l-5.8 3.1 1.1-6.5L2.6 9.6l6.5-.9z" />
  </svg>
)

/* ------------------------- Sélecteur de langue --------------------------- */
function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState('fr')
  const ref = useRef(null)

  useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const current = LANGS.find((l) => l.code === lang)

  return (
    <div className="hs-lang" ref={ref}>
      <button
        type="button"
        className="hs-lang-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choisir la langue"
        onClick={() => setOpen((o) => !o)}
      >
        <IconGlobe />
        <span>{current.short}</span>
        <IconChevron open={open} />
      </button>

      {open && (
        <ul className="hs-lang-menu" role="listbox" aria-label="Langue">
          {LANGS.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === lang}>
              <button
                type="button"
                className={l.code === lang ? 'is-on' : ''}
                onClick={() => { setLang(l.code); setOpen(false) }}
              >
                <span>{l.label}</span>
                {l.code === lang && <IconCheck />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ============================== COMPOSANT ================================== */
export default function HeroSection() {
  return (
    <section className="hs-root">
      <style>{CSS}</style>

      {/* ---------- Vidéo d'arrière-plan ---------- */}
      <video className="hs-video" autoPlay loop muted playsInline poster="/couple-hero.png">
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="hs-overlay" />
      <div className="hs-grain" />

      {/* ---------- En-tête ---------- */}
      <header className="hs-header">
        <Link to="/" className="hs-logo" aria-label="POPLOVE">
          <span className="hs-logo-mark"><IconHeart size={16} /></span>
          <span className="hs-logo-text">POPLOVE</span>
        </Link>
        <LanguageSwitcher />
      </header>

      {/* ---------- Contenu ---------- */}
      <div className="hs-content">
        <p className="hs-eyebrow">
          <span className="hs-eyebrow-line" />
          Rencontres internationales
        </p>

        <h1 className="hs-title">
          L'amour n'a
          <br />
          <em>pas de frontières.</em>
        </h1>

        <p className="hs-lead">
          Rencontrez des personnes sincères en Europe, en Amérique, en Afrique et en Asie.
          Notre algorithme vous connecte à celles et ceux qui vous ressemblent vraiment, où qu'ils vivent.
        </p>

        <ul className="hs-regions" aria-label="Régions couvertes">
          {REGIONS.map((r) => (<li key={r}>{r}</li>))}
        </ul>

        {/* Statistiques */}
        <div className="hs-stats">
          <div>
            <div className="hs-stat-num">50K+</div>
            <div className="hs-stat-label">membres actifs</div>
          </div>
          <span className="hs-stat-sep" />
          <div>
            <div className="hs-stat-num">4.8<span className="hs-star"><IconStar /></span></div>
            <div className="hs-stat-label">1000+ avis</div>
          </div>
        </div>

        {/* Actions */}
        <div className="hs-actions">
          <button
            type="button"
            className="hs-btn hs-btn--light"
            onClick={() => { window.location.href = '/register?provider=google' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </button>

          <Link to="/register" className="hs-btn hs-btn--ghost">
            <IconMail />
            Continuer avec e-mail
            <span className="hs-btn-arrow"><IconArrow /></span>
          </Link>
        </div>

        <p className="hs-legal">
          En vous inscrivant, vous acceptez nos{' '}
          <Link to="/terms">Conditions d'utilisation</Link>, notre{' '}
          <Link to="/privacy">Politique de confidentialité</Link> et nos{' '}
          <Link to="/community-rules">Règles de la communauté</Link>.
        </p>
      </div>

      {/* ---------- Carte flottante : match international ---------- */}
      <aside className="hs-match" aria-label="Exemple de nouveau match">
        <span className="hs-match-icon"><IconHeart size={18} /></span>
        <div>
          <div className="hs-match-title">Nouveau match</div>
          <div className="hs-match-sub">Lomé <span>&harr;</span> Paris &middot; il y a 2 min</div>
        </div>
      </aside>

      <div className="hs-live">
        <span className="hs-live-dot" />
        En direct
      </div>
    </section>
  )
}

/* ================================== STYLES ================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,500;1,700&family=Manrope:wght@400;500;600;700;800&display=swap');

.hs-root {
  --rose: #ff6b9d; --rose-deep: #e63946; --gold: #f4d58d;
  --serif: 'Playfair Display', Georgia, serif; --sans: 'Manrope', system-ui, sans-serif;
  position: relative; min-height: 100vh; width: 100%; overflow: hidden;
  font-family: var(--sans); color: #fff; background: #0b0710; -webkit-font-smoothing: antialiased;
}
.hs-root *, .hs-root *::before, .hs-root *::after { box-sizing: border-box; }
.hs-root :focus-visible { outline: 2px solid var(--rose); outline-offset: 3px; }

/* Fond */
.hs-video { position: absolute; top: 50%; left: 50%; min-width: 100%; min-height: 100%; width: auto; height: auto; transform: translate(-50%, -50%); object-fit: cover; z-index: 0; }
.hs-overlay { position: absolute; inset: 0; z-index: 1;
  background:
    radial-gradient(120% 90% at 0% 100%, rgba(11, 7, 16, .92) 0%, rgba(11, 7, 16, 0) 60%),
    linear-gradient(90deg, rgba(11, 7, 16, .88) 0%, rgba(11, 7, 16, .55) 45%, rgba(11, 7, 16, .15) 100%); }
.hs-grain { position: absolute; inset: 0; z-index: 1; opacity: .06; pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }

/* En-tête */
.hs-header { position: absolute; top: 0; left: 0; right: 0; z-index: 10; display: flex; justify-content: space-between; align-items: center; padding: 28px 60px; }
.hs-logo { display: inline-flex; align-items: center; gap: 12px; color: #fff; text-decoration: none; }
.hs-logo-mark { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%; color: #fff; background: linear-gradient(135deg, var(--rose), var(--rose-deep)); box-shadow: 0 8px 22px -8px rgba(255, 107, 157, .9); }
.hs-logo-text { font-family: var(--serif); font-weight: 700; font-size: 1.5rem; letter-spacing: .28em; }

/* Langue */
.hs-lang { position: relative; }
.hs-lang-btn { display: inline-flex; align-items: center; gap: 9px; height: 42px; padding: 0 16px; border-radius: 999px; cursor: pointer; color: #fff; font-family: inherit; font-weight: 700; font-size: .78rem; letter-spacing: .16em;
  background: rgba(255, 255, 255, .08); border: 1px solid rgba(255, 255, 255, .22); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); transition: background .25s, border-color .25s; }
.hs-lang-btn:hover, .hs-lang-btn[aria-expanded="true"] { background: rgba(255, 255, 255, .16); border-color: rgba(255, 255, 255, .45); }
.hs-lang-menu { position: absolute; right: 0; top: calc(100% + 10px); min-width: 170px; margin: 0; padding: 6px; list-style: none; border-radius: 16px;
  background: rgba(20, 12, 28, .82); border: 1px solid rgba(255, 255, 255, .14); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 24px 50px -20px rgba(0, 0, 0, .8); animation: hs-pop .2s ease-out; }
.hs-lang-menu button { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; border: 0; border-radius: 11px; background: none; color: rgba(255, 255, 255, .8); font-family: inherit; font-size: .9rem; font-weight: 600; cursor: pointer; transition: background .2s, color .2s; }
.hs-lang-menu button:hover { background: rgba(255, 255, 255, .08); color: #fff; }
.hs-lang-menu button.is-on { color: var(--gold); }
@keyframes hs-pop { from { opacity: 0; transform: translateY(-6px) scale(.98); } to { opacity: 1; transform: none; } }

/* Contenu */
.hs-content { position: relative; z-index: 5; min-height: 100vh; max-width: 720px; padding: 130px 60px 60px; display: flex; flex-direction: column; justify-content: center; }
.hs-eyebrow { display: inline-flex; align-items: center; gap: 14px; margin: 0 0 26px; font-size: .75rem; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: var(--gold); }
.hs-eyebrow-line { width: 40px; height: 1px; background: var(--gold); }
.hs-title { font-family: var(--serif); font-weight: 700; font-size: clamp(2.9rem, 6.2vw, 5.4rem); line-height: 1.04; letter-spacing: -.02em; margin: 0 0 28px; }
.hs-title em { font-style: italic; font-weight: 500; background: linear-gradient(135deg, #ff9cb8 0%, var(--rose) 40%, var(--rose-deep) 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; padding-right: .1em; }
.hs-lead { max-width: 52ch; margin: 0 0 28px; font-size: 1.12rem; line-height: 1.7; color: rgba(255, 255, 255, .78); }

.hs-regions { display: flex; flex-wrap: wrap; gap: 10px; margin: 0 0 40px; padding: 0; list-style: none; }
.hs-regions li { padding: 8px 16px; border-radius: 999px; font-size: .8rem; font-weight: 600; letter-spacing: .06em; color: rgba(255, 255, 255, .88);
  background: rgba(255, 255, 255, .06); border: 1px solid rgba(255, 255, 255, .16); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }

/* Stats */
.hs-stats { display: flex; align-items: center; gap: 32px; margin-bottom: 44px; flex-wrap: wrap; }
.hs-stat-num { display: flex; align-items: center; gap: 6px; font-family: var(--serif); font-size: 2.4rem; font-weight: 700; line-height: 1; }
.hs-star { display: inline-flex; color: var(--gold); }
.hs-stat-label { margin-top: 8px; font-size: .78rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: rgba(255, 255, 255, .6); }
.hs-stat-sep { width: 1px; height: 46px; background: rgba(255, 255, 255, .25); }

/* Boutons */
.hs-actions { display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 410px; margin-bottom: 28px; }
.hs-btn { position: relative; width: 100%; min-height: 58px; padding: 0 28px; display: flex; align-items: center; justify-content: center; gap: 12px; border-radius: 16px; font-family: inherit; font-size: 1rem; font-weight: 700; text-decoration: none; cursor: pointer; transition: transform .25s, box-shadow .25s, background .25s, border-color .25s; }
.hs-btn--light { background: #fff; color: #1a1020; border: 0; box-shadow: 0 16px 36px -16px rgba(0, 0, 0, .7); }
.hs-btn--light:hover { transform: translateY(-3px); box-shadow: 0 22px 44px -16px rgba(255, 107, 157, .55); }
.hs-btn--ghost { color: #fff; background: rgba(255, 255, 255, .06); border: 1px solid rgba(255, 255, 255, .35); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.hs-btn--ghost:hover { background: rgba(255, 255, 255, .14); border-color: #fff; transform: translateY(-3px); }
.hs-btn-arrow { position: absolute; right: 22px; display: inline-flex; opacity: 0; transform: translateX(-6px); transition: opacity .25s, transform .25s; }
.hs-btn--ghost:hover .hs-btn-arrow { opacity: 1; transform: none; }

.hs-legal { max-width: 410px; margin: 0; font-size: .8rem; line-height: 1.7; color: rgba(255, 255, 255, .6); }
.hs-legal a { color: #fff; text-decoration: underline; text-decoration-color: rgba(255, 107, 157, .8); text-underline-offset: 3px; }

/* Carte match */
.hs-match { position: absolute; top: 30%; right: 12%; z-index: 6; display: flex; align-items: center; gap: 14px; padding: 14px 22px 14px 14px; border-radius: 22px;
  background: rgba(255, 255, 255, .12); border: 1px solid rgba(255, 255, 255, .28); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 24px 50px -20px rgba(0, 0, 0, .6); animation: hs-float 4s ease-in-out infinite; }
.hs-match-icon { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50%; color: #fff; background: linear-gradient(135deg, var(--rose), var(--rose-deep)); }
.hs-match-title { font-weight: 800; font-size: .92rem; }
.hs-match-sub { margin-top: 2px; font-size: .78rem; color: rgba(255, 255, 255, .72); }
.hs-match-sub span { color: var(--gold); margin: 0 2px; }
@keyframes hs-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

.hs-live { position: absolute; bottom: 30px; right: 30px; z-index: 6; display: inline-flex; align-items: center; gap: 9px; padding: 9px 16px; border-radius: 999px; font-size: .75rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
  background: rgba(11, 7, 16, .45); border: 1px solid rgba(255, 255, 255, .14); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
.hs-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--rose); animation: hs-pulse 2s infinite; }
@keyframes hs-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .5; transform: scale(1.4); } }

/* Responsive */
@media (max-width: 900px) {
  .hs-match { right: 6%; top: 24%; }
}
@media (max-width: 768px) {
  .hs-header { padding: 20px 22px; }
  .hs-logo-text { font-size: 1.2rem; letter-spacing: .2em; }
  .hs-content { padding: 110px 22px 50px; }
  .hs-overlay { background: linear-gradient(180deg, rgba(11, 7, 16, .55) 0%, rgba(11, 7, 16, .85) 55%, rgba(11, 7, 16, .96) 100%); }
  .hs-match { display: none; }
  .hs-live { bottom: 18px; right: 18px; }
  .hs-stats { gap: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .hs-root *, .hs-root *::before, .hs-root *::after { animation: none !important; transition: none !important; }
}
`