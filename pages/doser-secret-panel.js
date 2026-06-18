import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [saveStatus, setSaveStatus] = useState('') // '' | 'saving' | 'success' | 'error'
  const [editingTheme, setEditingTheme] = useState('dark')
  const [searchTerm, setSearchTerm] = useState('')
  
  const [data, setData] = useState({
    colors: {
      dark: { mainColor: '#00f0ff', bgColor: '#050505', secBgColor: '#111111', textColor: '#f0f0f0' },
      light: { mainColor: '#0070f3', bgColor: '#f0f4f8', secBgColor: '#ffffff', textColor: '#1a202c' }
    },
    texts: {
      en: {
        home: "Home", education: "Learning Journey", services: "Services", contact: "Contact", mywebsites: "Projects",
        hi: "Hi, I'm", name: "Abdelrahman Doser", iama: "I'm a", social: "Find me on",
        homeDesc: "Full-Stack Developer & AI Specialist. I build modern websites and integrated AI solutions.",
        hire: "Hire Me", contactme: "Contact Me", educationHeading: "My Learning Path",
        highSchool: "Web Fundamentals", highSchoolDesc: "Learned HTML, CSS, and JavaScript with best practices.",
        university: "Modern Tech Stack", universityDesc: "Advanced learning in React, Next.js, and Node.js.",
        internship: "Achievements", internshipDesc: "Awarded for technical innovation and excellence.",
        firstJob: "AI Development", firstJobDesc: "Experienced in using and integrating AI solutions.",
        servicesHeading: "Technical Skills", uiux: "UI/UX Design", frontend: "Frontend", backend: "Backend", testing: "QA Testing",
        uiuxDesc: "Clean, modern, and user-friendly interfaces.",
        frontendDesc: "Responsive web apps using React and Next.js.",
        backendDesc: "Stable servers and databases with Node.js.",
        testingDesc: "Works perfectly on all devices.",
        contactHeading: "Let's Work Together", namePlaceholder: "Your Name", emailPlaceholder: "Your Email", messagePlaceholder: "Message", sendMessage: "Send",
        myWebsitesHeading: "Featured Projects", viewProject: "View", faq: "FAQ", aboutMe: "About", copyright: "All Rights Reserved"
      },
      ar: {
        home: "الرئيسية", education: "رحلتي التعليمية", services: "خدماتي", contact: "للتواصل", mywebsites: "مشاريعي",
        hi: "أهلاً بك، أنا", name: "عبدالرحمن دوسر", iama: "أنا", social: "تابعني على",
        homeDesc: "مطور برمجيات شامل وخبير في دمج الذكاء الاصطناعي.",
        hire: "اطلب خدماتي", contactme: "تواصل معي", educationHeading: "رحلة البحث والتعلم",
        highSchool: "أساسيات الويب", highSchoolDesc: "دراسة HTML و CSS و JS بأفضل الممارسات.",
        university: "التقنيات الحديثة", universityDesc: "تطوير متقدم باستخدام React و Next.js.",
        internship: "الإنجازات", internshipDesc: "جوائز للابتكار التقني والتميز.",
        firstJob: "تطوير الذكاء الاصطناعي", firstJobDesc: "خبرة في استخدام ودمج حلول الذكاء الاصطناعي.",
        servicesHeading: "مهاراتي التقنية", uiux: "تصميم الواجهات", frontend: "الواجهات الأمامية", backend: "النظم الخلفية", testing: "فحص الجودة",
        uiuxDesc: "واجهات عصرية وسهلة الاستخدام.",
        frontendDesc: "تطبيقات ويب ديناميكية وسريعة.",
        backendDesc: "سيرفرات وقواعد بيانات قوية.",
        testingDesc: "يعمل بكفاءة على جميع الأجهزة.",
        contactHeading: "دعنا نصنع شيئاً عظيماً", namePlaceholder: "اسمك", emailPlaceholder: "بريدك", messagePlaceholder: "رسالتك", sendMessage: "إرسال",
        myWebsitesHeading: "معرض أعمالي", viewProject: "عرض", faq: "أسئلة", aboutMe: "عني", copyright: "جميع الحقوق محفوظة"
      }
    },
    sections: { home: true, education: true, services: true, contact: true, mywebsites: true, skills: true },
    images: { personal: '/personal.png', icon: '/icon.png' },
    works: [ { id: Date.now(), title: 'Doser Hub', desc: 'A hub for easy browsing and resources.', url: 'https://doser-hub.vercel.app/', images: [] } ]
  })

  // Load data from Firebase
  useEffect(() => {
    fetch('https://doser-portfolio-default-rtdb.firebaseio.com/portfolioData.json')
      .then((res) => res.json())
      .then((dbData) => {
        if (dbData) {
          let safeWorks = []
          if (dbData.works) {
            safeWorks = Array.isArray(dbData.works) 
              ? dbData.works.filter(Boolean)
              : Object.values(dbData.works).filter(Boolean)
          }
          setData(prev => ({
            ...prev,
            ...dbData,
            colors: dbData.colors || prev.colors,
            texts: dbData.texts || prev.texts,
            sections: dbData.sections || prev.sections,
            images: dbData.images || prev.images,
            works: safeWorks
          }))
        }
      })
      .catch((err) => console.error("Error loading DB:", err))
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/savePortfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, data: null })
      })
      if (res.ok) {
        setIsLoggedIn(true)
        setSaveStatus('success')
        setTimeout(() => setSaveStatus(''), 2000)
      } else {
        setSaveStatus('error')
        setTimeout(() => setSaveStatus(''), 2000)
      }
    } catch(err) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(''), 2000)
    }
  }

  const saveData = async () => {
    setSaveStatus('saving')
    try {
      const response = await fetch('/api/savePortfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, data })
      })
      if (response.ok) {
        localStorage.setItem('portfolioDataV5', JSON.stringify(data))
        setSaveStatus('success')
        setTimeout(() => setSaveStatus(''), 3000)
      } else {
        setSaveStatus('error')
        setTimeout(() => setSaveStatus(''), 3000)
      }
    } catch (e) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  const exportData = () => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importData = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result)
        setData(imported)
        setSaveStatus('success')
        setTimeout(() => setSaveStatus(''), 2000)
      } catch (err) {
        setSaveStatus('error')
      }
    }
    reader.readAsText(file)
  }

  const updateColor = (themeMode, key, value) => {
    setData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [themeMode]: { ...prev.colors[themeMode], [key]: value }
      }
    }))
  }

  const updateText = (lang, key, value) => {
    setData(prev => ({ ...prev, texts: { ...prev.texts, [lang]: { ...prev.texts[lang], [key]: value } } }))
  }

  const toggleSection = (section) => {
    setData(prev => ({ ...prev, sections: { ...prev.sections, [section]: !prev.sections[section] } }))
  }

  const updateImage = (key, value) => {
    setData(prev => ({ ...prev, images: { ...prev.images, [key]: value } }))
  }

  const handleImageUpload = (e, key) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(''), 2000)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      updateImage(key, reader.result)
    }
    reader.readAsDataURL(file)
  }

  const addWork = () => {
    setData(prev => ({ ...prev, works: [...(prev.works || []), { id: Date.now(), title: '', desc: '', url: '', images: [] }] }))
  }

  const updateWork = (id, field, value) => {
    setData(prev => ({
      ...prev,
      works: (prev.works || []).map(w => w.id === id ? { ...w, [field]: value } : w)
    }))
  }

  const addWorkImage = (id, imageUrl) => {
    setData(prev => ({
      ...prev,
      works: (prev.works || []).map(w => w.id === id ? { ...w, images: [...(w.images || []), imageUrl] } : w)
    }))
  }

  const removeWorkImage = (id, index) => {
    setData(prev => ({
      ...prev,
      works: (prev.works || []).map(w => w.id === id ? { ...w, images: (w.images || []).filter((_, i) => i !== index) } : w)
    }))
  }

  const handleWorkImageUpload = (e, id) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(''), 2000)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      addWorkImage(id, reader.result)
    }
    reader.readAsDataURL(file)
  }

  const deleteWork = (id) => {
    if (!confirm('Delete this project? This action cannot be undone.')) return
    setData(prev => ({ ...prev, works: (prev.works || []).filter(w => w.id !== id) }))
  }

  if (!isLoggedIn) {
    return (
      <>
        <Head><title>Secret Admin Portal</title></Head>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-color)',
          backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(189, 0, 255, 0.08), transparent 25%), radial-gradient(circle at 85% 30%, rgba(0, 240, 255, 0.08), transparent 25%)',
          padding: '2rem'
        }}>
          <div style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '2rem',
            padding: '4rem',
            maxWidth: '450px',
            width: '100%',
            boxShadow: 'var(--glass-shadow)'
          }}>
            <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--main-color)', fontSize: '2.8rem' }}>
              🔐 Admin Portal
            </h1>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.3rem' }}>
              Control your portfolio with full power
            </p>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.8rem', color: 'var(--text-color)', fontSize: '1.4rem', fontWeight: '600' }}>
                  Access Key
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '1.2rem',
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '1rem',
                    color: 'var(--text-color)',
                    fontSize: '1.4rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <button 
                type="submit" 
                style={{
                  width: '100%',
                  padding: '1.2rem',
                  background: 'var(--main-color)',
                  color: 'var(--bg-color)',
                  border: 'none',
                  borderRadius: '1rem',
                  fontSize: '1.6rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Unlock Portal
              </button>
              {saveStatus === 'error' && (
                <p style={{ color: '#ff6b6b', marginTop: '1rem', textAlign: 'center', fontSize: '1.2rem' }}>❌ Authentication failed</p>
              )}
            </form>
          </div>
        </div>
      </>
    )
  }

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📈' },
    { id: 'colors', label: '🎨 Colors', icon: '🌈' },
    { id: 'textsEn', label: '🇬🇧 English', icon: '📝' },
    { id: 'textsAr', label: '🇸🇦 Arabic', icon: '📝' },
    { id: 'sections', label: '👁️ Visibility', icon: '👁️' },
    { id: 'media', label: '🖼️ Media', icon: '📸' },
    { id: 'works', label: '🚀 Projects', icon: '💼' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      <Head><title>Admin Dashboard - Portfolio Control</title></Head>

      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: 'linear-gradient(135deg, rgba(5, 5, 5, 0.9) 0%, rgba(17, 17, 17, 0.8) 100%)',
        borderRight: '1px solid var(--glass-border)',
        padding: '2rem 1.5rem',
        overflowY: 'auto',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: 50
      }}>
        <h2 style={{ color: 'var(--main-color)', marginBottom: '2.5rem', fontSize: '1.6rem', fontWeight: '700', textAlign: 'center' }}>
          ⚙️ Control
        </h2>
        
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              width: '100%',
              padding: '1rem',
              marginBottom: '0.6rem',
              background: activeTab === tab.id ? 'var(--main-color)' : 'transparent',
              color: activeTab === tab.id ? 'var(--bg-color)' : 'var(--text-muted)',
              border: '1px solid ' + (activeTab === tab.id ? 'var(--main-color)' : 'var(--glass-border)'),
              borderRadius: '0.8rem',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.borderColor = 'var(--main-color)'
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.borderColor = 'var(--glass-border)'
              }
            }}
          >
            {tab.icon}
          </button>
        ))}

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <button
            onClick={saveData}
            disabled={saveStatus === 'saving'}
            style={{
              width: '100%',
              padding: '1rem',
              background: saveStatus === 'success' ? '#2ecc71' : saveStatus === 'error' ? '#e74c3c' : 'var(--main-color)',
              color: 'white',
              border: 'none',
              borderRadius: '0.8rem',
              fontSize: '1.2rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '0.8rem'
            }}
          >
            {saveStatus === 'saving' ? '⏳' : saveStatus === 'success' ? '✅' : saveStatus === 'error' ? '❌' : '💾'}
          </button>

          <button
            onClick={exportData}
            style={{
              width: '100%',
              padding: '0.8rem',
              background: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--glass-border)',
              borderRadius: '0.8rem',
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            📥
          </button>

          <label style={{
            display: 'block',
            width: '100%',
            padding: '0.8rem',
            background: 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid var(--glass-border)',
            borderRadius: '0.8rem',
            fontSize: '1rem',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            📤
            <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '280px', flex: 1, padding: '3rem', overflowY: 'auto', maxHeight: '100vh' }}>
        {/* Status Bar */}
        {saveStatus && (
          <div style={{
            padding: '1.2rem',
            borderRadius: '0.8rem',
            marginBottom: '2rem',
            background: saveStatus === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
            border: '1px solid ' + (saveStatus === 'success' ? '#2ecc71' : '#e74c3c'),
            color: saveStatus === 'success' ? '#2ecc71' : '#e74c3c',
            fontSize: '1.2rem'
          }}>
            {saveStatus === 'saving' && '⏳ Saving your changes...'}
            {saveStatus === 'success' && '✅ All changes saved successfully!'}
            {saveStatus === 'error' && '❌ Error occurred. Please try again.'}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ background: 'var(--glass-bg)', borderRadius: '1.5rem', padding: '2.5rem', border: '1px solid var(--glass-border)' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--text-color)', fontSize: '2.2rem' }}>📊 Dashboard Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              <div style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--main-color)' }}>
                <h3 style={{ color: 'var(--main-color)', marginBottom: '0.5rem', fontSize: '1.3rem' }}>📚 Total Projects</h3>
                <p style={{ fontSize: '2.4rem', fontWeight: '700', color: 'var(--text-color)' }}>{data.works?.length || 0}</p>
              </div>
              <div style={{ background: 'rgba(189, 0, 255, 0.1)', padding: '2rem', borderRadius: '1rem', border: '1px solid #bd00ff' }}>
                <h3 style={{ color: '#bd00ff', marginBottom: '0.5rem', fontSize: '1.3rem' }}>🎨 Themes</h3>
                <p style={{ fontSize: '2.4rem', fontWeight: '700', color: 'var(--text-color)' }}>2 (Dark/Light)</p>
              </div>
              <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '2rem', borderRadius: '1rem', border: '1px solid #34d399' }}>
                <h3 style={{ color: '#34d399', marginBottom: '0.5rem', fontSize: '1.3rem' }}>🗣️ Languages</h3>
                <p style={{ fontSize: '2.4rem', fontWeight: '700', color: 'var(--text-color)' }}>2 (EN/AR)</p>
              </div>
            </div>
            <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(0, 0, 0, 0.1)', borderRadius: '1rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-color)', fontSize: '1.4rem' }}>✨ Quick Actions</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '1.2rem' }}>Use the sidebar tabs to:</p>
              <ul style={{ color: 'var(--text-muted)', paddingLeft: '2rem', fontSize: '1.2rem', lineHeight: '1.8' }}>
                <li>🎨 Customize colors and themes</li>
                <li>📝 Update all text content in English & Arabic</li>
                <li>👁️ Toggle sections visibility</li>
                <li>🖼️ Manage personal images</li>
                <li>🚀 Add and manage projects</li>
              </ul>
            </div>
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div style={{ background: 'var(--glass-bg)', borderRadius: '1.5rem', padding: '2.5rem', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
              <h2 style={{ margin: 0, color: 'var(--text-color)', fontSize: '2rem' }}>🎨 Colors & Theme</h2>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                {['dark', 'light'].map(theme => (
                  <button
                    key={theme}
                    onClick={() => setEditingTheme(theme)}
                    style={{
                      padding: '0.8rem 1.6rem',
                      background: editingTheme === theme ? 'var(--main-color)' : 'transparent',
                      color: editingTheme === theme ? 'var(--bg-color)' : 'var(--text-color)',
                      border: '1px solid ' + (editingTheme === theme ? 'var(--main-color)' : 'var(--glass-border)'),
                      borderRadius: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '1.2rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              {[
                { key: 'mainColor', label: 'Main Accent', desc: 'Primary highlight color' },
                { key: 'bgColor', label: 'Background', desc: 'Main background color' },
                { key: 'secBgColor', label: 'Secondary BG', desc: 'Cards and sections' },
                { key: 'textColor', label: 'Text Color', desc: 'Body text color' }
              ].map(color => (
                <div key={color.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <label style={{ color: 'var(--text-color)', fontWeight: '600', fontSize: '1.3rem' }}>{color.label}</label>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>{color.desc}</p>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={data.colors[editingTheme][color.key]}
                      onChange={(e) => updateColor(editingTheme, color.key, e.target.value)}
                      style={{ width: '60px', height: '60px', borderRadius: '0.8rem', border: '1px solid var(--glass-border)', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={data.colors[editingTheme][color.key]}
                      onChange={(e) => updateColor(editingTheme, color.key, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.8rem',
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '0.6rem',
                        color: 'var(--text-color)',
                        fontSize: '1.2rem',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* English Texts Tab */}
        {activeTab === 'textsEn' && (
          <div style={{ background: 'var(--glass-bg)', borderRadius: '1.5rem', padding: '2.5rem', border: '1px solid var(--glass-border)' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--text-color)', fontSize: '2rem' }}>🇬🇧 English Content</h2>
            
            {['Hero', 'Education', 'Services', 'Contact', 'Other'].map(section => (
              <div key={section} style={{ marginBottom: '3rem' }}>
                <h3 style={{ color: 'var(--main-color)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>📌 {section} Section</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {Object.keys(data.texts.en).filter(key => {
                    if (section === 'Hero') return ['hi', 'name', 'iama', 'homeDesc', 'hire', 'contactme'].includes(key)
                    if (section === 'Education') return ['educationHeading', 'highSchool', 'highSchoolDesc', 'university', 'universityDesc', 'internship', 'internshipDesc', 'firstJob', 'firstJobDesc'].includes(key)
                    if (section === 'Services') return ['servicesHeading', 'uiux', 'uiuxDesc', 'frontend', 'frontendDesc', 'backend', 'backendDesc', 'testing', 'testingDesc'].includes(key)
                    if (section === 'Contact') return ['contactHeading', 'namePlaceholder', 'emailPlaceholder', 'messagePlaceholder', 'sendMessage'].includes(key)
                    return !['hi', 'name', 'iama', 'homeDesc', 'hire', 'contactme', 'educationHeading', 'highSchool', 'highSchoolDesc', 'university', 'universityDesc', 'internship', 'internshipDesc', 'firstJob', 'firstJobDesc', 'servicesHeading', 'uiux', 'uiuxDesc', 'frontend', 'frontendDesc', 'backend', 'backendDesc', 'testing', 'testingDesc', 'contactHeading', 'namePlaceholder', 'emailPlaceholder', 'messagePlaceholder', 'sendMessage'].includes(key)
                  }).map(key => (
                    <div key={key}>
                      <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-color)', fontSize: '1.2rem', fontWeight: '600' }}>
                        {key}
                      </label>
                      {['homeDesc', 'highSchoolDesc', 'universityDesc', 'internshipDesc', 'firstJobDesc', 'uiuxDesc', 'frontendDesc', 'backendDesc', 'testingDesc'].includes(key) ? (
                        <textarea
                          value={data.texts.en[key] || ''}
                          onChange={(e) => updateText('en', key, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.8rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '0.6rem',
                            color: 'var(--text-color)',
                            fontSize: '1.1rem',
                            minHeight: '80px',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            boxSizing: 'border-box'
                          }}
                        />
                      ) : (
                        <input
                          type="text"
                          value={data.texts.en[key] || ''}
                          onChange={(e) => updateText('en', key, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.8rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '0.6rem',
                            color: 'var(--text-color)',
                            fontSize: '1.1rem',
                            boxSizing: 'border-box'
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Arabic Texts Tab */}
        {activeTab === 'textsAr' && (
          <div style={{ background: 'var(--glass-bg)', borderRadius: '1.5rem', padding: '2.5rem', border: '1px solid var(--glass-border)', direction: 'rtl' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--text-color)', fontSize: '2rem' }}>🇸🇦 محتوى اللغة العربية</h2>
            
            {['القسم الرئيسي', 'التعليم', 'الخدمات', 'التواصل', 'أخرى'].map(section => (
              <div key={section} style={{ marginBottom: '3rem' }}>
                <h3 style={{ color: 'var(--main-color)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>📌 {section}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {Object.keys(data.texts.ar).filter(key => {
                    if (section === 'القسم الرئيسي') return ['hi', 'name', 'iama', 'homeDesc', 'hire', 'contactme'].includes(key)
                    if (section === 'التعليم') return ['educationHeading', 'highSchool', 'highSchoolDesc', 'university', 'universityDesc', 'internship', 'internshipDesc', 'firstJob', 'firstJobDesc'].includes(key)
                    if (section === 'الخدمات') return ['servicesHeading', 'uiux', 'uiuxDesc', 'frontend', 'frontendDesc', 'backend', 'backendDesc', 'testing', 'testingDesc'].includes(key)
                    if (section === 'التواصل') return ['contactHeading', 'namePlaceholder', 'emailPlaceholder', 'messagePlaceholder', 'sendMessage'].includes(key)
                    return !['hi', 'name', 'iama', 'homeDesc', 'hire', 'contactme', 'educationHeading', 'highSchool', 'highSchoolDesc', 'university', 'universityDesc', 'internship', 'internshipDesc', 'firstJob', 'firstJobDesc', 'servicesHeading', 'uiux', 'uiuxDesc', 'frontend', 'frontendDesc', 'backend', 'backendDesc', 'testing', 'testingDesc', 'contactHeading', 'namePlaceholder', 'emailPlaceholder', 'messagePlaceholder', 'sendMessage'].includes(key)
                  }).map(key => (
                    <div key={key}>
                      <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-color)', fontSize: '1.2rem', fontWeight: '600' }}>
                        {key}
                      </label>
                      {['homeDesc', 'highSchoolDesc', 'universityDesc', 'internshipDesc', 'firstJobDesc', 'uiuxDesc', 'frontendDesc', 'backendDesc', 'testingDesc'].includes(key) ? (
                        <textarea
                          value={data.texts.ar[key] || ''}
                          onChange={(e) => updateText('ar', key, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.8rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '0.6rem',
                            color: 'var(--text-color)',
                            fontSize: '1.1rem',
                            minHeight: '80px',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            boxSizing: 'border-box'
                          }}
                        />
                      ) : (
                        <input
                          type="text"
                          value={data.texts.ar[key] || ''}
                          onChange={(e) => updateText('ar', key, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.8rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '0.6rem',
                            color: 'var(--text-color)',
                            fontSize: '1.1rem',
                            boxSizing: 'border-box'
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sections Tab */}
        {activeTab === 'sections' && (
          <div style={{ background: 'var(--glass-bg)', borderRadius: '1.5rem', padding: '2.5rem', border: '1px solid var(--glass-border)' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--text-color)', fontSize: '2rem' }}>👁️ Section Visibility</h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {Object.keys(data.sections).map(section => (
                <label key={section} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1.5rem',
                  background: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid var(--glass-border)'
                }}>
                  <input
                    type="checkbox"
                    checked={data.sections[section]}
                    onChange={() => toggleSection(section)}
                    style={{ width: '24px', height: '24px', cursor: 'pointer', marginRight: '1.5rem' }}
                  />
                  <span style={{ color: 'var(--text-color)', fontSize: '1.3rem', fontWeight: '600' }}>
                    {section.charAt(0).toUpperCase() + section.slice(1)} Section
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div style={{ background: 'var(--glass-bg)', borderRadius: '1.5rem', padding: '2.5rem', border: '1px solid var(--glass-border)' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--text-color)', fontSize: '2rem' }}>🖼️ Media & Images</h2>
            <div style={{ display: 'grid', gap: '3rem' }}>
              {[
                { key: 'personal', label: 'Personal Photo', emoji: '👤' },
                { key: 'icon', label: 'Website Icon', emoji: '🎯' }
              ].map(img => (
                <div key={img.key} style={{ background: 'rgba(0, 0, 0, 0.1)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
                  <h3 style={{ color: 'var(--main-color)', marginBottom: '1.5rem', fontSize: '1.4rem' }}>
                    {img.emoji} {img.label}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.8rem', color: 'var(--text-color)', fontSize: '1.2rem', fontWeight: '600' }}>
                        Image URL or Upload
                      </label>
                      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem' }}>
                        <input
                          type="text"
                          value={data.images[img.key]}
                          onChange={(e) => updateImage(img.key, e.target.value)}
                          placeholder="http://..."
                          style={{
                            flex: 1,
                            padding: '0.8rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '0.6rem',
                            color: 'var(--text-color)',
                            fontSize: '1.1rem',
                            boxSizing: 'border-box'
                          }}
                        />
                        <label style={{
                          padding: '0.8rem 1.5rem',
                          background: 'var(--main-color)',
                          color: 'var(--bg-color)',
                          borderRadius: '0.6rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '1rem',
                          whiteSpace: 'nowrap'
                        }}>
                          Upload
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, img.key)} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>
                    {data.images[img.key] && (
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.8rem', color: 'var(--text-color)', fontSize: '1.2rem', fontWeight: '600' }}>
                          Preview
                        </label>
                        <img src={data.images[img.key]} alt="Preview" style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: '200px',
                          borderRadius: '0.8rem',
                          border: '1px solid var(--glass-border)',
                          objectFit: 'contain'
                        }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'works' && (
          <div style={{ background: 'var(--glass-bg)', borderRadius: '1.5rem', padding: '2.5rem', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
              <h2 style={{ margin: 0, color: 'var(--text-color)', fontSize: '2rem' }}>🚀 My Projects</h2>
              <button
                onClick={addWork}
                style={{
                  padding: '0.8rem 1.6rem',
                  background: 'var(--main-color)',
                  color: 'var(--bg-color)',
                  border: 'none',
                  borderRadius: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1.2rem'
                }}
              >
                + Add Project
              </button>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
              {(data.works || []).map((work, idx) => (
                <div key={work.id} style={{
                  background: 'rgba(0, 0, 0, 0.1)',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '1px solid var(--glass-border)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: 'var(--main-color)', margin: 0, fontSize: '1.4rem' }}>💼 Project #{idx + 1}</h3>
                    <button
                      onClick={() => deleteWork(work.id)}
                      style={{
                        padding: '0.6rem 1.2rem',
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.6rem',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-color)', fontWeight: '600', fontSize: '1.1rem' }}>
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={work.title}
                        onChange={(e) => updateWork(work.id, 'title', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          background: 'rgba(0, 0, 0, 0.2)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '0.6rem',
                          color: 'var(--text-color)',
                          fontSize: '1.1rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-color)', fontWeight: '600', fontSize: '1.1rem' }}>
                        Description
                      </label>
                      <textarea
                        value={work.desc}
                        onChange={(e) => updateWork(work.id, 'desc', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          background: 'rgba(0, 0, 0, 0.2)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '0.6rem',
                          color: 'var(--text-color)',
                          fontSize: '1.1rem',
                          minHeight: '80px',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.6rem', color: 'var(--text-color)', fontWeight: '600', fontSize: '1.1rem' }}>
                        Project URL
                      </label>
                      <input
                        type="url"
                        value={work.url}
                        onChange={(e) => updateWork(work.id, 'url', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.8rem',
                          background: 'rgba(0, 0, 0, 0.2)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '0.6rem',
                          color: 'var(--text-color)',
                          fontSize: '1.1rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-color)', fontWeight: '600', fontSize: '1.1rem' }}>
                        📸 Project Images Gallery
                      </label>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1rem'
                      }}>
                        {(work.images || []).map((img, imgIdx) => (
                          <div key={imgIdx} style={{
                            position: 'relative',
                            borderRadius: '0.8rem',
                            overflow: 'hidden',
                            border: '1px solid var(--glass-border)',
                            height: '100px'
                          }}>
                            <img src={img} alt="Work" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              onClick={() => removeWorkImage(work.id, imgIdx)}
                              style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                background: 'rgba(255,0,0,0.8)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <input
                          type="url"
                          placeholder="Add image by URL..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value) {
                              addWorkImage(work.id, e.target.value)
                              e.target.value = ''
                            }
                          }}
                          style={{
                            flex: 1,
                            padding: '0.8rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '0.6rem',
                            color: 'var(--text-color)',
                            fontSize: '1.1rem',
                            boxSizing: 'border-box'
                          }}
                        />
                        <label style={{
                          padding: '0.8rem 1.5rem',
                          background: 'var(--main-color)',
                          color: 'var(--bg-color)',
                          borderRadius: '0.6rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '1rem',
                          whiteSpace: 'nowrap'
                        }}>
                          📤 Upload
                          <input type="file" accept="image/*" onChange={(e) => handleWorkImageUpload(e, work.id)} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: var(--main-color) rgba(0, 0, 0, 0.2);
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--main-color);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--main-color);
          opacity: 0.8;
        }
      `}</style>
    </div>
  )
}
