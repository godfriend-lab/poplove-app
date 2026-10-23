import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

/* ==========================================================================
   POPLOVE — Inscription en 8 étapes
   ========================================================================== */

const MIN_INTERESTS = 3
const MAX_INTERESTS = 20
const MIN_AGE = 18
const MAX_PHOTOS = 6
const DRAFT_KEY = 'poplove_register_draft'

const STEPS = ['Compte', 'Profil', 'Passions', 'Photos', 'Bio', 'Localisation', 'Mode de vie', 'Finalisation']

const HEADINGS = [
  ['Créez votre compte', 'Bienvenue sur POPLOVE. Quelques minutes suffisent.'],
  ['Parlez-nous de vous', 'Votre profil guide chaque suggestion.'],
  ['Vos passions', 'Les affinités naissent des passions communes.'],
  ['Ajoutez vos photos', 'Les profils avec photos reçoivent bien plus de messages.'],
  ['Décrivez-vous', 'Une bio sincère attire les bonnes personnes.'],
  ['Où êtes-vous ?', 'Trouvez des personnes près de chez vous.'],
  ['Votre mode de vie', 'Ces détails aident à créer des matchs pertinents.'],
  ['Dernière étape', 'Votre profil sera prêt dès la validation.']
]

/* Tous les pays (ISO 3166-1), noms générés en français par le navigateur */
const COUNTRY_CODES = 'AF AL DZ AD AO AG SA AR AM AU AT AZ BS BH BD BB BE BZ BJ BT BY MM BO BA BW BR BN BG BF BI KH CM CA CV CF CL CN CY CO KM CG CD KP KR CR CI HR CU DK DJ DM EG AE EC ER ES EE SZ US ET FJ FI FR GA GM GE GH GR GD GT GN GW GQ GY HT HN HU IN ID IQ IR IE IS IL IT JM JP JO KZ KE KG KI KW LA LS LV LB LR LY LI LT LU MK MG MY MW MV ML MT MA MH MU MR MX FM MD MC MN ME MZ NA NR NP NI NE NG NO NZ OM UG UZ PK PW PS PA PG PY NL PE PH PL PT QA DO CZ RO GB RU RW KN VC LC SB SV WS ST SN RS SC SL SG SK SI SO SD SS LK SE CH SR SY TJ TZ TD TH TL TG TO TT TN TM TR TV UA UY VU VA VE VN YE ZM ZW ZA'.split(' ')

const buildCountries = () => {
  try {
    const dn = new Intl.DisplayNames(['fr'], { type: 'region' })
    return COUNTRY_CODES.map((c) => dn.of(c)).filter(Boolean).sort((a, b) => a.localeCompare(b, 'fr'))
  } catch {
    return COUNTRY_CODES
  }
}
const ALL_COUNTRIES = buildCountries()

const GENDERS = ['Homme', 'Femme', 'Non-binaire', 'Autre']

const LOOKING_FOR = [
  { value: 'relation', label: 'Relation sérieuse', desc: 'Construire quelque chose de durable' },
  { value: 'mariage', label: 'Mariage', desc: 'Rencontrer la personne de votre vie' },
  { value: 'amitie', label: 'Amitié', desc: 'Élargir votre cercle' },
  { value: 'discuter', label: 'Échanger', desc: 'Discuter sans pression' }
]

const SMOKING_STATUS = [
  { value: 'never', label: 'Jamais', desc: 'Je ne fume pas' },
  { value: 'occasionally', label: 'Occasionnellement', desc: 'De temps en temps' },
  { value: 'regularly', label: 'Régulièrement', desc: 'Je fume régulièrement' },
  { value: 'former', label: 'Ancien fumeur', desc: "J'ai arrêté" }
]

const DRINKING_STATUS = [
  { value: 'never', label: 'Jamais', desc: "Je ne bois pas d'alcool" },
  { value: 'occasionally', label: 'Occasionnellement', desc: 'Pour les grandes occasions' },
  { value: 'socially', label: 'Socialement', desc: 'En soirée' },
  { value: 'regularly', label: 'Régulièrement', desc: 'Presque chaque semaine' }
]

const SEXUAL_ORIENTATIONS = [
  { value: 'heterosexual', label: 'Hétérosexuel' },
  { value: 'homosexual', label: 'Homosexuel' },
  { value: 'bisexual', label: 'Bisexuel' },
  { value: 'pansexual', label: 'Pansexuel' },
  { value: 'asexual', label: 'Asexuel' },
  { value: 'other', label: 'Autre' }
]

const INTEREST_CATEGORIES = [
  { name: 'Sports et fitness', interests: ['Football', 'Basketball', 'Tennis', 'Natation', 'Yoga', 'Musculation', 'Course à pied', 'Cyclisme', 'Boxe', 'Arts martiaux'] },
  { name: 'Musique et arts', interests: ['Pop', 'Hip-Hop', 'Jazz', 'Classique', 'Afrobeats', 'Guitare', 'Piano', 'Chant', 'Danse', 'Peinture', 'Photographie', 'Cinéma'] },
  { name: 'Voyage et aventure', interests: ['Randonnée', 'Plongée', 'Road trip', 'Camping', 'Safari', 'Culture', 'Gastronomie locale', 'Photographie de voyage'] },
  { name: 'Cuisine et gastronomie', interests: ['Cuisine africaine', 'Pâtisserie', 'Végétarien', 'Vegan', 'Sushi', 'Vin', 'Cocktails', 'Brunch', 'Street food'] },
  { name: 'Technologie', interests: ['Intelligence artificielle', 'Programmation', 'Gaming', 'Cryptomonnaie', 'Startups', 'Gadgets', 'Robotique'] },
  { name: 'Nature et animaux', interests: ['Chiens', 'Chats', 'Équitation', 'Jardinage', 'Écologie', 'Animaux sauvages', 'Océan'] },
  { name: 'Mode et beauté', interests: ['Fashion', 'Maquillage', 'Coiffure', 'Shopping', 'Luxe', 'Streetwear', 'Accessoires'] },
  { name: 'Lecture et écriture', interests: ['Romans', 'Poésie', 'Développement personnel', 'Histoire', 'Philosophie', 'Blogging'] },
  { name: 'Bien-être et spiritualité', interests: ['Méditation', 'Religion', 'Développement spirituel', 'Énergie positive', 'Pleine conscience'] },
  { name: 'Social et événements', interests: ['Festivals', 'Concerts', 'Soirées', 'Networking', 'Bénévolat', 'Communauté'] }
]

const PASSWORD_RULES = [
  { id: 'len', label: '8 caractères minimum', test: (p) => p.length >= 8 },
  { id: 'upper', label: 'Une majuscule', test: (p) => /[A-Z]/.test(p) },
  { id: 'digit', label: 'Un chiffre', test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'Un caractère spécial', test: (p) => /[^A-Za-z0-9]/.test(p) }
]
const STRENGTH_LABELS = ['', 'Faible', 'Moyen', 'Bon', 'Excellent']
const STRENGTH_COLORS = ['', '#ff6b7f', '#ffb04a', '#9ad46b', '#4fd1a1']

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '',
  password: '', confirmPassword: '',
  gender: '', birthDate: '', lookingFor: '',
  interests: [],
  photos: [], photoPreviews: [],
  description: '',
  country: '', city: '',
  smokingStatus: '', drinkingStatus: '', sexualOrientation: '',
  source: '', acceptTerms: false
}

/* ------------------------------ Logos officiels --------------------------- */
const ICON_CDN = 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons'

