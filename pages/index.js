import Head from 'next/head'
import Script from 'next/script'
import React, { useEffect, useState } from 'react'

function ProjectCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); 
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return (
        <div className="portfolio-fallback">
            <i className='bx bx-code-alt'></i>
        </div>
    );
  }

  const nextSlide = (e) => {
    if (e) e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e) => {
    if (e) e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="carousel-container">
      <div 
        className="carousel-wrapper" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="carousel-slide">
            <img src={img} alt={`Slide ${idx}`} />
          </div>
        ))}
      </div>
      
      {images.length > 1 && (
        <>
          <div className="carousel-btn prev" onClick={prevSlide}>
            <i className='bx bx-chevron-left'></i>
          </div>
          <div className="carousel-btn next" onClick={nextSlide}>
            <i className='bx bx-chevron-right'></i>
          </div>
          
          <div className="carousel-dots">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={(e) => { if (e) e.preventDefault(); setCurrentIndex(idx); }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  let initialData = null;
  try {
    const res = await fetch('https://doser-portfolio-default-rtdb.firebaseio.com/portfolioData.json', { cache: 'no-store' });
    if (res.ok) {
      initialData = await res.json();
    }
  } catch (error) {
    console.error("Error fetching initial data", error);
  }
  
  return {
    props: { initialData }
  }
}

export default function Home({ initialData }) {
  const [lang, setLang] = React.useState('en')
  const [themeMode, setThemeMode] = React.useState('dark')
  const [adminData, setAdminData] = React.useState(initialData)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  React.useEffect(() => {
    // Check locally saved UI preferences (independent from admin config)
    const localTheme = localStorage.getItem('portfolioTheme')
    if (localTheme) {
      setThemeMode(localTheme)
    }

    // Only fallback to fetching/local usage if SSR completely failed
    if (!initialData) {
      fetch('https://doser-portfolio-default-rtdb.firebaseio.com/portfolioData.json', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setAdminData(data)
          } else {
            const saved = localStorage.getItem('portfolioDataV5')
            if (saved) setAdminData(JSON.parse(saved))
          }
        })
        .catch((err) => console.error("Error fetching Firebase:", err))
    }
  }, [initialData])

  const toggleTheme = () => {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark'
    setThemeMode(nextTheme)
    localStorage.setItem('portfolioTheme', nextTheme)
  }

  const sections = adminData?.sections || { home: true, education: true, services: true, contact: true, mywebsites: true }
  const colors = adminData?.colors || {
    dark: { mainColor: '#00f0ff', bgColor: '#050505', secBgColor: '#111111', textColor: '#f0f0f0' },
    light: { mainColor: '#0070f3', bgColor: '#f0f4f8', secBgColor: '#ffffff', textColor: '#1a202c' }
  }
  const images = adminData?.images || { personal: '/personal.png', icon: '/icon.png' }
  const works = adminData?.works || [
    { id: 1, title: 'Doser hub for easy Browse', desc: 'A hub for easy browsing and resources.', url: 'https://doser-hub.vercel.app/' }
  ]

  const texts = adminData?.texts || {
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
  }

  const t = (key) => texts[lang][key] || key

  React.useEffect(() => {
    const currentColors = colors[themeMode] || colors.dark
    document.documentElement.style.setProperty('--bg-color', currentColors.bgColor)
    document.documentElement.style.setProperty('--sec-bg-color', currentColors.secBgColor)
    document.documentElement.style.setProperty('--text-color', currentColors.textColor)
    document.documentElement.style.setProperty('--main-color', currentColors.mainColor)
    
    // Setup some adaptive glassmorphism settings based on theme
    if (themeMode === 'light') {
      document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.6)');
      document.documentElement.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.05)');
      document.documentElement.style.setProperty('--glass-shadow', '0 8px 32px 0 rgba(0, 0, 0, 0.1)');
      document.documentElement.style.setProperty('--text-muted', '#4a5568');
    } else {
      document.documentElement.style.setProperty('--glass-bg', 'rgba(20, 20, 20, 0.4)');
      document.documentElement.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.05)');
      document.documentElement.style.setProperty('--glass-shadow', '0 8px 32px 0 rgba(0, 0, 0, 0.37)');
      document.documentElement.style.setProperty('--text-muted', '#a0a0a0');
    }
  }, [colors, themeMode])

  return (
    <>
      <Head>
        <title>{lang === 'ar' ? 'عبدالرحمن السيد (Doser) | مطور برامج وشخصية تقنية' : 'Abdelrahman Doser | Full-Stack Developer & UI/UX Expert'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Basic SEO */}
        <meta name="description" content={lang === 'ar' ? 'اكتشف معرض أعمال عبدالرحمن السيد (Doser)، مطور برمجيات متكامل ومصمم واجهات متخصص في بناء تطبيقات ويب عصرية، سريعة، وذكية. خبرة في React و Next.js و Firebase.' : 'Explore the professional portfolio of Abdelrahman Elsayed (Doser), a Full-Stack Developer and UI/UX Specialist crafting high-performance, modern web applications with React, Next.js, and Firebase.'} />
        <meta name="keywords" content="Abdelrahman Doser, عبدالرحمن السيد, Doser, مطور ويب, مبرمج, تصميم واجهات, Full-Stack Developer, UI/UX Designer, React Developer, Next.js Expert, Software Engineer Egypt, افضل مبرمج في مصر, برمجة مواقع, تصميم تطبيقات, تحسين محركات البحث, SEO for Developers" />
        <meta name="author" content="Abdelrahman Doser" />
        <link rel="canonical" href="https://itsmedoser.vercel.app/" />

        {/* Social Media & Open Graph */}
        <meta property="og:title" content={lang === 'ar' ? 'عبدالرحمن السيد | معرض الأعمال الرقمي' : 'Abdelrahman Doser | Digital Portfolio'} />
        <meta property="og:description" content={lang === 'ar' ? 'بناء تجارب رقمية استثنائية تجمع بين التصميم الراقي والأداء القوي.' : 'Crafting exceptional digital experiences combining premium design with high-performance code.'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://itsmedoser.vercel.app/" />
        <meta property="og:image" content={images.personal} />
        <meta property="og:site_name" content="Doser Portfolio" />
        <meta property="og:locale" content={lang === 'ar' ? 'ar_EG' : 'en_US'} />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Abdelrahman Doser | Full-Stack Developer" />
        <meta name="twitter:description" content="Professional Web Developer & UI/UX Designer specializing in modern digital solutions." />
        <meta name="twitter:image" content={images.personal} />

        {/* JSON-LD Schema.org Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Abdelrahman Elsayed (Doser)",
            "alternateName": ["Abdelrahman Doser", "عبدالرحمن السيد", "دوسر"],
            "url": "https://itsmedoser.vercel.app/",
            "image": images.personal,
            "jobTitle": "Full-Stack Developer & UI/UX Designer",
            "description": "Professional Web Developer specialized in React, Next.js, and creating high-end digital solutions in Egypt.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Cairo",
              "addressCountry": "Egypt"
            },
            "knowsAbout": ["Web Development", "UI/UX Design", "React", "Next.js", "Firebase", "Backend Development", "JavaScript", "Python"],
            "sameAs": [
              "https://www.facebook.com/profile.php?id=61581958772971",
              "https://www.instagram.com/_doser_1/",
              "https://wa.me/201151071517"
            ]
          })
        }} />

        <link rel="icon" href={images.icon} />
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      </Head>

      <header className="header">
        <a href="#home" className="logo">Abdelrahman<span>.</span></a>

        <i className={`bx ${isMenuOpen ? 'bx-x' : 'bx-menu'}`} id="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}></i>

        <nav className={`navbar ${isMenuOpen ? 'active' : ''}`}>
            {sections.home && <a href="#home" onClick={() => setIsMenuOpen(false)}>{t('home')}</a>}
            {sections.education && <a href="#education" onClick={() => setIsMenuOpen(false)}>{t('education')}</a>}
            {sections.services && <a href="#services" onClick={() => setIsMenuOpen(false)}>{t('services')}</a>}
            {sections.mywebsites && <a href="#mywebsites" onClick={() => setIsMenuOpen(false)}>{t('mywebsites')}</a>}
            {sections.contact && <a href="#contact" onClick={() => setIsMenuOpen(false)}>{t('contact')}</a>}
        </nav>
        
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <button 
               onClick={toggleTheme} 
               style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '4rem', height: '4rem', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'var(--text-color)', fontSize: '2rem' }}
            >
               <i className={`bx ${themeMode === 'dark' ? 'bx-sun' : 'bx-moon'}`}></i>
            </button>
            <div className="lang-switch" style={{marginLeft: '0'}}>
                <button onClick={() => setLang('en')} style={{ borderColor: lang === 'en' ? 'var(--main-color)' : '', color: 'var(--text-color)' }}>EN</button> 
                <button onClick={() => setLang('ar')} style={{ borderColor: lang === 'ar' ? 'var(--main-color)' : '', color: 'var(--text-color)' }}>AR</button>
            </div>
        </div>
    </header>

    {sections.home && (
    <section className="home" id="home">
        <div className="home-content">
            <h1>{t('hi')} <span>{t('name')}</span></h1>
            <h3>{t('iama')} <span style={{color: 'var(--main-color)'}}>Developer</span></h3>
            <p>{t('homeDesc')}</p>

            <div className="social-icons">
                <a href="https://wa.me/201151071517"><i className='bx bxl-whatsapp' ></i></a>
                <a href="https://www.facebook.com/profile.php?id=61581958772971"><i className='bx bxl-facebook' ></i></a>
                <a href="https://www.instagram.com/_doser_1/"><i className='bx bxl-instagram' ></i></a>
            </div>

            <div className="btn-group">
                <a href="#mywebsites" className="btn">{t('hire')}</a>
                <a href="#contact" className="btn">{t('contactme')}</a>
            </div>
        </div>
        <div className="home-img">
            <img src={images.personal} alt="Personal Photo" />
        </div>
    </section>
    )}

    {sections.education && (
    <section className="education" id="education">
        <h2 className="heading">{t('educationHeading')}</h2>
        <div className="timeline-items">
            <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-date">2022</div>
                <div className="timeline-content">
                    <h3>{t('highSchool')}</h3>
                    <p>{t('highSchoolDesc')}</p>
                </div>
            </div>
            <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-date">2023</div>
                <div className="timeline-content">
                    <h3>{t('university')}</h3>
                    <p>{t('universityDesc')}</p>
                </div>
            </div>
            <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-date">2024</div>
                <div className="timeline-content">
                    <h3>{t('internship')}</h3>
                    <p>{t('internshipDesc')}</p>
                </div>
            </div>
            <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-date">2025</div>
                <div className="timeline-content">
                    <h3>{t('firstJob')}</h3>
                    <p>{t('firstJobDesc')}</p>
                </div>
            </div>
        </div>
    </section>
    )}

    {sections.services && (
    <section className="services" id="services">
        <h2 className="heading">{t('servicesHeading')}</h2>
        <div className="services-container">
            <div className="services-box glass-panel">
                <div className="services-info">
                    <h4>{t('uiux')}</h4>
                    <p>{t('uiuxDesc')}</p>
                </div>
            </div>
            <div className="services-box glass-panel">
                <div className="services-info">
                    <h4>{t('frontend')}</h4>
                    <p>{t('frontendDesc')}</p>
                </div>
            </div>
            <div className="services-box glass-panel">
                <div className="services-info">
                    <h4>{t('backend')}</h4>
                    <p>{t('backendDesc')}</p>
                </div>
            </div>
            <div className="services-box glass-panel">
                <div className="services-info">
                    <h4>{t('testing')}</h4>
                    <p>{t('testingDesc')}</p>
                </div>
            </div>
        </div>
    </section>
    )}

    {sections.mywebsites && works.length > 0 && (
    <section className="portfolio" id="mywebsites" style={{background: 'var(--sec-bg-color)'}}>
        <h2 className="heading"><span>{t('myWebsitesHeading')}</span></h2>
        <div className="portfolio-grid">
            {works.map((work) => {
                // Support both legacy single image and new array format
                const projectImages = work.images || (work.image ? [work.image] : []);
                
                return (
                    <div key={work.id} className="portfolio-card">
                        <div className="portfolio-img">
                            <ProjectCarousel images={projectImages} />
                        </div>
                        <div className="portfolio-info">
                            <h3>{work.title}</h3>
                            <p>{work.desc}</p>
                            <a href={work.url} target="_blank" rel="noreferrer" className="btn-view">
                                {t('viewProject')} <i className='bx bx-right-top-arrow-circle' style={{marginLeft: '8px'}}></i>
                            </a>
                        </div>
                    </div>
                );
            })}
        </div>
    </section>
    )}

    {sections.contact && (
    <section className="contact" id="contact">
        <h2 className="heading">{t('contactHeading')}</h2>
        <form action="https://api.web3forms.com/submit" method="POST" className="glass-panel">
            <input type="hidden" name="access_key" value="170b20a4-ad65-42c0-affe-3e39b656026e" />
            <div className="input-box">
                <input type="text" name="name" required placeholder={t('namePlaceholder')} />
                <input type="email" name="email" required placeholder={t('emailPlaceholder')} />
            </div>
            <textarea name="message" required placeholder={t('messagePlaceholder')}></textarea>
            <button type="submit" className="btn" style={{marginTop: '2rem', width: '100%', maxWidth: '200px'}}>{t('sendMessage')}</button>
        </form>
    </section>
    )}

    <footer className="footer">
        <div className="social">
            <a href="#"><i className='bx bxl-facebook'></i></a>
            <a href="#"><i className='bx bxl-instagram'></i></a>
            <a href="#"><i className='bx bxl-whatsapp'></i></a>
        </div>
        <ul className="list">
            <li><a href="#home">{t('home')}</a></li>
            <li><a href="#services">{t('services')}</a></li>
            <li><a href="#contact">{t('contact')}</a></li>
        </ul>
        <p className="copyright">
            {t('copyright')}
        </p>
    </footer>
    </>
  )
}