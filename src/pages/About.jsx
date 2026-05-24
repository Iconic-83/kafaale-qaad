import { Link } from "react-router-dom";

const C = { primary: "#0B3D91", secondary: "#1A6B3C", accent: "#E8A020", muted: "#6B7280", bg: "#F0F4F8", border: "#E2E8F0" };

const TEAM = [
  { name: "Abdimalik Hassan",  role: "Project Lead & CEO",       icon: "👨‍💼", bg: "#DBEAFE", color: "#1D4ED8" },
  { name: "Asha Mohammed",     role: "Product Manager",          icon: "👩‍💼", bg: "#D1FAE5", color: "#065F46" },
  { name: "Fatima Ali",        role: "Design Lead",              icon: "👩‍🎨", bg: "#FCE7F3", color: "#9D174D" },
  { name: "Omar Ibrahim",      role: "Lead Backend Engineer",    icon: "👨‍💻", bg: "#EDE9FE", color: "#5B21B6" },
  { name: "Hodan Warsame",     role: "Field Operations Manager", icon: "👩‍🔬", bg: "#FEF3C7", color: "#92400E" },
  { name: "Mahad Yusuf",       role: "Security & DevOps",        icon: "👨‍🔧", bg: "#FEE2E2", color: "#991B1B" },
];

const VALUES = [
  { icon: "🔍", title: "Transparency",   desc: "Every case, every transaction, and every action is logged and auditable. Nothing is hidden." },
  { icon: "🛡️", title: "Trust",          desc: "Multi-layer verification, fraud detection, and encrypted payments build donor confidence." },
  { icon: "⚡", title: "Efficiency",     desc: "8-step automated workflow reduces manual work, speeds up aid delivery and eliminates bottlenecks." },
  { icon: "🌍", title: "Impact",         desc: "Real-world impact measured with proof-of-delivery photos, GPS verification, and impact reports." },
  { icon: "🤝", title: "Collaboration",  desc: "Connecting reporters, field teams, donors, and administrators in one seamless platform." },
  { icon: "📱", title: "Accessibility",  desc: "Web, mobile, and offline-capable — works in low-connectivity environments in the field." },
];

const MILESTONES = [
  { year: "2025 Q1", event: "Project concept & requirements gathering", done: true  },
  { year: "2025 Q2", event: "System architecture design and database schema", done: true  },
  { year: "2025 Q3", event: "Core platform development begins (frontend + backend)", done: true  },
  { year: "2025 Q4", event: "Field team mobile app + GPS integration", done: true  },
  { year: "2026 Q1", event: "Payment gateway integration (Stripe, PayPal, Ama)", done: true  },
  { year: "2026 Q2", event: "Platform launch — production ready ✅", done: true  },
  { year: "2026 Q3", event: "SMS/WhatsApp notifications + advanced analytics", done: false },
  { year: "2027",    event: "AI case prioritization + UNHCR database integration", done: false },
];

