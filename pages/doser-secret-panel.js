import { useState, useEffect, useMemo, useCallback } from 'react'
import Head from 'next/head'

/**
 * DOSER ADMIN OS v2.0
 * Fully rewritten for maximum performance, clean UI, and robust security.
 */

// --- Constants & Utilities ---
const STORAGE_KEYS = {
  SESSION: 'doserAdminPass',
  HISTORY: 'adminHistory',
  HISTORY_IDX: 'adminHistoryIndex',
  VERSIONS: 'portfolioVersions',
  THEME: 'adminPanelTheme'
}

const DEFAULT_DATA = {
  colors: {
    dark: { mainColor: '#00f0ff', bgColor: '#0a0a0a', secBgColor: '#1a1a1a', textColor: '#e8e8e8', textMuted: '#94a3b8' },
    light: { mainColor: '#0066ff', bgColor: '#f8f9fa', secBgColor: '#ffffff', textColor: '#2d3748', textMuted: '#64748b' }
  },
  texts: {
    en: {
      home: "Home", education: "Learning Journey", services: "Services", contact: "Contact", mywebsites: "Projects",
      hi: "Hi, I'm", name: "Abdelrahman Doser", iama: "I'm a", social: "Find me on",
      homeDesc: "Full-Stack Developer & AI Specialist. I build modern websites and integrated AI solutions for a smarter digital experience.",
      hire: "Hire Me", contactme: "Contact Me", educationHeading: "My Learning Path",
      skillsHeading: "Technical Skills", aiSpecialist: "AI Integration Specialist",
      edu1Title: "Web Fundamentals", edu1Desc: "Learned HTML, CSS, and JavaScript with the best practices from Elzero Web School.",
      edu2Title: "Python & Java", edu2Desc: "Mastered programming logic and backend basics with Python and Java.",
      edu3Title: "Modern Tech", edu3Desc: "Advanced learning in React, Next.js, and Node.js for building dynamic apps.",
      edu4Title: "AI Development", edu4Desc: "Deeply experienced in using and integrating AI to solve coding challenges faster.",
      uiux: "UI/UX Design", frontend: "Frontend Development", backend: "Backend Development", testing: "QA & Testing",
      uiuxDesc: "Designing clean, modern, and user-friendly interfaces.",
      frontendDesc: "Creating responsive web apps using React and Next.js.",
      backendDesc: "Building stable servers and databases with Node.js.",
      testingDesc: "Ensuring your website works perfectly on all devices.",
      contactHeading: "Let's Work Together", namePlaceholder: "Your Name", emailPlaceholder: "Your Email", messagePlaceholder: "How can I help you?", sendMessage: "Send Message",
      myWebsitesHeading: "Featured Projects", viewProject: "View Project", faq: "FAQ", aboutMe: "About Me", copyright: "Abdelrahman Doser | All Rights Reserved"
    },
    ar: {
      home: "الرئيسية", education: "رحلتي التعليمية", services: "خدماتي", contact: "للتواصل", mywebsites: "مشاريعي",
      hi: "أهلاً بك، أنا", name: "عبدالرحمن دوسر", iama: "أنا", social: "تابعني على",
      homeDesc: "مطور برمجيات شامل وخبير في دمج الذكاء الاصطناعي. أصنع تجارب رقمية ذكية وعصرية تجمع بين التصميم المتميز والأداء القوي.",
      hire: "اطلب خدماتي", contactme: "تواصل معي", educationHeading: "رحلة البحث والتعلم",
      skillsHeading: "مهاراتي التقنية", aiSpecialist: "خبير دمج تقنيات الذكاء الاصطناعي",
      edu1Title: "أساسيات الويب من (الزيرو)", edu1Desc: "دراسة HTML و CSS و JS بأفضل الممارسات من مدرسة الزيرو الشهيرة.",
      edu2Title: "البرمجة مع (كودزيلا)", edu2Desc: "تعلمت لغات Python و Java وقواعد المنطق البرمجي بأسلوب احترافي.",
      edu3Title: "التقنيات الحديثة (Dave Gray)", edu3Desc: "تطوير متقدم باستخدام React و Next.js لبناء تطبيقات ويب ديناميكية.",
      edu4Title: "تطوير مدعوم بالذكاء الاصطناعي", edu4Desc: "أمتلك خبرة كبيرة في استخدام ودمج الـ AI لتوفير حلول برمجية سريعة وذكية.",
      uiux: "تصميم UI/UX", frontend: "تطوير الواجهات الأمامية", backend: "تطوير النظم الخلفية", testing: "فحص الجودة",
      uiuxDesc: "تصميم واجهات عصرية، سهلة الاستخدام، وجذابة بصرياً.",
      frontendDesc: "بناء مواقع سريعة ومتجاوبة باستخدام React و Next.js.",
      backendDesc: "تطوير سيرفرات وقواعد بيانات قوية باستخدام Node.js.",
      testingDesc: "التأكد من خلو الموقع من الأخطاء وعمله بكفاءة على كل الأجهزة.",
      contactHeading: "دعنا نبدأ مشروعك الجديد", namePlaceholder: "اسمك الكريم", emailPlaceholder: "بريدك الإلكتروني", messagePlaceholder: "كيف يمكنني مساعدتك؟", sendMessage: "إرسال الرسالة",
      myWebsitesHeading: "معرض أعمالي", viewProject: "عرض المشروع", faq: "الأسئلة الشائعة", aboutMe: "من أنا", copyright: "عبدالرحمن دوسر | كافة الحقوق محفوظة"
    }
  },
  sections: { home: true, education: true, services: true, contact: true, mywebsites: true },
  images: { personal: '/personal.png', icon: '/icon.png' },
  seo: {
    title: {
      en: 'Abdelrahman Doser | Expert Full-Stack Developer & React Specialist',
      ar: 'عبدالرحمن السيد (Doser) | مبرمج مواقع محترف وخبير React'
    },
    description: {
      en: 'Searching for a professional programmer? Abdelrahman Doser is a full-stack developer specializing in React, Next.js, AI, ethical hacking, and cybersecurity. Explore the portfolio of a trusted software engineer.',
      ar: 'هل تبحث عن مبرمج مواقع محترف؟ عبدالرحمن السيد (دوسر) هو مبرمج احترافي في React و Next.js و AI، ويقدم خدمات تطوير الويب والأمن السيبراني والهكر الأخلاقي. اكتشف أعمال أفضل مبرمج عربي.'
    },
    keywords: 'عبدالرحمن السيد, عبدالرحمن دوزر, عبدالرحمن قنديل, عبدالرحمن السيد قنديل, Doser, مبرمج مواقع, مبرمج React, مبرمج Full-Stack, هكر أخلاقي, امن سيبراني, مبرمج عربي, Abdelrahman, Abdelrahman Elsayed, Abdelrahman Elsayed Kandil, Abdelrahman Elsayed Doser, Abdelrahman Elsayed Kandil Doser, ethical hacker, cybersecurity, web developer, React developer'
  },
  works: [ ]
}

