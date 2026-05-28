import { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F4F7FC', fontFamily: 'system-ui', gap: 16, padding: 24 }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#C0392B' }}>Something went wrong</div>
        <div style={{ fontSize: 13, color: '#5A6E8A', maxWidth: 400, textAlign: 'center' }}>{this.state.error.message}</div>
        <button onClick={() => window.location.href = '/login'} style={{ padding: '10px 24px', background: '#004B96', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Back to Login</button>
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
import Login          from './pages/Login.jsx';
import Dashboard    from './KafaaleQaadApp.jsx';

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
          <Route path="/contact"         element={<Layout><Contact /></Layout>} />
          <Route path="/partners"       element={<Layout><ImpactPartners /></Layout>} />
          <Route path="/login"         element={<Login />} />
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/dashboard/*"   element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </LanguageProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode><ErrorBoundary><App /></ErrorBoundary></StrictMode>
);
