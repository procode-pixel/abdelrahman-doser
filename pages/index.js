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
  const colors = {
    dark: { mainColor: '#00f0ff', bgColor: '#050505', secBgColor: '#111111', textColor: '#f0f0f0' },
    light: { mainColor: '#0070f3', bgColor: '#f0f4f8', secBgColor: '#ffffff', textColor: '#1a202c' }
  }
  const images = adminData?.images || { personal: '/personal.png', icon: '/icon.png' }
  const works = adminData?.works || [
    { id: 1, title: 'Doser hub for easy Browse', desc: 'A hub for easy browsing and resources.', url: 'https://doser-hub.vercel.app/' }
  ]

  const defaultTexts = {
    en: {
      home: "Home", education: "Learning Journey", services: "Services", contact: "Contact", mywebsites: "Projects",
      hi: "Hi, I'm", name: "Abdelrahman Doser", iama: "I'm a", social: "Find me on",
      homeDesc: "Full-Stack Developer & AI Specialist. I build modern websites and integrated AI solutions for a smarter digital experience.",
      hire: "Hire Me", contactme: "Contact Me", educationHeading: "My Learning Path",
      myWebsitesHeading: "Featured Projects", viewProject: "View Project", faq: "FAQ", aboutMe: "About Me", copyright: "Abdelrahman Doser | All Rights Reserved",
      skillsHeading: "Technical Skills", aiSpecialist: "AI Integration Specialist",
      edu1Title: "Web Fundamentals (Elzero)", edu1Desc: "Learned HTML, CSS, and JavaScript with the best practices from Elzero Web School.",
      edu2Title: "Python & Java (Codezilla)", edu2Desc: "Mastered programming logic and backend basics with Python and Java.",
      edu3Title: "Modern Tech (Dave Gray & Others)", edu3Desc: "Advanced learning in React, Next.js, and Node.js for building dynamic apps.",
      edu4Title: "AI Development", edu4Desc: "Deeply experienced in using and integrating AI to solve coding challenges faster.",
      uiux: "UI/UX Design", frontend: "Frontend Development", backend: "Backend Development", testing: "QA & Testing",
      uiuxDesc: "Designing clean, modern, and user-friendly interfaces.",
      frontendDesc: "Creating responsive web apps using React and Next.js.",
      backendDesc: "Building stable servers and databases with Node.js.",
      testingDesc: "Ensuring your website works perfectly on all devices.",
      contactHeading: "Let's Work Together", namePlaceholder: "Your Name", emailPlaceholder: "Your Email", messagePlaceholder: "How can I help you?", sendMessage: "Send Message"
    },
    ar: {
      home: "الرئيسية", education: "رحلتي التعليمية", services: "خدماتي", contact: "للتواصل", mywebsites: "مشاريعي",
      hi: "أهلاً بك، أنا", name: "عبدالرحمن دوسر", iama: "أنا", social: "تابعني على",
      homeDesc: "مطور برمجيات شامل وخبير في دمج الذكاء الاصطناعي. أصنع تجارب رقمية ذكية وعصرية تجمع بين التصميم المتميز والأداء القوي.",
      hire: "اطلب خدماتي", contactme: "تواصل معي", educationHeading: "رحلة البحث والتعلم",
      myWebsitesHeading: "معرض أعمالي", viewProject: "عرض المشروع", faq: "الأسئلة الشائعة", aboutMe: "من أنا", copyright: "عبدالرحمن دوسر | كافة الحقوق محفوظة",
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
      contactHeading: "دعنا نبدأ مشروعك الجديد", namePlaceholder: "اسمك الكريم", emailPlaceholder: "بريدك الإلكتروني", messagePlaceholder: "كيف يمكنني مساعدتك؟", sendMessage: "إرسال الرسالة"
    }
  }

  const texts = {
    en: { ...defaultTexts.en, ...(adminData?.texts?.en || {}) },
    ar: { ...defaultTexts.ar, ...(adminData?.texts?.ar || {}) }
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

  // Advanced SEO & Social Sharing Optimization
  const siteUrl = "https://itsmedoser.vercel.app";
  const absoluteFullImg = `${siteUrl}${images.personal}`;

  return (
    <>
      <Head>
        {/* Anti-Gravity SEO Engine v2.0 */}
        <title>{lang === 'ar' ? 'عبدالرحمن السيد (Doser) | مبرمج مواقع محترف وخبير React' : 'Abdelrahman Doser | Expert Full-Stack Developer & React Specialist'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Core Keywords and Authority Tags */}
        <meta name="description" content={lang === 'ar' ? 'هل تبحث عن مبرمج مواقع محترف؟ عبدالرحمن السيد (Doser) هو مبرمج احترافى متخصص في React و Next.js ودمج الذكاء الاصطناعي. اكتشف معرض أعمال أفضل مبرمج في مصر.' : 'Expert Full-Stack Web Developer. Abdelrahman Doser (Doser) is a professional programmer specializing in React, Next.js, and AI. Explore projects by Egypt\'s leading software engineer.'} />
        <meta name="keywords" content="عبدالرحمن السيد, عبدالرحمن Doser, مبرمج مواقع, مبرمج احترافى, مبرمج react, مبرمج ويب, افضل مبرمج في مصر, مبرمج واجهات, Abdelrahman Doser, Doser, Full-Stack Developer, Freelance Programmer Egypt, React Expert" />
        <meta name="author" content="Abdelrahman Doser" />
        <link rel="canonical" href={siteUrl} />

        {/* Global Social Sharing (Open Graph) */}
        <meta property="og:title" content={lang === 'ar' ? 'عبدالرحمن السيد | مبرمج مواقع محترف' : 'Abdelrahman Doser | Expert Web Developer'} />
        <meta property="og:description" content={lang === 'ar' ? 'خبير في بناء وتطوير تطبيقات الويب الحديثة بذكاء اصطناعي.' : 'Building high-performance, AI-driven web architectures.'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={absoluteFullImg} />
        <meta property="og:site_name" content="Doser Portfolio" />
        <meta property="og:locale" content={lang === 'ar' ? 'ar_EG' : 'en_US'} />
        
        {/* Professional Twitter/X Card Support */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Abdelrahman Doser | Professional Web Developer" />
        <meta name="twitter:description" content="Expert in React, Next.js, and Advanced AI Integration." />
        <meta name="twitter:image" content={absoluteFullImg} />

        {/* JSON-LD Schema.org Data (The Advanced SEO Secret) */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Abdelrahman Doser",
            "alternateName": ["عبدالرحمن السيد", "دوسر", "Abdelrahman Elsayed"],
            "url": siteUrl,
            "image": absoluteFullImg,
            "jobTitle": "Full-Stack Software Engineer & AI Specialist",
            "description": "Professional Programmer specialized in high-performance web applications using React and Next.js.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Cairo",
              "addressCountry": "Egypt"
            },
            "knowsAbout": ["Web Development", "React", "Next.js", "Node.js", "AI Integration", "Software Architecture"],
            "sameAs": [
              "https://www.facebook.com/profile.php?id=61581958772971",
              "https://www.instagram.com/_doser_1/",
              "https://github.com/procode-pixel",
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
            <h3>{t('iama')} <span style={{color: 'var(--main-color)'}}>Full-Stack Developer</span></h3>
            <div className="ai-badge">
                <i className='bx bxs-bot'></i> {t('aiSpecialist')}
            </div>
            <p style={{marginTop: '2rem'}}>{t('homeDesc')}</p>

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
                    <h3>{t('edu1Title')}</h3>
                    <p>{t('edu1Desc')}</p>
                </div>
            </div>
            <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-date">2023</div>
                <div className="timeline-content">
                    <h3>{t('edu2Title')}</h3>
                    <p>{t('edu2Desc')}</p>
                </div>
            </div>
            <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-date">2024</div>
                <div className="timeline-content">
                    <h3>{t('edu3Title')}</h3>
                    <p>{t('edu3Desc')}</p>
                </div>
            </div>
            <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-date">2025</div>
                <div className="timeline-content">
                    <h3>{t('edu4Title')}</h3>
                    <p>{t('edu4Desc')}</p>
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

    {sections.skills !== false && (
    <section className="skills" id="skills" style={{background: 'var(--bg-color)'}}>
        <h2 className="heading"><span>{t('skillsHeading')}</span></h2>
        <div className="skills-grid">
            <div className="skill-card">
                <i className='bx bxl-react'></i>
                <h5>React / Next.js</h5>
            </div>
            <div className="skill-card">
                <i className='bx bxl-nodejs'></i>
                <h5>Node.js</h5>
            </div>
            <div className="skill-card">
                <i className='bx bxl-javascript'></i>
                <h5>JavaScript (ES6+)</h5>
            </div>
            <div className="skill-card">
                <i className='bx bxl-python'></i>
                <h5>Python</h5>
            </div>
            <div className="skill-card">
                <i className='bx bxl-java'></i>
                <h5>Java</h5>
            </div>
            <div className="skill-card">
                <i className='bx bxs-brain'></i>
                <h5>AI / GPT Prompting</h5>
            </div>
            <div className="skill-card">
                <i className='bx bxl-firebase'></i>
                <h5>Firebase</h5>
            </div>
            <div className="skill-card">
                <i className='bx bxl-tailwind-css'></i>
                <h5>Modern Styling</h5>
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