// --- Components ---

const Toast = ({ message, type, onClose, isLight }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6'
  }

  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem',
      backgroundColor: colors[type] || colors.info,
      color: 'white', padding: '1rem 1.5rem', borderRadius: '1rem',
      boxShadow: isLight ? '0 10px 25px rgba(0,0,0,0.1)' : '0 10px 25px rgba(0,0,0,0.5)',
      zIndex: 9999, display: 'flex', alignItems: 'center', gap: '0.8rem',
      animation: 'slideUp 0.3s ease forwards'
    }}>
      <span>{type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      <span style={{ fontWeight: 600 }}>{message}</span>
    </div>
  )
}

const Card = ({ children, title, subtitle, panelColors, style }) => (
  <div style={{
    background: panelColors.card,
    borderRadius: '1.25rem',
    padding: '2rem',
    border: `1px solid ${panelColors.border}`,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    ...style
  }}>
    {title && <h3 style={{ margin: 0, color: panelColors.text, fontSize: '1.3rem', fontWeight: 800 }}>{title}</h3>}
    {subtitle && <p style={{ margin: '0.4rem 0 1.5rem', color: panelColors.textMuted, fontSize: '0.85rem' }}>{subtitle}</p>}
    {children}
  </div>
)

const InputField = ({ label, value, onChange, type = 'text', mb = '1.5rem', panelColors, placeholder }) => (
  <div style={{ marginBottom: mb }}>
    {label && <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: panelColors.text }}>{label}</label>}
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
        border: `1px solid ${panelColors.border}`, background: panelColors.inputBg,
        color: panelColors.text, outline: 'none', transition: 'border-color 0.2s',
        fontSize: '1rem', boxSizing: 'border-box'
      }}
      onFocus={(e) => e.target.style.borderColor = panelColors.main}
      onBlur={(e) => e.target.style.borderColor = panelColors.border}
    />
  </div>
)

// --- Main Application ---

