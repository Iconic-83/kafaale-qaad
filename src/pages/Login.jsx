import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const C = { primary: '#0B3D91', green: '#1A6B3C', accent: '#E8A020', bg: '#F0F4F8', border: '#E2E8F0', error: '#C0392B' };

export default function Login() {
  const { login, register, loading } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState('login');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'reporter', country: '', city: '', phone: '' });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = tab === 'login'
        ? await login(form.email, form.password)
        : await register({ name: form.name, email: form.email, password: form.password, role: form.role, country: form.country, city: form.city, phone: form.phone });
      const role = user?.user?.role || '';
      if (['admin','super_admin'].includes(role)) nav('/dashboard');
      else if (role === 'field_agent') nav('/dashboard');
      else if (role === 'donor') nav('/cases');
      else nav('/dashboard');
    } catch (err) { setError(err.message); }
  };

  const inp = (key, placeholder, type='text') => (
    <input value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} type={type} required
      style={{ width: '100%', padding: '12px 16px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 15, background: C.bg, outline: 'none', boxSizing: 'border-box' }} />
  );

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${C.primary}15, ${C.green}15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.12)', padding: '40px', width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🌍</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.primary }}>Kafaale Qaad</div>
          <div style={{ color: '#6B7280', fontSize: 14 }}>Humanitarian Aid Platform</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: C.bg, borderRadius: 10, marginBottom: 28, padding: 4 }}>
          {['login','register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: tab===t ? C.primary : 'none', color: tab===t ? '#fff' : '#6B7280', transition: 'all 0.2s' }}>
              {t === 'login' ? '🔐 Sign In' : '✨ Register'}
            </button>
          ))}
        </div>

        {error && <div style={{ background: '#FEE2E2', border: `1px solid ${C.error}`, color: C.error, padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}

        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {tab === 'register' && inp('name', 'Full Name')}
          {inp('email', 'Email Address', 'email')}
          {inp('password', 'Password (min 8 chars)', 'password')}
          {tab === 'register' && (
            <>
              <select value={form.role} onChange={e => set('role', e.target.value)}
                style={{ width: '100%', padding: '12px 16px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 15, background: C.bg }}>
                <option value="reporter">📝 Reporter — Report emergency cases</option>
                <option value="donor">💳 Donor / Sponsor — Fund verified cases</option>
                <option value="field_agent">🔍 Field Agent — Investigate cases</option>
              </select>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {inp('country', 'Country')}
                {inp('city', 'City')}
              </div>
              {inp('phone', 'Phone (optional)')}
            </>
          )}
          <button type="submit" disabled={loading}
            style={{ padding: '14px', background: `linear-gradient(135deg, ${C.primary}, ${C.green})`, color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? '⏳ Please wait...' : tab === 'login' ? '🔐 Sign In' : '✨ Create Account'}
          </button>
        </form>

        {/* Demo credentials */}
        {tab === 'login' && (
          <div style={{ marginTop: 20, padding: 14, background: C.bg, borderRadius: 10, fontSize: 13 }}>
            <div style={{ fontWeight: 600, color: C.primary, marginBottom: 8 }}>🔑 Demo Accounts</div>
            {[['admin@kafaale.org','Admin'],['donor@kafaale.org','Donor'],['reporter@kafaale.org','Reporter'],['agent@kafaale.org','Field Agent']].map(([email, label]) => (
              <div key={email} onClick={() => setForm(p => ({ ...p, email, password: 'Kafaale123!' }))}
                style={{ cursor: 'pointer', color: C.primary, marginBottom: 4, fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span>{email}</span><span style={{ background: C.primary, color: '#fff', padding: '1px 6px', borderRadius: 4 }}>{label}</span>
              </div>
            ))}
            <div style={{ color: '#6B7280', marginTop: 6, fontSize: 11 }}>Password: <strong>Kafaale123!</strong> · Click any to fill</div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6B7280' }}>
          <Link to="/" style={{ color: C.primary }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
