import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('colors') // colors, textsEn, textsAr, sections, media, works
  const [data, setData] = useState({
    colors: {
      dark: { mainColor: '#00f0ff', bgColor: '#050505', secBgColor: '#111111', textColor: '#f0f0f0' },
      light: { mainColor: '#0070f3', bgColor: '#f0f4f8', secBgColor: '#ffffff', textColor: '#1a202c' }
    },
    texts: {
      en: {
        home: "Home", education: "Education", services: "Services", contact: "Contact", mywebsites: "My Websites",
        hi: "Hi, I'm", name: "Abdelrahman", iama: "I'm a", social: "Connect with me",
        homeDesc: "Passionate Full-Stack Developer & UI/UX Designer creating innovative digital solutions.",
        hire: "Hire Me", contactme: "Contact Me", educationHeading: "My Education Journey",
        highSchool: "High School", highSchoolDesc: "Attended Al-Orman Language School where I mastered HTML, CSS, JavaScript, and Python.",
        university: "Current Studies", universityDesc: "Currently enrolled at Al-Orman Secondary School for Languages.",
        internship: "Achievements", internshipDesc: "Awarded first place certificate in the Dokki Governorate Inventor Competition.",
        firstJob: "Early Career", firstJobDesc: "My first professional experience was in technology and mobile repair at age 9.",
        servicesHeading: "Premium Services", uiux: "UI/UX Design", frontend: "Frontend Development", backend: "Backend Development", testing: "Quality Assurance",
        uiuxDesc: "Creating intuitive and visually appealing interfaces with modern glassmorphism.",
        frontendDesc: "Building responsive and interactive web applications using Next.js & React.",
        backendDesc: "Developing robust server-side applications and secure APIs.",
        testingDesc: "Ensuring software reliability through comprehensive testing processes.",
        contactHeading: "Let's Work Together", namePlaceholder: "Your Name", emailPlaceholder: "Your Email", messagePlaceholder: "Your Message", sendMessage: "Send Message",
        myWebsitesHeading: "Featured Projects", viewProject: "View Project", faq: "FAQ", aboutMe: "About Me", copyright: "Abdelrahman Elsayed | All Rights Reserved"
      },
      ar: {
        home: "الرئيسية", education: "المسيرة التعليمية", services: "خدماتي", contact: "للتواصل", mywebsites: "معرض الأعمال",
        hi: "أهلاً بك، أنا", name: "عبدالرحمن", iama: "أنا", social: "منصات التواصل",
        homeDesc: "مطور برمجيات متكامل (Full-Stack) ومصمم واجهات استخدام (UI/UX). أمتلك شغفاً كبيراً في تحويل الأفكار إلى تجارب رقمية استثنائية وعالية الأداء.",
        hire: "اطلب خدماتي", contactme: "راسلني الآن", educationHeading: "مسيرتي التعليمية",
        highSchool: "المرحلة الثانوية", highSchoolDesc: "درست في مدارس الأورمان للغات، حيث كان شغفي الأول وبدايتي الحقيقية مع أساسيات البرمجة وتطوير الويب.",
        university: "الدراسة الحالية", universityDesc: "أستكمل مسيرتي التعليمية حالياً في مدارس الأورمان الثانوية للغات، مع التركيز على صقل مهاراتي التقنية المتقدمة.",
        internship: "الإنجازات والجوائز", internshipDesc: "حصدت شهادة المركز الأول على مستوى محافظة الدقي في مسابقة 'المخترع الصغير' للابتكارات التقنية.",
        firstJob: "الخطوات الأولى", firstJobDesc: "بدأ شغفي بالتكنولوجيا مبكراً جداً؛ حيث انطلقت في مجال صيانة الهواتف والتقنية منذ سن التاسعة.",
        servicesHeading: "الخدمات الاحترافية", uiux: "تصميم واجهات المستخدم (UI/UX)", frontend: "تطوير الواجهات الأمامية (Frontend)", backend: "تطوير النظم النواة (Backend)", testing: "فحص الجودة (Testing)",
        uiuxDesc: "أبتكر تصاميم عصرية وبديهية تضمن تجربة مستخدم سلسة وتترك انطباعاً راقياً ومميزاً.",
        frontendDesc: "أقوم ببناء تطبيقات ويب ديناميكية وسريعة الاستجابة تواكب أحدث المعايير التقنية العالمية.",
        backendDesc: "أطور قواعد بيانات وهيكليات خلفية شديدة الأمان لضمان عمل تطبيقاتك بثبات وقوة لاستيعاب الضغط المتزايد.",
        testingDesc: "أخضع المشاريع لاختبارات دقيقة لمعالجة كافة الثغرات البرمجية وتقديم منتج نهائي متكامل وموثوق.",
        contactHeading: "دعنا نصنع شيئاً عظيماً معاً", namePlaceholder: "الاسم الكريم", emailPlaceholder: "البريد الإلكتروني", messagePlaceholder: "رسالتك (اخبرني عن مشروعك..)", sendMessage: "إرسال الرسالة",
        myWebsitesHeading: "معرض أعمالي ومشاريعي", viewProject: "عرض المشروع", faq: "الأسئلة الشائعة", aboutMe: "من أنا", copyright: "كافة الحقوق محفوظة © عبدالرحمن السيد"
      }
    },
    sections: { home: true, education: true, services: true, contact: true, mywebsites: true },
    images: { personal: '/personal.png', icon: '/icon.png' },
    videos: [],
    works: [ { id: 1, title: 'Doser hub for easy Browse', desc: 'A hub for easy browsing and resources.', url: 'https://doser-hub.vercel.app/', images: [] } ]
  })

  useEffect(() => {
    fetch('https://doser-portfolio-default-rtdb.firebaseio.com/portfolioData.json')
      .then((res) => res.json())
      .then((dbData) => {
        if (dbData) {
          setData(dbData)
        } else {
          const saved = localStorage.getItem('portfolioDataV5')
          if (saved) setData(JSON.parse(saved))
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
      } else {
        alert('Wrong password. Unauthorized.')
      }
    } catch(err) {
      alert('Error connecting to server.')
    }
  }

  const saveData = async () => {
    try {
      const response = await fetch('/api/savePortfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, data })
      });
      if (response.ok) {
        localStorage.setItem('portfolioDataV5', JSON.stringify(data));
        alert('Data saved globally successfully! Everyone can see the changes now.')
      } else {
        const errObj = await response.json();
        alert(`Error from Server: ${errObj.message}`)
      }
    } catch (e) {
      alert('Network error while saving data: ' + e.message + '\n' + e.stack)
    }
  }

  const [editingTheme, setEditingTheme] = useState('dark')

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
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("حجم الصورة كبير جداً! يرجى اختيار صورة أقل من 2 ميجابايت (2MB) لتجنب تعليق الموقع.")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        updateImage(key, reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addWork = () => {
    const newWork = { id: Date.now(), title: '', desc: '', url: '', images: [] }
    setData(prev => ({ ...prev, works: [...prev.works, newWork] }))
  }

  const handleWorkImageUpload = (e, id) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("حجم الصورة كبير جداً! يرجى اختيار صورة أقل من 2MB.")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        addWorkImage(id, reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addWorkImage = (id, imageUrl) => {
    setData(prev => ({
      ...prev,
      works: prev.works.map(w => w.id === id ? { 
        ...w, 
        images: [...(w.images || (w.image ? [w.image] : [])), imageUrl],
        image: '' // Clear legacy single image field
      } : w)
    }))
  }

  const removeWorkImage = (id, index) => {
    setData(prev => ({
      ...prev,
      works: prev.works.map(w => w.id === id ? { 
        ...w, 
        images: (w.images || []).filter((_, i) => i !== index)
      } : w)
    }))
  }

  const updateWork = (id, field, value) => {
    setData(prev => ({
      ...prev,
      works: prev.works.map(w => w.id === id ? { ...w, [field]: value } : w)
    }))
  }

  const deleteWork = (id) => {
    setData(prev => ({ ...prev, works: prev.works.filter(w => w.id !== id) }))
  }

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <Head><title>Secret Portal</title></Head>
        <form onSubmit={handleLogin}>
          <h1>Secret Portal</h1>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Access Key"
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '2rem' }}>Authenticate</button>
        </form>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <Head>
        <title>Dashboard - Control Panel</title>
      </Head>
      
      <div className="admin-sidebar">
        <h2 style={{color: 'white', marginBottom: '2rem', textAlign: 'center'}}>Control Panel</h2>
        <button className={`tab-btn ${activeTab === 'colors' ? 'active' : ''}`} onClick={() => setActiveTab('colors')}>Colors & Theme</button>
        <button className={`tab-btn ${activeTab === 'textsEn' ? 'active' : ''}`} onClick={() => setActiveTab('textsEn')}>Texts (English)</button>
        <button className={`tab-btn ${activeTab === 'textsAr' ? 'active' : ''}`} onClick={() => setActiveTab('textsAr')}>Texts (Arabic)</button>
        <button className={`tab-btn ${activeTab === 'sections' ? 'active' : ''}`} onClick={() => setActiveTab('sections')}>Sections Visibility</button>
        <button className={`tab-btn ${activeTab === 'media' ? 'active' : ''}`} onClick={() => setActiveTab('media')}>Media & Images</button>
        <button className={`tab-btn ${activeTab === 'works' ? 'active' : ''}`} onClick={() => setActiveTab('works')}>My Works</button>
        
        <div style={{flex: 1}}></div>
        <button onClick={saveData} className="btn" style={{marginTop: '2rem', padding: '1rem', width: '100%'}}>Save All Changes</button>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard</h1>
        </div>

        {activeTab === 'colors' && (
          <div className="admin-card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2.5rem'}}>
              <h2 style={{border: 'none', margin: 0, padding: 0}}>Colors & Theme Configuration</h2>
              <div className="lang-switch">
                  <button onClick={() => setEditingTheme('dark')} style={{ borderColor: editingTheme === 'dark' ? 'var(--main-color)' : '', borderRadius: '1rem', padding: '0.5rem 1rem' }}>Dark Theme</button>
                  <button onClick={() => setEditingTheme('light')} style={{ borderColor: editingTheme === 'light' ? 'var(--main-color)' : '', borderRadius: '1rem', padding: '0.5rem 1rem' }}>Light Theme</button>
              </div>
            </div>
            
            <div className="form-group color-picker">
              <input type="color" value={data.colors[editingTheme].mainColor} onChange={(e) => updateColor(editingTheme, 'mainColor', e.target.value)} />
              <label>Main Highlight Color (Primary Accent)</label>
            </div>
            <div className="form-group color-picker">
              <input type="color" value={data.colors[editingTheme].bgColor} onChange={(e) => updateColor(editingTheme, 'bgColor', e.target.value)} />
              <label>Background Color (Main)</label>
            </div>
            <div className="form-group color-picker">
              <input type="color" value={data.colors[editingTheme].secBgColor} onChange={(e) => updateColor(editingTheme, 'secBgColor', e.target.value)} />
              <label>Secondary Background Color (Cards/Sections)</label>
            </div>
            <div className="form-group color-picker">
              <input type="color" value={data.colors[editingTheme].textColor} onChange={(e) => updateColor(editingTheme, 'textColor', e.target.value)} />
              <label>Body Text Color</label>
            </div>
          </div>
        )}

        {activeTab === 'textsEn' && (
          <div className="admin-card">
            <h2>English Content Configuration</h2>
            
            <h3 style={{marginTop: '2rem', marginBottom: '1rem', color: 'var(--main-color)'}}>Hero Section</h3>
            <div className="form-group"><label>Greeting (Hi, I'm)</label><input type="text" value={data.texts.en.hi || ''} onChange={(e) => updateText('en', 'hi', e.target.value)} /></div>
            <div className="form-group"><label>Name</label><input type="text" value={data.texts.en.name || ''} onChange={(e) => updateText('en', 'name', e.target.value)} /></div>
            <div className="form-group"><label>I am a...</label><input type="text" value={data.texts.en.iama || ''} onChange={(e) => updateText('en', 'iama', e.target.value)} /></div>
            <div className="form-group"><label>Home Description</label><textarea value={data.texts.en.homeDesc || ''} onChange={(e) => updateText('en', 'homeDesc', e.target.value)} /></div>
            
            <h3 style={{marginTop: '2rem', marginBottom: '1rem', color: 'var(--main-color)'}}>Education & Journey Section</h3>
            <div className="form-group"><label>Education Heading</label><input type="text" value={data.texts.en.educationHeading || ''} onChange={(e) => updateText('en', 'educationHeading', e.target.value)} /></div>
            <div className="form-group"><label>School Name / Title</label><input type="text" value={data.texts.en.highSchool || ''} onChange={(e) => updateText('en', 'highSchool', e.target.value)} /></div>
            <div className="form-group"><label>School Description</label><textarea value={data.texts.en.highSchoolDesc || ''} onChange={(e) => updateText('en', 'highSchoolDesc', e.target.value)} /></div>
            <div className="form-group"><label>University / Current Study Title</label><input type="text" value={data.texts.en.university || ''} onChange={(e) => updateText('en', 'university', e.target.value)} /></div>
            <div className="form-group"><label>University Description</label><textarea value={data.texts.en.universityDesc || ''} onChange={(e) => updateText('en', 'universityDesc', e.target.value)} /></div>
            <div className="form-group"><label>Internship Title</label><input type="text" value={data.texts.en.internship || ''} onChange={(e) => updateText('en', 'internship', e.target.value)} /></div>
            <div className="form-group"><label>Internship Description</label><textarea value={data.texts.en.internshipDesc || ''} onChange={(e) => updateText('en', 'internshipDesc', e.target.value)} /></div>
            <div className="form-group"><label>First Job Title</label><input type="text" value={data.texts.en.firstJob || ''} onChange={(e) => updateText('en', 'firstJob', e.target.value)} /></div>
            <div className="form-group"><label>First Job Description</label><textarea value={data.texts.en.firstJobDesc || ''} onChange={(e) => updateText('en', 'firstJobDesc', e.target.value)} /></div>

            <h3 style={{marginTop: '2rem', marginBottom: '1rem', color: 'var(--main-color)'}}>Other Headings</h3>
            <div className="form-group"><label>Services Section Heading</label><input type="text" value={data.texts.en.servicesHeading || ''} onChange={(e) => updateText('en', 'servicesHeading', e.target.value)} /></div>
            <div className="form-group"><label>My Websites Heading</label><input type="text" value={data.texts.en.myWebsitesHeading || ''} onChange={(e) => updateText('en', 'myWebsitesHeading', e.target.value)} /></div>
            <div className="form-group"><label>View Project Button Text</label><input type="text" value={data.texts.en.viewProject || ''} onChange={(e) => updateText('en', 'viewProject', e.target.value)} /></div>
            <div className="form-group"><label>Contact Heading</label><input type="text" value={data.texts.en.contactHeading || ''} onChange={(e) => updateText('en', 'contactHeading', e.target.value)} /></div>
          </div>
        )}

        {activeTab === 'textsAr' && (
          <div className="admin-card" dir="rtl">
            <h2>Arabic Content Configuration</h2>
            
            <h3 style={{marginTop: '2rem', marginBottom: '1rem', color: 'var(--main-color)'}}>القسم الرئيسي (Hero)</h3>
            <div className="form-group"><label>التحية (مرحباً، أنا)</label><input type="text" value={data.texts.ar.hi || ''} onChange={(e) => updateText('ar', 'hi', e.target.value)} /></div>
            <div className="form-group"><label>الاسم</label><input type="text" value={data.texts.ar.name || ''} onChange={(e) => updateText('ar', 'name', e.target.value)} /></div>
            <div className="form-group"><label>وصفي (أنا..)</label><input type="text" value={data.texts.ar.iama || ''} onChange={(e) => updateText('ar', 'iama', e.target.value)} /></div>
            <div className="form-group"><label>وصف الرئيسية</label><textarea value={data.texts.ar.homeDesc || ''} onChange={(e) => updateText('ar', 'homeDesc', e.target.value)} /></div>
            
            <h3 style={{marginTop: '2rem', marginBottom: '1rem', color: 'var(--main-color)'}}>قسم التعليم والخبرة</h3>
            <div className="form-group"><label>عنوان قسم التعليم</label><input type="text" value={data.texts.ar.educationHeading || ''} onChange={(e) => updateText('ar', 'educationHeading', e.target.value)} /></div>
            <div className="form-group"><label>اسم المدرسة الثانوية</label><input type="text" value={data.texts.ar.highSchool || ''} onChange={(e) => updateText('ar', 'highSchool', e.target.value)} /></div>
            <div className="form-group"><label>وصف المدرسة الثانوية</label><textarea value={data.texts.ar.highSchoolDesc || ''} onChange={(e) => updateText('ar', 'highSchoolDesc', e.target.value)} /></div>
            <div className="form-group"><label>اسم الجامعة / الدراسة الحالية</label><input type="text" value={data.texts.ar.university || ''} onChange={(e) => updateText('ar', 'university', e.target.value)} /></div>
            <div className="form-group"><label>وصف الجامعة</label><textarea value={data.texts.ar.universityDesc || ''} onChange={(e) => updateText('ar', 'universityDesc', e.target.value)} /></div>
            <div className="form-group"><label>عنوان التدريب/الإنجازات</label><input type="text" value={data.texts.ar.internship || ''} onChange={(e) => updateText('ar', 'internship', e.target.value)} /></div>
            <div className="form-group"><label>وصف الإنجازات</label><textarea value={data.texts.ar.internshipDesc || ''} onChange={(e) => updateText('ar', 'internshipDesc', e.target.value)} /></div>
            <div className="form-group"><label>عنوان الوظيفة الأولى</label><input type="text" value={data.texts.ar.firstJob || ''} onChange={(e) => updateText('ar', 'firstJob', e.target.value)} /></div>
            <div className="form-group"><label>وصف الوظيفة الأولى</label><textarea value={data.texts.ar.firstJobDesc || ''} onChange={(e) => updateText('ar', 'firstJobDesc', e.target.value)} /></div>

            <h3 style={{marginTop: '2rem', marginBottom: '1rem', color: 'var(--main-color)'}}>عناوين أخرى</h3>
            <div className="form-group"><label>عنوان الخدمات</label><input type="text" value={data.texts.ar.servicesHeading || ''} onChange={(e) => updateText('ar', 'servicesHeading', e.target.value)} /></div>
            <div className="form-group"><label>عنوان المشاريع</label><input type="text" value={data.texts.ar.myWebsitesHeading || ''} onChange={(e) => updateText('ar', 'myWebsitesHeading', e.target.value)} /></div>
            <div className="form-group"><label>نص زر عرض المشروع</label><input type="text" value={data.texts.ar.viewProject || ''} onChange={(e) => updateText('ar', 'viewProject', e.target.value)} /></div>
            <div className="form-group"><label>عنوان التواصل</label><input type="text" value={data.texts.ar.contactHeading || ''} onChange={(e) => updateText('ar', 'contactHeading', e.target.value)} /></div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="admin-card">
            <h2>Toggle Sections</h2>
            <label className="switch-label">
              <span>Home Section</span>
              <input type="checkbox" checked={data.sections.home} onChange={() => toggleSection('home')} />
            </label>
            <label className="switch-label">
              <span>Education Section</span>
              <input type="checkbox" checked={data.sections.education} onChange={() => toggleSection('education')} />
            </label>
            <label className="switch-label">
              <span>Services Section</span>
              <input type="checkbox" checked={data.sections.services} onChange={() => toggleSection('services')} />
            </label>
            <label className="switch-label">
              <span>Contact Section</span>
              <input type="checkbox" checked={data.sections.contact} onChange={() => toggleSection('contact')} />
            </label>
            <label className="switch-label">
              <span>My Websites Section</span>
              <input type="checkbox" checked={data.sections.mywebsites} onChange={() => toggleSection('mywebsites')} />
            </label>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="admin-card">
            <h2>Media Resources</h2>
            <div className="form-group">
              <label>Personal Image (Upload or enter URL)</label>
              <input type="url" value={data.images.personal} onChange={(e) => updateImage('personal', e.target.value)} placeholder="https://... or Upload file below" />
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'personal')} style={{ marginTop: '0.5rem' }} />
              {data.images.personal && <img src={data.images.personal} alt="Personal Preview" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '1.5rem', marginTop: '1rem', border: '1px solid var(--glass-border)' }} />}
            </div>
            <div className="form-group" style={{ marginTop: '3rem' }}>
              <label>Website Icon (Upload or enter URL)</label>
              <input type="url" value={data.images.icon} onChange={(e) => updateImage('icon', e.target.value)} placeholder="https://... or Upload file below" />
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'icon')} style={{ marginTop: '0.5rem' }} />
              {data.images.icon && <img src={data.images.icon} alt="Icon Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '1rem', marginTop: '1rem', border: '1px solid var(--glass-border)' }} />}
            </div>
          </div>
        )}

        {activeTab === 'works' && (
          <div className="admin-card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
              <h2 style={{margin: 0, border: 'none'}}>My Projects & Works</h2>
              <button onClick={addWork} className="btn" style={{padding: '0.8rem 2rem'}}>+ Add New</button>
            </div>
            
            {data.works.map((work, index) => (
              <div key={work.id} className="work-item">
                <button className="delete-btn" onClick={() => deleteWork(work.id)}>Delete</button>
                <div style={{marginBottom: '1rem', fontWeight: 'bold', color: 'var(--main-color)'}}>Project #{index + 1}</div>
                <div className="form-group">
                  <input type="text" placeholder="Project Title" value={work.title} onChange={(e) => updateWork(work.id, 'title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label style={{display: 'block', marginBottom: '1rem', color: 'var(--text-color)'}}>Project Images Gallery (URL or Upload)</label>
                  
                  {/* Current Images Gallery */}
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginBottom: '1.5rem'}}>
                    {(work.images || (work.image ? [work.image] : [])).map((img, imgIdx) => (
                      <div key={imgIdx} style={{position: 'relative', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--glass-border)', height: '100px'}}>
                        <img src={img} alt="Work" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        <button 
                          onClick={() => removeWorkImage(work.id, imgIdx)}
                          style={{position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <input 
                        type="url" 
                        placeholder="Add image by URL..." 
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                addWorkImage(work.id, e.target.value);
                                e.target.value = '';
                            }
                        }}
                    />
                    <label className="btn" style={{padding: '0.8rem 1.5rem', fontSize: '1.2rem', cursor: 'pointer'}}>
                        Upload Image
                        <input type="file" accept="image/*" onChange={(e) => handleWorkImageUpload(e, work.id)} style={{display: 'none'}} />
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <textarea placeholder="Brilliant description of the project..." value={work.desc} onChange={(e) => updateWork(work.id, 'desc', e.target.value)} style={{height: '100px'}} />
                </div>
                <div className="form-group">
                  <input type="url" placeholder="Project Link (URL)" value={work.url} onChange={(e) => updateWork(work.id, 'url', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