export default function AdminOS() {
  // --- States ---
  const [isReady, setIsReady] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [panelTheme, setPanelTheme] = useState('dark')
  
  const [password, setPassword] = useState('')
  const [data, setData] = useState(DEFAULT_DATA)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [visitStats, setVisitStats] = useState({ total: 0, daily: {}, projectVisits: {} })
  const [activity, setActivity] = useState([])

  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeContentSection, setActiveContentSection] = useState('hero')

  // --- Computed ---
  const isLight = panelTheme === 'light'
  const panelColors = useMemo(() => ({
    bg: isLight ? '#f4f7fe' : '#050505',
    sidebar: isLight ? '#ffffff' : '#0f0f0f',
    card: isLight ? '#ffffff' : '#111111',
    text: isLight ? '#1a202c' : '#f8fafc',
    textMuted: isLight ? '#718096' : '#94a3b8',
    border: isLight ? '#e2e8f0' : '#1e293b',
    inputBg: isLight ? '#f8fafc' : '#0a0a0a',
    main: '#00f0ff',
    accent: '#bd00ff',
    success: '#10b981'
  }), [isLight])

  const showToast = (message, type = 'info') => setToast({ message, type })

  // --- Core Functions ---

  const pushHistory = useCallback((snapshot) => {
    const copy = JSON.parse(JSON.stringify(snapshot))
    setHistory(prev => {
      const head = prev.slice(0, historyIndex + 1)
      const next = [...head, copy].slice(-30)
      setHistoryIndex(next.length - 1)
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(next))
      localStorage.setItem(STORAGE_KEYS.HISTORY_IDX, String(next.length - 1))
      return next
    })
  }, [historyIndex])

  const undo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1
      const snap = history[prevIdx]
      setData(JSON.parse(JSON.stringify(snap)))
      setHistoryIndex(prevIdx)
    }
  }

  const handleLogin = async (pass) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/savePortfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass, data: null })
      })
      if (res.ok) {
        setIsLoggedIn(true)
        setPassword(pass)
        localStorage.setItem(STORAGE_KEYS.SESSION, pass)
        showToast('Nexus Protocol Established', 'success')
      } else {
        showToast('Invalid Security Key', 'error')
        localStorage.removeItem(STORAGE_KEYS.SESSION)
      }
    } catch (e) {
      showToast('Nexus Signal Failed', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const saveData = async () => {
    showToast('Syncing with Firebase...', 'info')
    try {
      const res = await fetch('/api/savePortfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, data })
      })
      if (res.ok) {
        showToast('Changes Persisted', 'success')
        pushHistory(data)
      } else {
        showToast('Sync Failed', 'error')
      }
    } catch (e) {
      showToast('Network Signal Lost', 'error')
    }
  }

  const changePassword = async (newPass) => {
    if (!confirm('Change administrative access key?')) return
    try {
      const res = await fetch('/api/savePortfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, newPassword: newPass })
      })
      if (res.ok) {
        setPassword(newPass)
        localStorage.setItem(STORAGE_KEYS.SESSION, newPass)
        showToast('Access Key Rotated', 'success')
      }
    } catch (e) { showToast('Security Error', 'error') }
  }

  // --- Effects ---

  useEffect(() => {
    const init = async () => {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
      if (savedTheme) setPanelTheme(savedTheme)

      const savedPass = localStorage.getItem(STORAGE_KEYS.SESSION)
      if (savedPass) {
        handleLogin(savedPass)
      } else {
        setIsLoading(false)
      }

      try {
        const res = await fetch('https://doser-portfolio-default-rtdb.firebaseio.com/portfolioData.json')
        const db = await res.json()
        if (db) {
          const merged = { 
            ...DEFAULT_DATA, 
            ...db,
            texts: {
              en: { ...DEFAULT_DATA.texts.en, ...(db.texts?.en || {}) },
              ar: { ...DEFAULT_DATA.texts.ar, ...(db.texts?.ar || {}) }
            },
            colors: {
              dark: { ...DEFAULT_DATA.colors.dark, ...(db.colors?.dark || {}) },
              light: { ...DEFAULT_DATA.colors.light, ...(db.colors?.light || {}) }
            },
            sections: { ...DEFAULT_DATA.sections, ...(db.sections || {}) },
            images: { ...DEFAULT_DATA.images, ...(db.images || {}) },
            works: db.works || DEFAULT_DATA.works
          }
          setData(merged)
          setHistory([JSON.parse(JSON.stringify(merged))])
          setHistoryIndex(0)
        }
      } catch (e) {}
      setIsReady(true)
    }
    init()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          fetch('/api/visit'),
          fetch('/api/activity')
        ])
        const stats = await statsRes.json()
        const logs = await activityRes.json()
        if (stats) setVisitStats(stats)
        if (Array.isArray(logs)) setActivity(logs.slice(0, 20))
      } catch (e) {}
    }
    fetchData()
    const int = setInterval(fetchData, 60000)
    return () => clearInterval(int)
  }, [])

  // --- Renderers ---

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: panelColors.bg, color: panelColors.text }}>
         <div style={{ textAlign: 'center' }}>
            <div className="spin-loader"></div>
            <p style={{ marginTop: '1.5rem', fontWeight: 800, letterSpacing: '2px', fontSize: '0.8rem' }}>DOSER ADMIN OS INITIALIZING...</p>
         </div>
         <style jsx>{`
           .spin-loader { width: 40px; height: 40px; border: 3px solid ${panelColors.border}; border-top-color: ${panelColors.main}; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
           @keyframes spin { to { transform: rotate(360deg); } }
         `}</style>
      </div>
    )
  }

  if (!isLoggedIn) {
     return (
       <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: panelColors.bg, padding: '2rem' }}>
         <Card panelColors={panelColors} style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🔐</div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900 }}>Secure Terminal</h1>
            <p style={{ color: panelColors.textMuted, marginTop: '0.5rem', marginBottom: '2rem' }}>Administrative authorization required.</p>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(password) }}>
              <InputField type="password" placeholder="Access Key" value={password} onChange={setPassword} panelColors={panelColors} />
              <button style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: 'none', background: panelColors.main, color: 'black', fontWeight: 800, cursor: 'pointer' }}>AUTHORIZE ACCESS</button>
            </form>
         </Card>
       </div>
     )
  }

  const Tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'content', label: 'Content', icon: '📝' },
    { id: 'seo', label: 'SEO', icon: '🔎' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'projects', label: 'Portfolio', icon: '🚀' },
    { id: 'visibility', label: 'Visibility', icon: '👁️' },
    { id: 'settings', label: 'Security', icon: '⚙️' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: panelColors.bg, color: panelColors.text, fontFamily: 'Inter, sans-serif' }}>
      <Head><title>Admin OS | Doser</title></Head>
      
      {/* Sidebar */}
      <div style={{
        width: isSidebarOpen ? '260px' : '80px',
        background: panelColors.sidebar,
        borderRight: `1px solid ${panelColors.border}`,
        display: 'flex', flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'sticky', top: 0, height: '100vh', zIndex: 100
      }}>
        <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center' }}>
          {isSidebarOpen && <span style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-1px' }}>DOSER<span style={{ color: panelColors.main }}>.</span></span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', color: panelColors.text, cursor: 'pointer', fontSize: '1.2rem' }}>
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <div style={{ flex: 1, padding: '0 0.8rem' }}>
          {Tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.9rem 1.2rem', borderRadius: '0.8rem', marginBottom: '0.4rem',
                border: 'none', background: activeTab === t.id ? `${panelColors.main}15` : 'none',
                color: activeTab === t.id ? panelColors.main : panelColors.textMuted,
                cursor: 'pointer', transition: 'all 0.2s',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
              {isSidebarOpen && <span style={{ fontWeight: 700 }}>{t.label}</span>}
            </button>
          ))}
        </div>

        <div style={{ padding: '1.5rem' }}>
          <button 
            onClick={() => { const n = isLight ? 'dark' : 'light'; setPanelTheme(n); localStorage.setItem(STORAGE_KEYS.THEME, n); }}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '0.8rem', border: `1px solid ${panelColors.border}`, background: 'none', color: panelColors.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: isSidebarOpen ? 'flex-start' : 'center' }}>
            <span>{isLight ? '🌙' : '☀️'}</span>
            {isSidebarOpen && <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{isLight ? 'Dark Mode' : 'Light Mode'}</span>}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '2.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Universal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-1px' }}>Welcome back, Doser</h1>
            <p style={{ margin: '0.4rem 0 0', color: panelColors.textMuted, fontWeight: 500 }}>System Control & Performance Matrix</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {historyIndex > 0 && <button onClick={undo} style={{ padding: '0.8rem 1.4rem', borderRadius: '0.8rem', border: `1px solid ${panelColors.border}`, background: panelColors.card, color: panelColors.text, cursor: 'pointer', fontWeight: 600 }}>Undo ↩️</button>}
            <button onClick={saveData} style={{ padding: '0.8rem 2rem', borderRadius: '0.8rem', border: 'none', background: panelColors.main, color: 'black', fontWeight: 800, cursor: 'pointer', boxShadow: `0 8px 20px -5px ${panelColors.main}66` }}>SAVE CHANGES</button>
          </div>
        </div>

        {/* Tab View */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Top Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
               {[
                 { l: 'TOTAL IMPRESSIONS', v: visitStats.total, i: '👥', c: panelColors.main },
                 { l: 'PROJECTS DEPLOYED', v: data.works?.length, i: '🚀', c: panelColors.accent },
                 { l: 'SYSTEM UPTIME', v: 'OPERATIONAL', i: '⚡', c: '#10b981', pulse: true },
                 { l: 'SECURITY STATUS', v: 'ENCRYPTED', i: '🛡️', c: '#f59e0b' }
               ].map((m, i) => (
                 <div key={i} style={{ background: panelColors.card, padding: '1.5rem', borderRadius: '1.4rem', border: `1px solid ${panelColors.border}`, display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                   <div style={{ width: '56px', height: '56px', borderRadius: '1.1rem', background: `${m.c}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>{m.i}</div>
                   <div>
                     <div style={{ fontSize: '0.75rem', color: panelColors.textMuted, fontWeight: 800, letterSpacing: '0.5px' }}>{m.l}</div>
                     <div style={{ fontSize: '1.4rem', fontWeight: 900, color: m.pulse ? m.c : panelColors.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {m.pulse && <span style={{ width: '8px', height: '8px', background: m.c, borderRadius: '50%', animation: 'pulse-glow 1.5s infinite' }}></span>}
                        {m.v}
                     </div>
                   </div>
                 </div>
               ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '2rem' }}>
              <div style={{ display: 'grid', gap: '2rem' }}>
                <Card panelColors={panelColors} title="Engagement Overview" subtitle="Real-time status of your portfolio modules.">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    {Object.keys(data.sections).map(s => (
                      <div key={s} style={{ padding: '1.2rem', background: panelColors.bg, borderRadius: '1.1rem', border: `1px solid ${panelColors.border}`, textAlign: 'center' }}>
                         <div style={{ fontSize: '0.7rem', color: panelColors.textMuted, fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>{s}</div>
                         <div style={{ fontSize: '1rem', fontWeight: 900, color: data.sections[s] ? panelColors.main : panelColors.textMuted }}>
                           {data.sections[s] ? 'ACTIVE' : 'OFFLINE'}
                         </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card panelColors={panelColors} title="Command Center" subtitle="Direct control of core administrative tasks.">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                    {[
                      { l: 'New Project', t: 'projects', c: panelColors.main, i: '➕' },
                      { l: 'Color Forge', t: 'design', c: panelColors.accent, i: '🎨' },
                      { l: 'Snapshot', t: 'settings', c: panelColors.textMuted, i: '💾' }
                    ].map(b => (
                      <button key={b.l} onClick={() => setActiveTab(b.t)} style={{ padding: '1.2rem', borderRadius: '1.1rem', border: `1px solid ${b.c}30`, background: `${b.c}08`, color: b.c === panelColors.textMuted ? panelColors.text : b.c, fontWeight: 800, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                        {b.i} {b.l}
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              <div style={{ display: 'grid', gap: '2rem' }}>
                <Card panelColors={panelColors} title="Popularity Matrix" subtitle="User interaction frequency.">
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                    {data.works?.sort((a,b) => (visitStats.projectVisits?.[b.id] || 0) - (visitStats.projectVisits?.[a.id] || 0)).slice(0,5).map((w, i) => {
                      const visits = visitStats.projectVisits?.[w.id] || 0;
                      const max = Math.max(...Object.values(visitStats.projectVisits || {x:1}));
                      return (
                      <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: i === 0 ? '#ffd700' : panelColors.textMuted, width: '25px' }}>{i+1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{w.title || 'Unknown Project'}</div>
                          <div style={{ height: '5px', background: panelColors.border, borderRadius: '4px', marginTop: '6px', overflow: 'hidden' }}>
                            <div style={{ width: `${(visits / max) * 100}%`, height: '100%', background: `linear-gradient(to right, ${panelColors.main}, ${panelColors.accent})` }}></div>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 900, color: panelColors.main }}>{visits}</div>
                      </div>
                    )})}
                   </div>
                </Card>

                <Card panelColors={panelColors} title="Log Stream" subtitle="Administrative event tracking.">
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    {activity.slice(0, 6).map((a, i) => (
                      <div key={i} style={{ fontSize: '0.75rem', display: 'flex', gap: '0.7rem', paddingBottom: '0.6rem', borderBottom: i < 5 ? `1px solid ${panelColors.border}50` : 'none' }}>
                        <span style={{ color: panelColors.main, fontWeight: 800 }}>{new Date(a.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                        <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{a.action.split('_').join(' ')}</span>
                      </div>
                    ))}
                   </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs remain clean and functional */}
        {activeTab === 'content' && (
          <div style={{ display: 'grid', gap: '2rem' }}>
             {/* Content Section Sub-Nav */}
             <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
                {[
                  { id: 'hero', label: 'Hero Section', icon: '👤' },
                  { id: 'nav', label: 'Navigation', icon: '🔗' },
                  { id: 'journey', label: 'Journey', icon: '📚' },
                  { id: 'services', label: 'Services', icon: '🛠️' },
                  { id: 'skills', label: 'Skills/AI', icon: '🧠' },
                  { id: 'projects', label: 'Projects UI', icon: '🎨' },
                  { id: 'contact', label: 'Contact', icon: '📧' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveContentSection(s.id)}
                    style={{
                      padding: '0.8rem 1.5rem', borderRadius: '2rem', border: `1px solid ${activeContentSection === s.id ? panelColors.main : panelColors.border}`,
                      background: activeContentSection === s.id ? `${panelColors.main}15` : panelColors.card,
                      color: activeContentSection === s.id ? panelColors.main : panelColors.textMuted,
                      fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}
                  >
                    <span>{s.icon}</span> {s.label}
                  </button>
                ))}
             </div>

             <Card panelColors={panelColors} title={`${activeContentSection.toUpperCase()} MODULE`} subtitle="Sync English and Arabic content for this specific section.">
                <div style={{ display: 'grid', gap: '2rem' }}>
                   {(() => {
                     const sectionKeys = {
                       hero: ['hi', 'name', 'iama', 'social', 'homeDesc', 'hire', 'contactme'],
                       nav: ['home', 'education', 'services', 'contact', 'mywebsites', 'faq', 'aboutMe', 'copyright'],
                       journey: ['educationHeading', 'edu1Title', 'edu1Desc', 'edu2Title', 'edu2Desc', 'edu3Title', 'edu3Desc', 'edu4Title', 'edu4Desc'],
                       services: ['uiux', 'uiuxDesc', 'frontend', 'frontendDesc', 'backend', 'backendDesc', 'testing', 'testingDesc'],
                       skills: ['skillsHeading', 'aiSpecialist'],
                       projects: ['myWebsitesHeading', 'viewProject'],
                       contact: ['contactHeading', 'namePlaceholder', 'emailPlaceholder', 'messagePlaceholder', 'sendMessage']
                     }[activeContentSection] || [];

                     return sectionKeys.map(k => (
                       <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '1.5rem', background: panelColors.bg, borderRadius: '1.2rem', border: `1px solid ${panelColors.border}` }}>
                          <div style={{ position: 'absolute', top: '-10px', left: '20px', background: panelColors.main, color: 'black', padding: '2px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900 }}>{k.toUpperCase()}</div>
                          <InputField label="English (UK/US)" value={data.texts.en[k] || ''} onChange={v => setData(p => ({ ...p, texts: { ...p.texts, en: { ...p.texts.en, [k]: v } } }))} panelColors={panelColors} mb="0" />
                          <div style={{ direction: 'rtl' }}>
                            <InputField label="Arabic (العربية)" value={data.texts.ar[k] || ''} onChange={v => setData(p => ({ ...p, texts: { ...p.texts, ar: { ...p.texts.ar, [k]: v } } }))} panelColors={panelColors} mb="0" />
                          </div>
                       </div>
                     ))
                   })()}
                </div>
             </Card>
          </div>
        )}

        {activeTab === 'seo' && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            <Card panelColors={panelColors} title="SEO & Branding" subtitle="Update page metadata, keywords, and brand visuals.">
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <InputField label="Title (English)" value={data.seo?.title?.en || ''} onChange={v => setData(p => ({ ...p, seo: { ...p.seo, title: { ...p.seo?.title, en: v } } }))} panelColors={panelColors} />
                <InputField label="Title (Arabic)" value={data.seo?.title?.ar || ''} onChange={v => setData(p => ({ ...p, seo: { ...p.seo, title: { ...p.seo?.title, ar: v } } }))} panelColors={panelColors} />
                <InputField label="Description (English)" value={data.seo?.description?.en || ''} onChange={v => setData(p => ({ ...p, seo: { ...p.seo, description: { ...p.seo?.description, en: v } } }))} panelColors={panelColors} />
                <InputField label="Description (Arabic)" value={data.seo?.description?.ar || ''} onChange={v => setData(p => ({ ...p, seo: { ...p.seo, description: { ...p.seo?.description, ar: v } } }))} panelColors={panelColors} />
                <InputField label="Keywords (comma-separated)" value={data.seo?.keywords || ''} onChange={v => setData(p => ({ ...p, seo: { ...p.seo, keywords: v } }))} panelColors={panelColors} />
                <InputField label="Favicon / Logo URL" value={data.images?.icon || ''} onChange={v => setData(p => ({ ...p, images: { ...p.images, icon: v } }))} panelColors={panelColors} />
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <label style={{ fontWeight: 700, color: panelColors.text }}>Upload Favicon / Logo</label>
                  <input type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = (event) => setData(p => ({ ...p, images: { ...p.images, icon: event.target.result } }))
                    reader.readAsDataURL(file)
                  }} style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: `1px solid ${panelColors.border}`, background: panelColors.inputBg, color: panelColors.text }} />
                  {data.images?.icon && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <img src={data.images.icon} alt="Logo preview" style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '0.75rem', border: `1px solid ${panelColors.border}` }} />
                      <span style={{ color: panelColors.textMuted, fontSize: '0.9rem' }}>Preview from uploaded or entered URL.</span>
                    </div>
                  )}
                </div>
                <InputField label="Hero Image URL" value={data.images?.personal || ''} onChange={v => setData(p => ({ ...p, images: { ...p.images, personal: v } }))} panelColors={panelColors} />
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <label style={{ fontWeight: 700, color: panelColors.text }}>Upload Hero Image</label>
                  <input type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = (event) => setData(p => ({ ...p, images: { ...p.images, personal: event.target.result } }))
                    reader.readAsDataURL(file)
                  }} style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: `1px solid ${panelColors.border}`, background: panelColors.inputBg, color: panelColors.text }} />
                  {data.images?.personal && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <img src={data.images.personal} alt="Hero preview" style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '0.75rem', border: `1px solid ${panelColors.border}` }} />
                      <span style={{ color: panelColors.textMuted, fontSize: '0.9rem' }}>Preview from uploaded or entered URL.</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'design' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
             {['dark', 'light'].map(m => (
               <Card key={m} panelColors={panelColors} title={`${m.toUpperCase()} MODE`} subtitle="Palette configuration.">
                  {Object.keys(data.colors[m]).map(k => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.2rem', background: panelColors.bg, padding: '0.8rem 1.2rem', borderRadius: '0.9rem', border: `1px solid ${panelColors.border}` }}>
                       <input type="color" value={data.colors[m][k]} onChange={e => setData(p => ({ ...p, colors: { ...p.colors, [m]: { ...p.colors[m], [k]: e.target.value } } }))} style={{ width: '32px', height: '32px', border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                       <span style={{ flex: 1, fontWeight: 700, fontSize: '0.9rem', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                       <span style={{ fontSize: '0.85rem', opacity: 0.6, fontWeight: 700 }}>{data.colors[m][k].toUpperCase()}</span>
                    </div>
                  ))}
               </Card>
             ))}
          </div>
        )}

        {activeTab === 'projects' && (
          <div style={{ display: 'grid', gap: '2rem' }}>
             <button onClick={() => setData(p => ({...p, works: [...p.works, {id: Date.now(), title:'New Project', desc:'', url:'', images:[]}]}))} style={{ padding: '1.4rem', borderRadius: '1.2rem', border: 'none', background: panelColors.main, color: 'black', fontWeight: 900, cursor: 'pointer', fontSize: '1rem' }}>+ DEPLOY NEW PROJECT</button>
             {data.works?.map((w, idx) => (
               <Card key={w.id} panelColors={panelColors} title={`Project Prototype #${idx+1}`} subtitle="Interactive project module.">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <InputField label="Title" value={w.title} onChange={v => setData(p => ({ ...p, works: p.works.map(x => x.id === w.id ? {...x, title: v} : x) }))} panelColors={panelColors} />
                    <InputField label="Deployment URL" value={w.url} onChange={v => setData(p => ({ ...p, works: p.works.map(x => x.id === w.id ? {...x, url: v} : x) }))} panelColors={panelColors} />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 800, fontSize: '0.9rem' }}>ASSET GALLERY</label>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {w.images?.map((img, i) => (
                        <div key={i} style={{ position: 'relative', width: '110px', height: '110px', borderRadius: '1rem', overflow: 'hidden', border: `1px solid ${panelColors.border}` }}>
                           <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                           <button onClick={() => setData(p => ({ ...p, works: p.works.map(x => x.id === w.id ? {...x, images: x.images.filter((_, j) => j !== i)} : x) }))} style={{ position: 'absolute', top: 5, right: 5, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px' }}>✕</button>
                        </div>
                      ))}
                      <label style={{ width: '110px', height: '110px', borderRadius: '1rem', border: `2px dashed ${panelColors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.5rem', opacity: 0.6 }}>
                        + <input type="file" style={{ display: 'none' }} accept="image/*" onChange={e => {
                          const f = e.target.files[0]; if(!f) return;
                          const r = new FileReader(); r.onload = () => { setData(p => ({ ...p, works: p.works.map(x => x.id === w.id ? {...x, images: [...x.images, r.result]} : x) })) }; r.readAsDataURL(f);
                        }} />
                      </label>
                    </div>
                  </div>
                  <button onClick={() => setData(p => ({ ...p, works: p.works.filter(x => x.id !== w.id) }))} style={{ padding: '0.8rem 1.5rem', background: '#e11d4820', color: '#e11d48', border: '1px solid #e11d4840', borderRadius: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>SCRAP PROJECT</button>
               </Card>
             ))}
          </div>
        )}

        {activeTab === 'visibility' && (
           <Card panelColors={panelColors} title="Deployment Matrix" subtitle="Toggle live visibility of system modules.">
              {Object.keys(data.sections).map(s => (
                <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 0', borderBottom: `1px solid ${panelColors.border}50` }}>
                   <div style={{ textTransform: 'uppercase', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.5px' }}>{s} Module</div>
                   <button onClick={() => setData(p => ({ ...p, sections: { ...p.sections, [s]: !p.sections[s] } }))} style={{ padding: '0.6rem 1.8rem', borderRadius: '2rem', border: 'none', background: data.sections[s] ? '#10b981' : panelColors.textMuted, color: 'black', fontWeight: 900, cursor: 'pointer', fontSize: '0.8rem' }}>
                      {data.sections[s] ? 'ONLINE' : 'OFFLINE'}
                   </button>
                </div>
              ))}
           </Card>
        )}

        {activeTab === 'settings' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
             <Card panelColors={panelColors} title="Security Protocol" subtitle="Rotate your administrative access key.">
                <InputField type="password" id="new-key-input" placeholder="New Access Token" panelColors={panelColors} />
                <button onClick={() => changePassword(document.getElementById('new-key-input').value)} style={{ padding: '1.2rem', width:'100%', borderRadius: '1.1rem', border: 'none', background: `linear-gradient(to right, ${panelColors.main}, ${panelColors.accent})`, color: 'black', fontWeight: 900, cursor: 'pointer' }}>OVERWRITE SECURITY KEY</button>
             </Card>
             <Card panelColors={panelColors} title="Data Lifecycle" subtitle="Export or import the full system state.">
                <button onClick={() => {
                  const b = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
                  const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = `doser-backup-${Date.now()}.json`; a.click();
                }} style={{ padding: '1.1rem', width: '100%', borderRadius: '1.1rem', border: `1px solid ${panelColors.main}`, background: 'none', color: panelColors.main, fontWeight: 900, cursor: 'pointer', marginBottom: '1.2rem' }}>DOWNLOAD PROTOCOL DATA</button>
                <div style={{ position: 'relative' }}>
                   <button style={{ padding: '1.1rem', width: '100%', borderRadius: '1.1rem', border: `1px solid ${panelColors.text}`, background: 'none', color: panelColors.text, fontWeight: 900 }}>REINITIALIZE FROM BACKUP</button>
                   <input type="file" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} onChange={e => {
                     const f = e.target.files[0]; if(!f) return;
                     const r = new FileReader(); r.onload = ev => { setData(JSON.parse(ev.target.result)); showToast('System Reinitialized', 'success') }; r.readAsText(f);
                   }} />
                </div>
             </Card>
          </div>
        )}

        <div style={{ marginTop: '5rem', textAlign: 'center', opacity: 0.2, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px' }}>
          DOSER ADMIN OS v2.0 // CORE SYSTEM SECURED
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} isLight={isLight} />}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { margin: 0; padding: 0; background: ${panelColors.bg}; }
        * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse-glow { 0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { transform: scale(1.1); opacity: 0.8; box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; border-radius: 4px; }
      `}</style>
    </div>
  )
}
