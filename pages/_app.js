import '../style.css'
import { useRouter } from 'next/router'
import { SpeedInsights } from "@vercel/speed-insights/next"

function App({ Component, pageProps }) {
  const router = useRouter()
  const dir = router.locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <div dir={dir}>
      <Component {...pageProps} />
      <SpeedInsights />
    </div>
  )
}

export default App