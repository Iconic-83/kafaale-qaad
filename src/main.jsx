import { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';

class ErrorBoundary extends Component {
  state = { error: null, info: null };
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(error, info) { this.setState({ info }); }
  render() {
    if (this.state.error) return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F4F7FC', fontFamily: 'system-ui', gap: 12, padding: 24 }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#C0392B' }}>Something went wrong</div>
        <pre style={{ fontSize: 11, color: '#C0392B', background: '#FEE2E2', padding: 12, borderRadius: 8, maxWidth: 600, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{this.state.error.message}</pre>
        <pre style={{ fontSize: 10, color: '#5A6E8A', background: '#fff', padding: 12, borderRadius: 8, maxWidth: 600, overflowX: 'auto', whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto' }}>{this.state.info?.componentStack}</pre>
        <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} style={{ padding: '10px 24px', background: '#004B96', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Clear & Back to Login</button>
      </div>
    );
    return this.props.children;
  }
}
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar       from './components/Navbar.jsx';
import Footer       from './components/Footer.jsx';
import AiAssistant  from './components/AiAssistant.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import Home         from './pages/Home.jsx';
import About        from './pages/About.jsx';
import HowItWorks   from './pages/HowItWorks.jsx';
import Cases        from './pages/Cases.jsx';
import CaseDetail   from './pages/CaseDetail.jsx';
import Donate       from './pages/Donate.jsx';
import Contact        from './pages/Contact.jsx';
import ImpactPartners from './pages/ImpactPartners.jsx';
import Programs       from './pages/Programs.jsx';
import Stories        from './pages/Stories.jsx';
import Volunteer      from './pages/Volunteer.jsx';
import FAQ            from './pages/FAQ.jsx';
import Transparency   from './pages/Transparency.jsx';
import Login          from './pages/Login.jsx';
import Dashboard    from './KafaaleQaadApp.jsx';

function NotFound() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "system-ui", color: "#0D1F3C", textAlign: "center", padding: 24 }}>
      <div style={{ fontSize: 72 }}>🔍</div>
      <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>404 — Page Not Found</h1>
      <p style={{ fontSize: 16, color: "#5A6E8A", maxWidth: 420, lineHeight: 1.7 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/" style={{ padding: "12px 28px", background: "#004B96", color: "#fff", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>
        ← Back to Home
      </a>
    </div>
  );
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <AiAssistant context="website" />
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"              element={<Layout><Home /></Layout>} />
          <Route path="/about"         element={<Layout><About /></Layout>} />
          <Route path="/how-it-works"  element={<Layout><HowItWorks /></Layout>} />
          <Route path="/cases"         element={<Layout><Cases /></Layout>} />
          <Route path="/cases/:id"     element={<Layout><CaseDetail /></Layout>} />
          <Route path="/donate"        element={<Layout><Donate /></Layout>} />
          <Route path="/contact"          element={<Layout><Contact /></Layout>} />
          <Route path="/partners"         element={<Layout><ImpactPartners /></Layout>} />
          <Route path="/programs"         element={<Layout><Programs /></Layout>} />
          <Route path="/stories"          element={<Layout><Stories /></Layout>} />
          <Route path="/volunteer"        element={<Layout><Volunteer /></Layout>} />
          <Route path="/faq"              element={<Layout><FAQ /></Layout>} />
          <Route path="/transparency"     element={<Layout><Transparency /></Layout>} />
          <Route path="/login"            element={<Login />} />
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/dashboard/*"   element={<Dashboard />} />
          <Route path="*"             element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </LanguageProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode><ErrorBoundary><App /></ErrorBoundary></StrictMode>
);