export default function About() {
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1A202C" }}>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)`, color: "#fff", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span style={{ background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)", borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700 }}>
            About Kafaale Qaad
          </span>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, margin: "20px 0 16px", lineHeight: 1.1 }}>
            Our Mission: <span style={{ color: C.accent }}>Transparent Aid</span>
          </h1>
          <p style={{ fontSize: 18, opacity: 0.85, lineHeight: 1.8 }}>
            KAFAALE QAAD means "The System That Brings Together" in Somali. We exist to ensure that every dollar of humanitarian aid reaches the people who truly need it — verified, tracked, and proven.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <span style={{ background: C.primary + "15", color: C.primary, borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 700 }}>Our Mission</span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 900, margin: "16px 0 16px", lineHeight: 1.2 }}>
              Fraud-proof humanitarian aid with complete traceability
            </h2>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 20 }}>
              In humanitarian crises, funds often disappear before reaching beneficiaries. Duplicate cases, unverified claims, and manual processes allow abuse to thrive. Kafaale Qaad solves this with a fully digital, verified, and auditable system.
            </p>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8 }}>
              From the moment a case is reported to the moment aid is delivered — every step is recorded, verified by multiple parties, and open to audit. Donors can see exactly what happened with their money.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { icon: "📋", val: "8 Steps",     label: "Verified workflow pipeline",  color: C.primary },
              { icon: "👥", val: "5 Roles",     label: "Dedicated user dashboards",   color: "#8B5CF6" },
              { icon: "🔐", val: "100%",        label: "Encrypted transactions",       color: C.secondary },
              { icon: "📊", val: "Real-time",   label: "Analytics & reporting",        color: C.accent },
            ].map(s => (
              <div key={s.label} style={{ background: C.bg, borderRadius: 16, padding: 24, textAlign: "center", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section style={{ padding: "80px 24px", background: C.bg }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ background: "#FEE2E2", color: "#991B1B", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 700 }}>The Problem We Solve</span>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, margin: "16px 0 10px" }}>Why Kafaale Qaad Exists</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: "🚨", title: "Fraud & Duplicates",   desc: "Fake cases and duplicate applications drain aid budgets. Without verification, resources go to the wrong people.", color: "#EF4444", bg: "#FEF2F2" },
              { icon: "🌫️", title: "No Transparency",      desc: "Donors have no way to verify their money reached beneficiaries. Trust erodes, donations decline.", color: "#F59E0B", bg: "#FFFBEB" },
              { icon: "🐢", title: "Slow Manual Processes", desc: "Paper-based or disconnected systems slow down aid delivery. Cases sit in queues for weeks unnecessarily.", color: "#8B5CF6", bg: "#F5F3FF" },
            ].map(p => (
              <div key={p.title} style={{ background: "#fff", borderRadius: 18, padding: 32, border: `1px solid ${C.border}`, boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 20 }}>{p.icon}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: p.color, marginBottom: 10 }}>{p.title}</div>
                <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{p.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <div style={{ display: "inline-block", background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, borderRadius: 18, padding: "28px 48px", color: "#fff", maxWidth: 700 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
              <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 10 }}>Kafaale Qaad solves all three</div>
              <div style={{ fontSize: 15, opacity: 0.85, lineHeight: 1.7 }}>
                AI fraud detection + GPS verification + multi-party approval + encrypted audit trail = 100% transparent aid.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, margin: "0 0 10px" }}>Our Core Values</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{ padding: 28, borderRadius: 16, border: `1px solid ${C.border}`, background: "#FAFAFA", display: "flex", gap: 16 }}>
                <div style={{ fontSize: 32, flexShrink: 0 }}>{v.icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>{v.title}</div>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section style={{ padding: "80px 24px", background: C.bg }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, margin: "0 0 10px" }}>Project Roadmap</h2>
            <p style={{ fontSize: 16, color: C.muted }}>From concept to production — and beyond.</p>
          </div>
          <div style={{ position: "relative" }}>
            {MILESTONES.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 20, marginBottom: 28, alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 40 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: m.done ? C.secondary : "#D1D5DB", border: "3px solid #fff", boxShadow: `0 0 0 2px ${m.done ? C.secondary : "#D1D5DB"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {m.done && <span style={{ color: "#fff", fontSize: 9, fontWeight: 900 }}>✓</span>}
                  </div>
                  {i < MILESTONES.length - 1 && <div style={{ width: 2, height: 28, background: m.done ? C.secondary + "40" : "#E5E7EB", marginTop: 6 }} />}
                </div>
                <div style={{ background: "#fff", borderRadius: 12, padding: "14px 20px", flex: 1, border: `1px solid ${C.border}`, opacity: m.done ? 1 : 0.55 }}>
                  <span style={{ background: m.done ? "#D1FAE5" : "#F3F4F6", color: m.done ? "#065F46" : C.muted, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{m.year}</span>
                  <div style={{ fontSize: 14, fontWeight: m.done ? 700 : 500, color: m.done ? "#1A202C" : C.muted, marginTop: 8 }}>{m.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, margin: "0 0 10px" }}>Meet the Team</h2>
            <p style={{ fontSize: 16, color: C.muted }}>Developers, designers, and humanitarian professionals.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {TEAM.map((t, i) => (
              <div key={i} style={{ textAlign: "center", padding: 32, background: "#FAFAFA", borderRadius: 20, border: `1px solid ${C.border}` }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 16px" }}>{t.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{t.name}</div>
                <div style={{ fontSize: 13, color: t.color, fontWeight: 700, marginTop: 4 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)`, padding: "60px 24px", textAlign: "center", color: "#fff" }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 16px" }}>Join the Mission</h2>
        <p style={{ fontSize: 17, opacity: 0.85, marginBottom: 32 }}>Help us deliver transparent humanitarian aid to those who need it most.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/donate"  style={{ padding: "14px 32px", background: C.accent, color: "#fff", borderRadius: 12, textDecoration: "none", fontWeight: 800, fontSize: 15 }}>❤️ Become a Donor</Link>
          <Link to="/contact" style={{ padding: "14px 32px", background: "rgba(255,255,255,.15)", color: "#fff", border: "2px solid rgba(255,255,255,.4)", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>Contact Us →</Link>
        </div>
      </section>
    </div>
  );
}