const Svg = ({ children, size = 24, viewBox = '0 0 24 24', ...rest }) => (
  <svg width={size} height={size} viewBox={viewBox} aria-hidden="true" focusable="false" {...rest}>{children}</svg>
)

const OPENAI_PATH = 'M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1195v-5.6772a.79.79 0 0 0-.407-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z'

/* Logos inline (YouTube, TikTok, Facebook, ChatGPT) */
const INLINE_LOGOS = {
  youtube: <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
  tiktok: <path fill="#000" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />,
  facebook: <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
  chatgpt: <path fill="#10A37F" d={OPENAI_PATH} />,
  friend: (
    <g fill="none" stroke="#D6335F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8.2" r="3.2" /><path d="M2.8 19.4c.6-3.2 3.1-5 6.2-5s5.6 1.8 6.2 5" />
      <path d="M15.8 5.4a3.1 3.1 0 0 1 0 5.8" /><path d="M18 14.6c1.8.6 3 2.2 3.4 4.4" />
    </g>
  ),
  other: (
    <g fill="#6b5a66"><circle cx="6" cy="12" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="18" cy="12" r="1.7" /></g>
  )
}

/* Logos officiels chargés depuis le CDN LobeHub (Gemini, Claude, Perplexity, Qwen) */
const REMOTE_LOGOS = {
  gemini: 'gemini-color.svg',
  claude: 'claude-color.svg',
  perplexity: 'perplexity-color.svg',
  qwen: 'qwen-color.svg'
}

const SOURCES = [
  { id: 'youtube', name: 'YouTube' }, { id: 'tiktok', name: 'TikTok' }, { id: 'facebook', name: 'Facebook' },
  { id: 'chatgpt', name: 'ChatGPT' }, { id: 'gemini', name: 'Gemini' }, { id: 'claude', name: 'Claude' },
  { id: 'qwen', name: 'Qwen' }, { id: 'perplexity', name: 'Perplexity' }, { id: 'friend', name: 'Un proche' },
  { id: 'other', name: 'Autre' }
]

function Logo({ id, name }) {
  const [failed, setFailed] = useState(false)
  if (INLINE_LOGOS[id]) return <Svg size={30}>{INLINE_LOGOS[id]}</Svg>
  if (REMOTE_LOGOS[id] && !failed) {
    return <img src={`${ICON_CDN}/${REMOTE_LOGOS[id]}`} alt="" width="30" height="30" loading="lazy" onError={() => setFailed(true)} />
  }
  return <span className="rg-logo-fallback">{name.charAt(0)}</span>
}

