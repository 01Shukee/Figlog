import Navbar from './Navbar'
import Footer from './Footer'

export default function PageLayout({ children, footerLeft }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-base">
      <Navbar />
      <main className="flex-1 page-enter">
        {children}
      </main>
      <Footer left={footerLeft} />
    </div>
  )
}
