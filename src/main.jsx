import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar   from './components/Navbar.jsx'
import Footer   from './components/Footer.jsx'
import Home     from './pages/Home.jsx'
import About    from './pages/About.jsx'
import HowItWorks from './pages/HowItWorks.jsx'
import Cases    from './pages/Cases.jsx'
import Donate   from './pages/Donate.jsx'
import Contact  from './pages/Contact.jsx'
import KafaaleQaadApp from './KafaaleQaadApp.jsx'

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public website */}
        <Route path="/"           element={<Layout><Home /></Layout>} />
        <Route path="/about"      element={<Layout><About /></Layout>} />
        <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
        <Route path="/cases"      element={<Layout><Cases /></Layout>} />
        <Route path="/donate"     element={<Layout><Donate /></Layout>} />
        <Route path="/contact"    element={<Layout><Contact /></Layout>} />

        {/* Dashboard app (no navbar/footer) */}
        <Route path="/dashboard"  element={<KafaaleQaadApp />} />
        <Route path="/dashboard/*" element={<KafaaleQaadApp />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>
)