/* -------------------------------- Icônes UI ------------------------------- */
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
const IconCheck = ({ size = 14 }) => (<Svg size={size}><path {...stroke} strokeWidth="2.6" d="m5 12.5 4.5 4.5L19 7.5" /></Svg>)
const IconArrowLeft = () => (<Svg size={18}><path {...stroke} d="M19 12H5m6-6-6 6 6 6" /></Svg>)
const IconArrowRight = () => (<Svg size={18}><path {...stroke} d="M5 12h14m-6-6 6 6-6 6" /></Svg>)
const IconEye = () => (<Svg size={20}><path {...stroke} d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" /><circle {...stroke} cx="12" cy="12" r="3" /></Svg>)
const IconEyeOff = () => (<Svg size={20}><path {...stroke} d="M3 3l18 18M10.6 5.7A10 10 0 0 1 12 5.5c6.4 0 10 6.5 10 6.5a17 17 0 0 1-3.2 4M6.5 7.2C3.7 9 2 12 2 12s3.6 6.5 10 6.5c1.5 0 2.8-.3 4-.9M9.9 9.9a3 3 0 0 0 4.2 4.2" /></Svg>)
const IconSearch = () => (<Svg size={18}><circle {...stroke} cx="11" cy="11" r="6.5" /><path {...stroke} d="m20 20-4.2-4.2" /></Svg>)
const IconAlert = () => (<Svg size={15}><circle {...stroke} cx="12" cy="12" r="9" /><path {...stroke} d="M12 7.5v5.5M12 16.5h.01" /></Svg>)
const IconTrash = () => (<Svg size={16}><path {...stroke} d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Svg>)
const IconCamera = () => (<Svg size={28}><path {...stroke} d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle {...stroke} cx="12" cy="13" r="4" /></Svg>)
const IconChevron = () => (<Svg size={16}><path {...stroke} d="m6 9 6 6 6-6" /></Svg>)
const IconX = () => (<Svg size={14}><path {...stroke} d="M18 6 6 18M6 6l12 12" /></Svg>)
const IconLock = () => (<Svg size={16}><rect {...stroke} x="4" y="10" width="16" height="10" rx="2" /><path {...stroke} d="M8 10V7a4 4 0 0 1 8 0v3" /></Svg>)
const IconHeart = ({ size = 30 }) => (
  <Svg size={size}>
    <defs>
      <linearGradient id="pl-heart" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FF8FB0" /><stop offset="1" stopColor="#D6335F" />
      </linearGradient>
    </defs>
    <path d="M12 20.5C5.5 16 3 12.6 3 9.2 3 6.7 4.9 5 7.1 5c1.9 0 3.5 1 4.9 3 1.4-2 3-3 4.9-3C19.1 5 21 6.7 21 9.2c0 3.4-2.5 6.8-9 11.3Z" fill="url(#pl-heart)" />
  </Svg>
)
const IconGoogle = () => (<Svg size={20}><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></Svg>)
const IconApple = () => (<Svg size={20}><path fill="#fff" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></Svg>)

/* -------------------------------- Utilitaires ----------------------------- */
const todayISO = () => new Date().toISOString().split('T')[0]
const maxBirthDate = () => { const d = new Date(); d.setFullYear(d.getFullYear() - MIN_AGE); return d.toISOString().split('T')[0] }
const computeAge = (iso) => {
  const b = new Date(iso)
  if (Number.isNaN(b.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - b.getFullYear()
  const m = now.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--
  return age
}
const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const loadDraft = () => {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return { step: 1, data: EMPTY_FORM }
    const parsed = JSON.parse(raw)
    return { step: parsed.step || 1, data: { ...EMPTY_FORM, ...parsed.data, photos: [], photoPreviews: [], password: '', confirmPassword: '' } }
  } catch {
    return { step: 1, data: EMPTY_FORM }
  }
}

/* ============================== COMPOSANT PRINCIPAL ======================== */
export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const providerParam = searchParams.get('provider')

  const draft = useMemo(loadDraft, [])
  const [step, setStep] = useState(draft.step)
  const [formData, setFormData] = useState(draft.data)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [interestQuery, setInterestQuery] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [countryOpen, setCountryOpen] = useState(false)
  const [oauthUser, setOauthUser] = useState(null)
  const fileInputRef = useRef(null)
  const headingRef = useRef(null)
  const countryRef = useRef(null)
  const previewsRef = useRef([])

  const isOAuth = !!oauthUser

  /* Retour d'une connexion Google / Apple : on récupère la session et on préremplit */
  useEffect(() => {
    if (!providerParam) return
    let alive = true
    supabase.auth.getSession().then(({ data }) => {
      const user = data?.session?.user
      if (!alive || !user) return
      setOauthUser(user)
      const full = user.user_metadata?.full_name || user.user_metadata?.name || ''
      const [first = '', ...rest] = full.split(' ')
      setFormData((p) => ({
        ...p,
        email: p.email || user.email || '',
        firstName: p.firstName || user.user_metadata?.given_name || first,
        lastName: p.lastName || user.user_metadata?.family_name || rest.join(' ')
      }))
    })
    return () => { alive = false }
  }, [providerParam])

  useEffect(() => {
    const onDown = (e) => { if (countryRef.current && !countryRef.current.contains(e.target)) setCountryOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setCountryOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [])

  useEffect(() => {
    try {
      const { password, confirmPassword, photos, photoPreviews, ...safe } = formData
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ step, data: safe }))
    } catch { /* ignore */ }
  }, [formData, step])

  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0 }) }, [step])

  useEffect(() => { previewsRef.current = formData.photoPreviews }, [formData.photoPreviews])
  useEffect(() => () => previewsRef.current.forEach((u) => URL.revokeObjectURL(u)), [])

  const passwordScore = useMemo(() => PASSWORD_RULES.filter((r) => r.test(formData.password)).length, [formData.password])

  const set = (name, value) => {
    setFormData((p) => ({ ...p, [name]: value }))
    setErrors((p) => (p[name] ? { ...p, [name]: '' } : p))
    setSubmitError('')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    set(name, type === 'checkbox' ? checked : value)
  }

  const toggleInterest = (interest) => {
    setFormData((p) => {
      const has = p.interests.includes(interest)
      if (!has && p.interests.length >= MAX_INTERESTS) return p
      return { ...p, interests: has ? p.interests.filter((i) => i !== interest) : [...p.interests, interest] }
    })
    setErrors((p) => (p.interests ? { ...p, interests: '' } : p))
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'))
    e.target.value = ''
    if (!files.length) return
    setFormData((p) => {
      const slots = MAX_PHOTOS - p.photos.length
      const accepted = files.slice(0, Math.max(slots, 0))
      return {
        ...p,
        photos: [...p.photos, ...accepted],
        photoPreviews: [...p.photoPreviews, ...accepted.map((f) => URL.createObjectURL(f))]
      }
    })
    setErrors((p) => (p.photos ? { ...p, photos: '' } : p))
  }

  const removePhoto = (index) => {
    setFormData((p) => {
      URL.revokeObjectURL(p.photoPreviews[index])
      return {
        ...p,
        photos: p.photos.filter((_, i) => i !== index),
        photoPreviews: p.photoPreviews.filter((_, i) => i !== index)
      }
    })
  }

  const makeMainPhoto = (index) => {
    setFormData((p) => {
      const reorder = (arr) => [arr[index], ...arr.filter((_, i) => i !== index)]
      return { ...p, photos: reorder(p.photos), photoPreviews: reorder(p.photoPreviews) }
    })
  }

  const oauthSignIn = async (provider) => {
    setSubmitError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/register?provider=${provider}` }
    })
    if (error) setSubmitError(error.message)
  }

  const uploadPhotosToStorage = async (userId) => {
    const urls = []
    for (let i = 0; i < formData.photos.length; i++) {
      const file = formData.photos[i]
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const path = `${userId}/${Date.now()}_${i}.${ext}`
      const { error } = await supabase.storage.from('profiles').upload(path, file, { cacheControl: '3600', upsert: false })
      if (error) throw new Error(`Échec de l'envoi de la photo ${i + 1}.`)
      const { data } = supabase.storage.from('profiles').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }

  const validate = (s) => {
    const e = {}
    const f = formData
    if (s === 1) {
      if (!f.firstName.trim()) e.firstName = 'Indiquez votre prénom.'
      if (!f.lastName.trim()) e.lastName = 'Indiquez votre nom.'
      if (!f.email.trim()) e.email = 'Indiquez votre adresse email.'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Adresse email invalide.'
      if (f.phone.trim() && !/^\+?[0-9\s().-]{7,18}$/.test(f.phone.trim())) e.phone = 'Numéro invalide.'
      if (!isOAuth) {
        if (!f.password) e.password = 'Choisissez un mot de passe.'
        else if (passwordScore < 3 || f.password.length < 8) e.password = 'Mot de passe trop faible.'
        if (!f.confirmPassword) e.confirmPassword = 'Confirmez votre mot de passe.'
        else if (f.password !== f.confirmPassword) e.confirmPassword = 'Les mots de passe ne correspondent pas.'
      }
    }
    if (s === 2) {
      if (!f.gender) e.gender = 'Sélectionnez une option.'
      if (!f.birthDate) e.birthDate = 'Indiquez votre date de naissance.'
      else {
        const age = computeAge(f.birthDate)
        if (age === null || f.birthDate > todayISO()) e.birthDate = 'Date invalide.'
        else if (age < MIN_AGE) e.birthDate = `Vous devez avoir au moins ${MIN_AGE} ans.`
      }
      if (!f.lookingFor) e.lookingFor = 'Sélectionnez ce que vous recherchez.'
    }
    if (s === 3 && f.interests.length < MIN_INTERESTS) {
      const missing = MIN_INTERESTS - f.interests.length
      e.interests = `Choisissez encore ${missing} centre${missing > 1 ? 's' : ''} d'intérêt.`
    }
    if (s === 4 && f.photos.length === 0) e.photos = 'Ajoutez au moins une photo.'
    if (s === 5 && f.description.trim().length < 20) e.description = 'Décrivez-vous en au moins 20 caractères.'
    if (s === 6) {
      if (!f.country) e.country = 'Sélectionnez votre pays.'
      if (!f.city.trim()) e.city = 'Indiquez votre ville.'
    }
    if (s === 7) {
      if (!f.smokingStatus) e.smokingStatus = 'Sélectionnez votre statut.'
      if (!f.drinkingStatus) e.drinkingStatus = 'Sélectionnez votre statut.'
      if (!f.sexualOrientation) e.sexualOrientation = 'Sélectionnez votre orientation.'
    }
    if (s === 8) {
      if (!f.source) e.source = 'Sélectionnez une option.'
      if (!f.acceptTerms) e.acceptTerms = 'Acceptez les conditions pour continuer.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goNext = () => { if (validate(step)) setStep((s) => Math.min(s + 1, 8)) }
  const goBack = () => { setErrors({}); setStep((s) => Math.max(s - 1, 1)) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    if (step < 8) return goNext()
    if (!validate(8)) return

    setSubmitting(true)
    setSubmitError('')
    try {
      const p = formData
      let userId = oauthUser?.id

      if (!userId) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: p.email.trim(),
          password: p.password,
          options: { data: { first_name: p.firstName, last_name: p.lastName } }
        })
        if (authError) throw authError
        if (!authData.user) throw new Error('Échec de la création du compte.')
        userId = authData.user.id
      }

      setUploadingPhotos(true)
      const photoUrls = await uploadPhotosToStorage(userId)
      setUploadingPhotos(false)

      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        first_name: p.firstName.trim(),
        last_name: p.lastName.trim(),
        email: p.email.trim(),
        phone: p.phone.trim() || null,
        gender: p.gender,
        birth_date: p.birthDate,
        looking_for: p.lookingFor,
        interests: p.interests,
        description: p.description.trim(),
        country: p.country,
        city: p.city.trim(),
        smoking_status: p.smokingStatus,
        drinking_status: p.drinkingStatus,
        sexual_orientation: p.sexualOrientation,
        source: p.source,
        photos: photoUrls,
        profile_updated_at: new Date().toISOString()
      })
      if (profileError) throw profileError

      try { sessionStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
      navigate('/dashboard', { replace: true })
    } catch (err) {
      console.error('Erreur inscription:', err)
      setSubmitError(err?.message || 'La création du compte a échoué.')
    } finally {
      setSubmitting(false)
      setUploadingPhotos(false)
    }
  }

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return ALL_COUNTRIES
    const q = normalize(countrySearch)
    return ALL_COUNTRIES.filter((c) => normalize(c).includes(q))
  }, [countrySearch])

  const [title, subtitle] = HEADINGS[step - 1]
  const busy = submitting || uploadingPhotos

  return (
    <div className="rg-root">
      <style>{CSS}</style>

      {/* ==================== COLONNE GAUCHE ==================== */}
      <aside className="rg-aside">
        <div className="rg-orb rg-orb--a" />
        <div className="rg-orb rg-orb--b" />
        <Link to="/" className="rg-brand"><IconHeart size={34} /><span>POPLOVE</span></Link>

        <div className="rg-aside-body">
          <h1 className="rg-aside-title" key={step}>{title}</h1>
          <p className="rg-aside-text">{subtitle}</p>
          <ol className="rg-steps">
            {STEPS.map((label, i) => {
              const id = i + 1
              const state = id < step ? 'done' : id === step ? 'active' : 'todo'
              return (
                <li key={label} className={`rg-step rg-step--${state}`}>
                  <span className="rg-step-dot">{state === 'done' ? <IconCheck size={13} /> : id}</span>
                  <span className="rg-step-label">{label}</span>
                </li>
              )
            })}
          </ol>
        </div>
      </aside>

      {/* ==================== CONTENU ==================== */}
      <main className="rg-main">
        <div className="rg-panel">
          <div className="rg-progress" role="progressbar" aria-valuemin={1} aria-valuemax={8} aria-valuenow={step}>
            <div className="rg-progress-track"><span style={{ width: `${(step / 8) * 100}%` }} /></div>
            <span className="rg-progress-label">Étape {step} sur 8</span>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <header className="rg-head">
              <h2 ref={headingRef} tabIndex={-1}>{title}</h2>
              <p>{subtitle}</p>
            </header>

            <div className="rg-fade" key={step}>

              {/* ----- ÉTAPE 1 ----- */}
              {step === 1 && (
                <>
                  {!isOAuth && (
                    <>
                      <div className="rg-social">
                        <button type="button" className="rg-btn rg-btn--ghost" onClick={() => oauthSignIn('google')}><IconGoogle /> Continuer avec Google</button>
                        <button type="button" className="rg-btn rg-btn--ghost" onClick={() => oauthSignIn('apple')}><IconApple /> Continuer avec Apple</button>
                      </div>
                      <div className="rg-or"><span>ou avec votre email</span></div>
                    </>
                  )}
                  {isOAuth && (
                    <div className="rg-notice rg-notice--ok"><IconCheck size={16} /><p>Connecté via {providerParam === 'apple' ? 'Apple' : 'Google'}. Complétez simplement votre profil.</p></div>
                  )}
                  <div className="rg-grid-2">
                    <Field label="Prénom" name="firstName" autoComplete="given-name" value={formData.firstName} onChange={handleChange} error={errors.firstName} placeholder="Jean" />
                    <Field label="Nom" name="lastName" autoComplete="family-name" value={formData.lastName} onChange={handleChange} error={errors.lastName} placeholder="Dupont" />
                  </div>
                  <Field label="Adresse email" name="email" type="email" autoComplete="email" readOnly={isOAuth} value={formData.email} onChange={handleChange} error={errors.email} placeholder="jean.dupont@email.com" />
                  <Field label="Téléphone" optional name="phone" type="tel" autoComplete="tel" value={formData.phone} onChange={handleChange} error={errors.phone} placeholder="+228 90 00 00 00" />
                  {!isOAuth && (
                    <>
                      <PasswordField label="Mot de passe" name="password" autoComplete="new-password" value={formData.password} onChange={handleChange} error={errors.password} visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />
                      {formData.password && (
                        <div className="rg-strength">
                          <div className="rg-strength-bars">
                            {[1, 2, 3, 4].map((i) => (<span key={i} style={{ background: i <= passwordScore ? STRENGTH_COLORS[passwordScore] : undefined }} />))}
                          </div>
                          <strong style={{ color: STRENGTH_COLORS[passwordScore] }}>{STRENGTH_LABELS[passwordScore]}</strong>
                          <ul className="rg-rules">
                            {PASSWORD_RULES.map((r) => (
                              <li key={r.id} className={r.test(formData.password) ? 'ok' : ''}><IconCheck size={11} />{r.label}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <PasswordField label="Confirmer le mot de passe" name="confirmPassword" autoComplete="new-password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />
                    </>
                  )}
                  {submitError && <div className="rg-alert" role="alert"><IconAlert />{submitError}</div>}
                </>
              )}

              {/* ----- ÉTAPE 2 ----- */}
              {step === 2 && (
                <>
                  <fieldset className="rg-fieldset">
                    <legend>Je suis</legend>
                    <div className="rg-grid-4" role="radiogroup">
                      {GENDERS.map((g) => (<Choice key={g} selected={formData.gender === g} onClick={() => set('gender', g)} label={g} />))}
                    </div>
                    <FieldError message={errors.gender} />
                  </fieldset>
                  <div className="rg-field">
                    <label htmlFor="birthDate">Date de naissance</label>
                    <input id="birthDate" type="date" name="birthDate" min="1920-01-01" max={maxBirthDate()} value={formData.birthDate} onChange={handleChange} className={errors.birthDate ? 'has-error' : ''} />
                    <FieldError message={errors.birthDate} />
                  </div>
                  <fieldset className="rg-fieldset">
                    <legend>Je recherche</legend>
                    <div className="rg-grid-2" role="radiogroup">
                      {LOOKING_FOR.map((o) => (<Choice key={o.value} selected={formData.lookingFor === o.value} onClick={() => set('lookingFor', o.value)} label={o.label} desc={o.desc} />))}
                    </div>
                    <FieldError message={errors.lookingFor} />
                  </fieldset>
                </>
              )}

              {/* ----- ÉTAPE 3 ----- */}
              {step === 3 && (
                <>
                  <div className="rg-counter">
                    <div className="rg-counter-top">
                      <span><b>{formData.interests.length}</b> sélectionné{formData.interests.length > 1 ? 's' : ''} (minimum {MIN_INTERESTS})</span>
                      <span className={formData.interests.length >= MAX_INTERESTS ? 'is-max' : ''}>{formData.interests.length >= MAX_INTERESTS ? 'Maximum atteint' : `${MAX_INTERESTS} maximum`}</span>
                    </div>
                    <div className="rg-counter-bar"><span style={{ width: `${(formData.interests.length / MAX_INTERESTS) * 100}%` }} /></div>
                  </div>
                  <div className="rg-search">
                    <IconSearch />
                    <input type="search" value={interestQuery} onChange={(e) => setInterestQuery(e.target.value)} placeholder="Rechercher un centre d'intérêt" aria-label="Rechercher un centre d'intérêt" />
                  </div>
                  <FieldError message={errors.interests} />
                  <div className="rg-interests">
                    {INTEREST_CATEGORIES.map((c) => {
                      const list = interestQuery ? c.interests.filter((i) => normalize(i).includes(normalize(interestQuery))) : c.interests
                      if (!list.length) return null
                      return (
                        <section key={c.name}>
                          <h3>{c.name}</h3>
                          <div className="rg-chips">
                            {list.map((i) => {
                              const on = formData.interests.includes(i)
                              const disabled = !on && formData.interests.length >= MAX_INTERESTS
                              return (
                                <button key={i} type="button" disabled={disabled} aria-pressed={on} className={`rg-chip ${on ? 'is-on' : ''}`} onClick={() => toggleInterest(i)}>
                                  {on && <IconCheck size={13} />}{i}
                                </button>
                              )
                            })}
                          </div>
                        </section>
                      )
                    })}
                  </div>
                </>
              )}

              {/* ----- ÉTAPE 4 ----- */}
              {step === 4 && (
                <div className="rg-photos">
                  <div className="rg-photos-grid">
                    {Array.from({ length: MAX_PHOTOS }, (_, index) => {
                      const src = formData.photoPreviews[index]
                      return (
                        <div
                          key={index}
                          className={`rg-photo ${src ? 'has-photo' : ''}`}
                          role={src ? undefined : 'button'}
                          tabIndex={src ? undefined : 0}
                          onClick={() => !src && fileInputRef.current?.click()}
                          onKeyDown={(e) => { if (!src && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); fileInputRef.current?.click() } }}
                        >
                          {src ? (
                            <>
                              <img src={src} alt={`Photo ${index + 1}`} />
                              {index === 0 ? <span className="rg-photo-badge">Principale</span> : (
                                <button type="button" className="rg-photo-main" onClick={() => makeMainPhoto(index)}>Mettre en principale</button>
                              )}
                              <button type="button" className="rg-photo-del" aria-label={`Supprimer la photo ${index + 1}`} onClick={() => removePhoto(index)}><IconTrash /></button>
                            </>
                          ) : (
                            <>
                              <IconCamera />
                              <span className="rg-photo-label">{index === 0 ? 'Photo principale' : `Photo ${index + 1}`}</span>
                              <span className="rg-photo-hint">Cliquez pour ajouter</span>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handlePhotoUpload} hidden />
                  <FieldError message={errors.photos} />
                  <p className="rg-photo-info">{formData.photos.length} / {MAX_PHOTOS} photos. Ajoutez-en au moins une pour continuer.</p>
                </div>
              )}

              {/* ----- ÉTAPE 5 ----- */}
              {step === 5 && (
                <div className="rg-field">
                  <label htmlFor="description">Parlez-nous de vous</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    maxLength={600}
                    onChange={(e) => set('description', e.target.value)}
                    placeholder="Votre personnalité, vos passions, ce que vous recherchez. Soyez authentique."
                    rows={7}
                    className={errors.description ? 'has-error' : ''}
                  />
                  <div className="rg-char-count">
                    <span className={formData.description.trim().length < 20 ? 'warning' : 'ok'}>{formData.description.length} / 600 (minimum 20)</span>
                  </div>
                  <FieldError message={errors.description} />
                </div>
              )}

              {/* ----- ÉTAPE 6 ----- */}
              {step === 6 && (
                <>
                  <div className="rg-grid-2">
                    <div className="rg-field" ref={countryRef}>
                      <label id="country-label">Pays</label>
                      <div className="rg-country">
                        <button type="button" aria-haspopup="listbox" aria-expanded={countryOpen} aria-labelledby="country-label" className={`rg-country-btn ${errors.country ? 'has-error' : ''}`} onClick={() => setCountryOpen((o) => !o)}>
                          <span className={formData.country ? '' : 'placeholder'}>{formData.country || 'Sélectionnez votre pays'}</span>
                          <IconChevron />
                        </button>
                        {countryOpen && (
                          <div className="rg-country-dd">
                            <div className="rg-country-search">
                              <IconSearch />
                              <input type="text" value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} placeholder="Rechercher un pays" autoFocus aria-label="Rechercher un pays" />
                              {countrySearch && (<button type="button" className="rg-country-clear" aria-label="Effacer" onClick={() => setCountrySearch('')}><IconX /></button>)}
                            </div>
                            <div className="rg-country-list" role="listbox">
                              {filteredCountries.length === 0 ? (
                                <div className="rg-country-empty">Aucun pays trouvé</div>
                              ) : filteredCountries.map((c) => (
                                <button key={c} type="button" role="option" aria-selected={formData.country === c} className={`rg-country-opt ${formData.country === c ? 'is-sel' : ''}`}
                                  onClick={() => { set('country', c); setCountryOpen(false); setCountrySearch('') }}>
                                  {c}{formData.country === c && <IconCheck size={14} />}
                                </button>
                              ))}
                            </div>
                            <div className="rg-country-foot">{ALL_COUNTRIES.length} pays</div>
                          </div>
                        )}
                      </div>
                      <FieldError message={errors.country} />
                    </div>
                    <Field label="Ville" name="city" autoComplete="address-level2" value={formData.city} onChange={handleChange} error={errors.city} placeholder="Votre ville" />
                  </div>
                  <div className="rg-notice"><IconLock /><p>Votre position exacte reste privée. Seule votre ville apparaît sur votre profil.</p></div>
                </>
              )}

              {/* ----- ÉTAPE 7 ----- */}
              {step === 7 && (
                <>
                  <fieldset className="rg-fieldset">
                    <legend>Tabac</legend>
                    <div className="rg-grid-2" role="radiogroup">
                      {SMOKING_STATUS.map((s) => (<Choice key={s.value} selected={formData.smokingStatus === s.value} onClick={() => set('smokingStatus', s.value)} label={s.label} desc={s.desc} />))}
                    </div>
                    <FieldError message={errors.smokingStatus} />
                  </fieldset>
                  <fieldset className="rg-fieldset">
                    <legend>Alcool</legend>
                    <div className="rg-grid-2" role="radiogroup">
                      {DRINKING_STATUS.map((s) => (<Choice key={s.value} selected={formData.drinkingStatus === s.value} onClick={() => set('drinkingStatus', s.value)} label={s.label} desc={s.desc} />))}
                    </div>
                    <FieldError message={errors.drinkingStatus} />
                  </fieldset>
                  <fieldset className="rg-fieldset">
                    <legend>Orientation sexuelle</legend>
                    <div className="rg-grid-3" role="radiogroup">
                      {SEXUAL_ORIENTATIONS.map((s) => (<Choice key={s.value} selected={formData.sexualOrientation === s.value} onClick={() => set('sexualOrientation', s.value)} label={s.label} />))}
                    </div>
                    <FieldError message={errors.sexualOrientation} />
                  </fieldset>
                </>
              )}

              {/* ----- ÉTAPE 8 ----- */}
              {step === 8 && (
                <>
                  <fieldset className="rg-fieldset">
                    <legend>Comment avez-vous entendu parler de POPLOVE ?</legend>
                    <div className="rg-sources" role="radiogroup">
                      {SOURCES.map((s) => {
                        const on = formData.source === s.id
                        return (
                          <button key={s.id} type="button" role="radio" aria-checked={on} className={`rg-source ${on ? 'is-on' : ''}`} onClick={() => set('source', s.id)}>
                            {on && <span className="rg-source-check"><IconCheck size={11} /></span>}
                            <span className="rg-source-logo"><Logo id={s.id} name={s.name} /></span>
                            <span className="rg-source-name">{s.name}</span>
                          </button>
                        )
                      })}
                    </div>
                    <FieldError message={errors.source} />
                  </fieldset>
                  <label className={`rg-terms ${errors.acceptTerms ? 'has-error' : ''}`}>
                    <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} />
                    <span className="rg-terms-box"><IconCheck size={14} /></span>
                    <span>J'accepte les <Link to="/terms" target="_blank">Conditions d'utilisation</Link> et la <Link to="/privacy" target="_blank">Politique de confidentialité</Link>.</span>
                  </label>
                  <FieldError message={errors.acceptTerms} />
                  {submitError && <div className="rg-alert" role="alert"><IconAlert />{submitError}</div>}
                </>
              )}
            </div>

            <div className="rg-actions">
              {step > 1 && (
                <button type="button" className="rg-btn rg-btn--ghost" onClick={goBack} disabled={busy}><IconArrowLeft /> Retour</button>
              )}
              <button type="submit" className="rg-btn rg-btn--primary" disabled={busy}>
                {busy ? (<><span className="rg-spinner" />{uploadingPhotos ? 'Envoi des photos' : 'Création en cours'}</>) : step === 8 ? 'Créer mon compte' : (<>Continuer <IconArrowRight /></>)}
              </button>
            </div>
          </form>

          <p className="rg-login">Vous avez déjà un compte ? <Link to="/login">Se connecter</Link></p>
        </div>
      </main>
    </div>
  )
}

/* ============================ Composants auxiliaires ======================== */
function FieldError({ message }) {
  if (!message) return null
  return <div className="rg-error" role="alert"><IconAlert />{message}</div>
}

function Field({ label, name, error, optional, ...rest }) {
  const id = `f-${name}`
  return (
    <div className="rg-field">
      <label htmlFor={id}>{label}{optional && <span className="rg-optional"> (important)</span>}</label>
      <input id={id} name={name} className={error ? 'has-error' : ''} aria-invalid={!!error} {...rest} />
      <FieldError message={error} />
    </div>
  )
}

function PasswordField({ label, name, error, visible, onToggle, ...rest }) {
  const id = `f-${name}`
  return (
    <div className="rg-field">
      <label htmlFor={id}>{label}</label>
      <div className="rg-pw">
        <input id={id} name={name} type={visible ? 'text' : 'password'} className={error ? 'has-error' : ''} aria-invalid={!!error} placeholder="Votre mot de passe" {...rest} />
        <button type="button" onClick={onToggle} aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>{visible ? <IconEyeOff /> : <IconEye />}</button>
      </div>
      <FieldError message={error} />
    </div>
  )
}

function Choice({ selected, onClick, label, desc }) {
  return (
    <button type="button" role="radio" aria-checked={selected} className={`rg-choice ${selected ? 'is-on' : ''}`} onClick={onClick}>
      <span className="rg-choice-label">{label}</span>
      {desc && <span className="rg-choice-desc">{desc}</span>}
      <span className="rg-choice-radio">{selected && <IconCheck size={11} />}</span>
    </button>
  )
}

/* ================================== STYLES ================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;600;700&display=swap');

.rg-root {
  --bg: #0b0710; --bg-2: #130b1c; --surface: #1b1126; --surface-2: #261935;
  --line: rgba(246, 234, 240, .09); --line-strong: rgba(246, 234, 240, .18);
  --text: #f7eef2; --muted: #ab9aa7;
  --rose: #ff5c8a; --rose-deep: #d6335f; --rose-soft: #ff9cb8;
  --error: #ff7d8f; --ok: #4fd1a1;
  --serif: 'Fraunces', Georgia, serif; --sans: 'Manrope', system-ui, sans-serif;
  min-height: 100vh; display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  background: var(--bg); color: var(--text); font-family: var(--sans); -webkit-font-smoothing: antialiased;
}
.rg-root *, .rg-root *::before, .rg-root *::after { box-sizing: border-box; }
.rg-root a { color: inherit; }
.rg-root button { font-family: inherit; }
.rg-root :focus-visible { outline: 2px solid var(--rose); outline-offset: 3px; }

/* Colonne gauche */
.rg-aside { position: sticky; top: 0; height: 100vh; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; padding: clamp(32px, 5vw, 72px); background: linear-gradient(160deg, #2a0f2e 0%, var(--bg-2) 55%, #1a0a1d 100%); border-right: 1px solid var(--line); }
.rg-orb { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; opacity: .55; }
.rg-orb--a { width: 420px; height: 420px; background: #ff4d83; top: -140px; left: -120px; animation: rg-float 14s ease-in-out infinite alternate; }
.rg-orb--b { width: 380px; height: 380px; background: #7b2ff7; bottom: -160px; right: -140px; opacity: .4; animation: rg-float 18s ease-in-out infinite alternate-reverse; }
@keyframes rg-float { from { transform: translate(0, 0) scale(1); } to { transform: translate(50px, 40px) scale(1.12); } }
.rg-brand { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; position: relative; z-index: 1; width: fit-content; }
.rg-brand span { font-family: var(--serif); font-size: 1.7rem; font-weight: 700; letter-spacing: .12em; }
.rg-aside-body { position: relative; z-index: 1; max-width: 460px; }
.rg-aside-title { font-family: var(--serif); font-weight: 700; font-size: clamp(2.3rem, 3.6vw, 3.6rem); line-height: 1.05; letter-spacing: -.02em; margin: 0 0 18px; animation: rg-rise .6s cubic-bezier(.2,.7,.2,1) both; }
.rg-aside-text { color: var(--muted); font-size: 1.02rem; line-height: 1.65; margin: 0 0 44px; max-width: 38ch; }
.rg-steps { list-style: none; margin: 0; padding: 0; }
.rg-step { display: flex; align-items: center; gap: 16px; position: relative; padding: 9px 0; color: var(--muted); transition: color .3s; }
.rg-step:not(:last-child)::after { content: ''; position: absolute; left: 15px; top: 40px; width: 1px; height: calc(100% - 18px); background: var(--line-strong); }
.rg-step--done:not(:last-child)::after { background: var(--rose); }
.rg-step-dot { width: 31px; height: 31px; border-radius: 50%; display: grid; place-items: center; flex: none; border: 1px solid var(--line-strong); font-size: .8rem; font-weight: 700; background: var(--bg-2); position: relative; z-index: 1; transition: all .3s; }
.rg-step-label { font-size: .96rem; font-weight: 500; }
.rg-step--active { color: var(--text); }
.rg-step--active .rg-step-dot { border-color: var(--rose); color: var(--rose); box-shadow: 0 0 0 5px rgba(255, 92, 138, .16); }
.rg-step--done { color: var(--text); }
.rg-step--done .rg-step-dot { background: var(--rose); border-color: var(--rose); color: #fff; }

/* Contenu */
.rg-main { display: flex; justify-content: center; padding: clamp(24px, 5vw, 64px) clamp(18px, 4vw, 56px); }
.rg-panel { width: 100%; max-width: 720px; margin: auto 0; }
.rg-progress { display: flex; align-items: center; gap: 14px; margin-bottom: 36px; }
.rg-progress-track { flex: 1; height: 5px; border-radius: 5px; background: var(--line); overflow: hidden; }
.rg-progress-track span { display: block; height: 100%; border-radius: 5px; background: linear-gradient(90deg, var(--rose), var(--rose-deep)); transition: width .5s cubic-bezier(.2,.7,.2,1); }
.rg-progress-label { font-size: .8rem; color: var(--muted); white-space: nowrap; font-weight: 600; }
.rg-head { margin-bottom: 28px; }
.rg-head h2 { font-family: var(--serif); font-size: clamp(2rem, 3.4vw, 2.8rem); font-weight: 700; line-height: 1.1; margin: 0 0 10px; outline: none; letter-spacing: -.02em; }
.rg-head p { margin: 0; color: var(--muted); font-size: .98rem; line-height: 1.6; max-width: 52ch; }
.rg-fade { animation: rg-rise .45s cubic-bezier(.2,.7,.2,1) both; }
@keyframes rg-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

/* Boutons */
.rg-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 54px; padding: 0 24px; border-radius: 14px; font-size: .96rem; font-weight: 700; cursor: pointer; border: 1px solid transparent; transition: transform .15s, background .2s, border-color .2s, box-shadow .2s, filter .2s; }
.rg-btn:disabled { cursor: not-allowed; opacity: .6; }
.rg-btn:active:not(:disabled) { transform: translateY(1px) scale(.99); }
.rg-btn--primary { flex: 1; background: linear-gradient(135deg, var(--rose), var(--rose-deep)); color: #fff; box-shadow: 0 12px 30px -10px rgba(255, 92, 138, .7); }
.rg-btn--primary:hover:not(:disabled) { box-shadow: 0 16px 38px -10px rgba(255, 92, 138, .9); filter: brightness(1.06); }
.rg-btn--ghost { background: rgba(255,255,255,.03); border-color: var(--line-strong); color: var(--text); }
.rg-btn--ghost:hover:not(:disabled) { background: rgba(255,255,255,.08); border-color: rgba(246,234,240,.4); }
.rg-spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; animation: rg-spin .7s linear infinite; }
@keyframes rg-spin { to { transform: rotate(360deg); } }
.rg-actions { display: flex; gap: 12px; margin-top: 32px; }
.rg-social { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.rg-or { display: flex; align-items: center; gap: 16px; margin: 26px 0; color: var(--muted); font-size: .85rem; }
.rg-or::before, .rg-or::after { content: ''; flex: 1; height: 1px; background: var(--line); }

/* Grilles */
.rg-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.rg-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.rg-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }

/* Champs */
.rg-field { margin-bottom: 18px; }
.rg-field > label, .rg-fieldset legend { display: block; font-size: .88rem; font-weight: 700; margin-bottom: 9px; color: var(--text); padding: 0; }
.rg-optional { color: var(--muted); font-weight: 400; }
.rg-field input, .rg-field textarea { width: 100%; padding: 15px 16px; border-radius: 14px; font: inherit; font-size: .98rem; color: var(--text); background: var(--surface); border: 1px solid var(--line); transition: border-color .2s, box-shadow .2s, background .2s; }
.rg-field textarea { resize: vertical; min-height: 140px; line-height: 1.6; }
.rg-field input::placeholder, .rg-field textarea::placeholder { color: #6f6068; }
.rg-field input:hover, .rg-field textarea:hover { border-color: var(--line-strong); }
.rg-field input:focus, .rg-field textarea:focus { outline: none; border-color: var(--rose); box-shadow: 0 0 0 4px rgba(255, 92, 138, .18); background: var(--surface-2); }
.rg-field input.has-error, .rg-field textarea.has-error { border-color: var(--error); }
.rg-field input[readonly] { opacity: .7; cursor: not-allowed; }
.rg-field input[type='date'] { color-scheme: dark; }
.rg-pw { position: relative; }
.rg-pw input { padding-right: 54px; }
.rg-pw button { position: absolute; right: 6px; top: 6px; width: 42px; height: 42px; display: grid; place-items: center; border: 0; background: none; color: var(--muted); border-radius: 10px; cursor: pointer; }
.rg-pw button:hover { color: var(--text); background: rgba(255,255,255,.06); }
.rg-fieldset { border: 0; margin: 0 0 26px; padding: 0; min-width: 0; }
.rg-error { display: flex; gap: 7px; align-items: center; color: var(--error); font-size: .84rem; margin-top: 8px; line-height: 1.4; }
.rg-error svg { flex: none; }
.rg-alert { display: flex; gap: 10px; align-items: center; padding: 14px 16px; border-radius: 12px; margin-top: 18px; color: var(--error); background: rgba(255,125,143,.08); border: 1px solid rgba(255,125,143,.35); font-size: .9rem; }
.rg-strength { margin: -6px 0 20px; padding: 14px 16px; border-radius: 14px; background: rgba(255,255,255,.025); border: 1px solid var(--line); display: grid; grid-template-columns: 1fr auto; gap: 12px 14px; align-items: center; }
.rg-strength-bars { display: flex; gap: 5px; }
.rg-strength-bars span { flex: 1; height: 5px; border-radius: 3px; background: var(--line-strong); transition: background .3s; }
.rg-strength strong { font-size: .8rem; font-weight: 700; }
.rg-rules { grid-column: 1 / -1; list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px 16px; }
.rg-rules li { display: inline-flex; align-items: center; gap: 6px; font-size: .78rem; color: var(--muted); }
.rg-rules li.ok { color: var(--ok); }
.rg-rules li:not(.ok) svg { opacity: .25; }

/* Choix */
.rg-choice { position: relative; text-align: left; display: flex; flex-direction: column; gap: 4px; padding: 16px 44px 16px 16px; border-radius: 14px; cursor: pointer; background: var(--surface); border: 1px solid var(--line); color: var(--text); transition: border-color .2s, background .2s, transform .15s; }
.rg-choice:hover { border-color: var(--line-strong); transform: translateY(-1px); }
.rg-choice.is-on { border-color: var(--rose); background: rgba(255, 92, 138, .11); }
.rg-choice-label { font-weight: 700; font-size: .95rem; }
.rg-choice-desc { color: var(--muted); font-size: .82rem; line-height: 1.4; }
.rg-choice-radio { position: absolute; right: 14px; top: 50%; margin-top: -10px; width: 20px; height: 20px; border-radius: 50%; border: 1px solid var(--line-strong); display: grid; place-items: center; color: #fff; transition: all .2s; }
.rg-choice.is-on .rg-choice-radio { background: var(--rose); border-color: var(--rose); }
.rg-grid-4 .rg-choice, .rg-grid-3 .rg-choice { padding: 16px 12px; text-align: center; align-items: center; }
.rg-grid-4 .rg-choice-radio, .rg-grid-3 .rg-choice-radio { display: none; }

/* Passions */
.rg-counter { margin-bottom: 18px; }
.rg-counter-top { display: flex; justify-content: space-between; font-size: .86rem; color: var(--muted); margin-bottom: 10px; }
.rg-counter-top b { color: var(--text); font-size: 1rem; }
.rg-counter-top .is-max { color: var(--rose); font-weight: 700; }
.rg-counter-bar { position: relative; height: 5px; border-radius: 3px; background: var(--line); overflow: hidden; }
.rg-counter-bar span { position: absolute; inset: 0 auto 0 0; border-radius: 3px; background: linear-gradient(90deg, var(--rose), var(--rose-deep)); transition: width .3s; }
.rg-search { position: relative; margin-bottom: 18px; color: var(--muted); }
.rg-search svg { position: absolute; left: 16px; top: 18px; }
.rg-search input { width: 100%; height: 54px; padding: 0 16px 0 46px; border-radius: 14px; font: inherit; font-size: .96rem; color: var(--text); background: var(--surface); border: 1px solid var(--line); }
.rg-search input:focus { outline: none; border-color: var(--rose); box-shadow: 0 0 0 4px rgba(255,92,138,.18); }
.rg-interests { max-height: 420px; overflow-y: auto; padding-right: 8px; margin-right: -8px; display: grid; gap: 26px; }
.rg-interests h3 { margin: 0 0 12px; font-size: .9rem; font-weight: 700; color: var(--muted); padding-bottom: 10px; border-bottom: 1px solid var(--line); }
.rg-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.rg-chip { display: inline-flex; align-items: center; gap: 6px; height: 40px; padding: 0 16px; border-radius: 999px; font-size: .88rem; font-weight: 600; cursor: pointer; color: var(--text); background: var(--surface); border: 1px solid var(--line); transition: all .18s; }
.rg-chip:hover:not(:disabled) { border-color: var(--line-strong); transform: translateY(-1px); }
.rg-chip.is-on { background: linear-gradient(135deg, rgba(255,92,138,.3), rgba(214,51,95,.25)); border-color: var(--rose); color: #fff; }
.rg-chip:disabled { opacity: .35; cursor: not-allowed; }

/* Photos */
.rg-photos { margin-bottom: 8px; }
.rg-photos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 14px; }
.rg-photo { aspect-ratio: 3 / 4; border-radius: 18px; border: 2px dashed var(--line-strong); background: var(--surface); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: border-color .25s, background .25s, transform .2s; position: relative; overflow: hidden; color: var(--rose); }
.rg-photo:hover { border-color: var(--rose); background: rgba(255,92,138,.06); transform: translateY(-2px); }
.rg-photo.has-photo { border-style: solid; border-color: var(--line-strong); cursor: default; transform: none; }
.rg-photo img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
.rg-photo-label { font-weight: 700; color: var(--text); font-size: .9rem; }
.rg-photo-hint { font-size: .78rem; color: var(--muted); }
.rg-photo-badge { position: absolute; top: 10px; left: 10px; background: var(--rose); color: #fff; padding: 5px 11px; border-radius: 20px; font-size: .74rem; font-weight: 700; z-index: 2; }
.rg-photo-main { position: absolute; left: 10px; right: 10px; bottom: 10px; z-index: 2; padding: 8px; border-radius: 10px; border: 0; background: rgba(11,7,16,.78); color: #fff; font-size: .76rem; font-weight: 600; cursor: pointer; backdrop-filter: blur(6px); transition: background .2s; }
.rg-photo-main:hover { background: var(--rose-deep); }
.rg-photo-del { position: absolute; top: 10px; right: 10px; width: 34px; height: 34px; border-radius: 50%; background: rgba(11,7,16,.78); border: 0; color: #fff; display: grid; place-items: center; cursor: pointer; transition: background .2s; z-index: 2; backdrop-filter: blur(6px); }
.rg-photo-del:hover { background: #e63950; }
.rg-photo-info { text-align: center; color: var(--muted); font-size: .88rem; margin: 10px 0 0; }

/* Pays */
.rg-country { position: relative; }
.rg-country-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 15px 16px; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; color: var(--text); font: inherit; font-size: .98rem; cursor: pointer; transition: all .2s; text-align: left; }
.rg-country-btn:hover { border-color: var(--line-strong); background: var(--surface-2); }
.rg-country-btn.has-error { border-color: var(--error); }
.rg-country-btn .placeholder { color: #6f6068; }
.rg-country-btn svg { color: var(--muted); flex: none; }
.rg-country-dd { position: absolute; top: calc(100% + 8px); left: 0; right: 0; min-width: 260px; background: var(--surface); border: 1px solid var(--line-strong); border-radius: 14px; box-shadow: 0 24px 60px rgba(0,0,0,.55); z-index: 100; overflow: hidden; animation: rg-rise .2s ease both; }
.rg-country-search { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-bottom: 1px solid var(--line); background: var(--surface-2); }
.rg-country-search svg { color: var(--muted); flex: none; }
.rg-country-search input { flex: 1; min-width: 0; background: none; border: none; outline: none; color: var(--text); font: inherit; font-size: .95rem; }
.rg-country-clear { background: none; border: none; color: var(--muted); cursor: pointer; padding: 5px; display: grid; place-items: center; border-radius: 50%; }
.rg-country-clear:hover { color: var(--text); background: rgba(255,255,255,.1); }
.rg-country-list { max-height: 300px; overflow-y: auto; padding: 8px; }
.rg-country-opt { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: none; border: none; border-radius: 9px; color: var(--text); font: inherit; font-size: .94rem; cursor: pointer; text-align: left; }
.rg-country-opt:hover { background: var(--surface-2); }
.rg-country-opt.is-sel { background: rgba(255,92,138,.16); color: var(--rose-soft); font-weight: 700; }
.rg-country-empty { padding: 20px; text-align: center; color: var(--muted); font-size: .9rem; }
.rg-country-foot { padding: 9px 16px; border-top: 1px solid var(--line); background: var(--surface-2); font-size: .78rem; color: var(--muted); text-align: center; }

/* Sources */
.rg-sources { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
.rg-source { position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 16px 6px 12px; border-radius: 16px; cursor: pointer; background: var(--surface); border: 1px solid var(--line); color: var(--muted); transition: all .2s; }
.rg-source:hover { border-color: var(--line-strong); color: var(--text); transform: translateY(-2px); }
.rg-source.is-on { border-color: var(--rose); background: rgba(255,92,138,.1); color: var(--text); }
.rg-source-logo { width: 52px; height: 52px; border-radius: 15px; display: grid; place-items: center; background: #fff; box-shadow: 0 6px 16px -6px rgba(0,0,0,.5); }
.rg-source-logo img { display: block; }
.rg-logo-fallback { font-weight: 800; color: #261935; font-size: 1.2rem; }
.rg-source-name { font-size: .8rem; font-weight: 700; text-align: center; }
.rg-source-check { position: absolute; top: 7px; right: 7px; width: 20px; height: 20px; border-radius: 50%; background: var(--rose); color: #fff; display: grid; place-items: center; z-index: 1; }

/* Conditions et notices */
.rg-terms { display: flex; gap: 14px; align-items: flex-start; cursor: pointer; font-size: .9rem; line-height: 1.55; color: var(--muted); position: relative; }
.rg-terms input { position: absolute; opacity: 0; width: 22px; height: 22px; margin: 0; cursor: pointer; }
.rg-terms-box { width: 22px; height: 22px; border-radius: 7px; flex: none; display: grid; place-items: center; border: 1px solid var(--line-strong); background: var(--surface); color: transparent; transition: all .2s; margin-top: 1px; }
.rg-terms input:checked + .rg-terms-box { background: var(--rose); border-color: var(--rose); color: #fff; }
.rg-terms input:focus-visible + .rg-terms-box { outline: 2px solid var(--rose); outline-offset: 3px; }
.rg-terms.has-error .rg-terms-box { border-color: var(--error); }
.rg-terms a { color: var(--text); text-decoration: underline; text-decoration-color: var(--rose); text-underline-offset: 3px; }
.rg-login { text-align: center; color: var(--muted); font-size: .92rem; margin: 32px 0 0; }
.rg-login a { color: var(--text); font-weight: 700; text-decoration: underline; text-decoration-color: var(--rose); text-underline-offset: 4px; }
.rg-notice { display: flex; gap: 12px; align-items: flex-start; padding: 14px 16px; border-radius: 14px; background: rgba(255,255,255,.03); border: 1px solid var(--line-strong); color: var(--muted); font-size: .9rem; margin: 6px 0 18px; }
.rg-notice p { margin: 0; line-height: 1.5; }
.rg-notice svg { flex: none; margin-top: 2px; color: var(--rose-soft); }
.rg-notice--ok { background: rgba(79,209,161,.08); border-color: rgba(79,209,161,.35); }
.rg-notice--ok svg { color: var(--ok); }
.rg-char-count { text-align: right; font-size: .8rem; margin-top: 8px; color: var(--muted); }
.rg-char-count .warning { color: var(--error); font-weight: 700; }
.rg-char-count .ok { color: var(--ok); font-weight: 700; }

/* Responsive */
@media (max-width: 960px) {
  .rg-root { grid-template-columns: 1fr; }
  .rg-aside { display: none; }
  .rg-panel { margin: 0 auto; }
}
@media (max-width: 640px) {
  .rg-sources { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 520px) {
  .rg-social, .rg-grid-2 { grid-template-columns: 1fr; }
  .rg-grid-3, .rg-grid-4 { grid-template-columns: repeat(2, 1fr); }
  .rg-photos-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .rg-root *, .rg-root *::before, .rg-root *::after { animation: none !important; transition: none !important; }
}
`